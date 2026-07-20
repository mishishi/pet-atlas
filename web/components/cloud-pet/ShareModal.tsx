/**
 * web/components/cloud-pet/ShareModal.tsx · M2 D 分享海报
 *
 * 流程:
 * 1. 用户点 /profile 的"分享我的云宠物"按钮
 * 2. Modal 弹出,显示 9:16 海报预览(html2canvas 截图)
 * 3. 用户点"保存到相册/下载"→ 生成 PNG blob → 触发下载
 * 4. 用户可长按图片(移动端)/右键保存(桌面端)
 *
 * 关键技术:
 * - html2canvas-pro 客户端截图(SSR 时不 import)
 * - 9:16 比例 (跟图鉴一致) 固定 720x1280 渲染后缩放
 * - **图片预加载为 blob URL**(避 CORS + 兼容 html2canvas)
 *   - 第一次 render 时 fetch(pet.tcbUrl) → blob → blob URL
 *   - 失败时回退原始 URL + 显示错误提示
 *
 * 升级路径 (M3+):
 * - Web Share API (移动端直接调起系统分享面板)
 * - 微信 SDK 分享朋友圈(需微信开放平台)
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { type CloudPet, PERSONALITY_LABEL } from "@/lib/cloudPet";

export function ShareModal({
  pet,
  onClose,
}: {
  pet: CloudPet;
  onClose: () => void;
}) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 把 TCB 图片预 fetch 成 blob URL(同源,html2canvas 不会污染 canvas)
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [portraitFailed, setPortraitFailed] = useState(false);

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 锁背景滚动
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  // 加载立绘 → 转为 data URL(关键!)
  // 流程:
  //  1. fetch(url, { mode: "no-cors" }) — no-cors 不触发 preflight,响应 opaque
  //  2. response.blob() — opaque 响应仍能拿 body 字节
  //  3. FileReader.readAsDataURL → "data:image/png;base64,..." 
  //  4. <img src={dataUrl}> — data URL 浏览器视作 same-origin
  //  5. canvas 不污染 → toBlob 成功
  // 为什么不用 crossOrigin: 用户环境 fetch/img 带 CORS 都失败(原因待查)
  // 为什么不用 mode: "cors": 用户浏览器里 fetch 也失败(可能 TCB 桶 OPTIONS 头不全)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(pet.tcbUrl, { mode: "no-cors" });
        const blob = await res.blob();
        if (cancelled) return;
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        setPortraitUrl(dataUrl);
      } catch (err) {
        console.warn("[ShareModal] 加载立绘失败,回退原 URL:", err);
        if (!cancelled) setPortraitUrl(pet.tcbUrl);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pet.tcbUrl]);

  // 图片加载失败回调
  const handlePortraitError = useCallback(() => {
    console.warn("[ShareModal] 立绘 img 加载失败:", portraitUrl);
    setPortraitFailed(true);
  }, [portraitUrl]);

  async function handleDownload() {
    if (!posterRef.current) return;
    setBusy(true);
    setError(null);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: "#F5EFE0",
        scale: 2, // 高清
        logging: false,
        // img 用的是 data URL(同源),canvas 不会被污染
        useCORS: false,
        allowTaint: false,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png", 0.95)
      );
      if (!blob) throw new Error("生成图片失败");
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      // 触发下载
      const a = document.createElement("a");
      a.href = url;
      a.download = `pet-atlas-${pet.petName}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("[ShareModal] 生成失败:", err);
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setBusy(false);
    }
  }

  function handleRegenerate() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(42, 37, 32, 0.75)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-oat-100 border-2 border-warm-brown shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-brown-200 bg-oat-50/95 backdrop-blur">
          <h3 className="font-serif text-lg font-bold text-brown-900">
            🎁 分享我的云宠物
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-brown-100 flex items-center justify-center text-brown-600 text-xl"
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* 海报预览(9:16) */}
          <div className="flex justify-center mb-4">
            <SharePoster
              ref={posterRef}
              pet={pet}
              portraitUrl={portraitUrl}
              portraitFailed={portraitFailed}
              onPortraitError={handlePortraitError}
            />
          </div>

          {/* 加载状态 */}
          {!portraitUrl && !portraitFailed && (
            <div className="mb-3 p-2 rounded-lg bg-brown-50 border border-brown-200 text-xs text-brown-600 text-center">
              ⏳ 正在加载立绘...
            </div>
          )}
          {portraitFailed && (
            <div className="mb-3 p-2 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-800 text-center">
              ⚠️ 立绘加载失败,海报将显示占位
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-brick/10 border border-brick/30 text-sm text-brick">
              ⚠️ {error}
            </div>
          )}

          {/* 预览已生成 */}
          {previewUrl && (
            <div className="mb-3 p-3 rounded-lg bg-forest/10 border border-forest/30 text-xs text-forest">
              ✅ 已下载!手机端可长按图片保存,桌面端已自动下载
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2">
            {previewUrl ? (
              <>
                <button
                  onClick={handleRegenerate}
                  className="flex-1 py-2.5 rounded-lg border-2 border-warm-brown text-warm-brown font-medium hover:bg-warm-brown/5 transition-colors text-sm"
                >
                  重新生成
                </button>
                <a
                  href={previewUrl}
                  download={`pet-atlas-${pet.petName}.png`}
                  className="flex-1 py-2.5 rounded-lg bg-warm-brown text-white font-medium text-center text-sm hover:bg-warm-brown/90 transition-colors"
                >
                  再次下载
                </a>
              </>
            ) : (
              <button
                onClick={handleDownload}
                disabled={busy}
                className="w-full py-3 rounded-lg bg-warm-brown text-white font-bold hover:bg-warm-brown/90 transition-colors disabled:bg-brown-300 disabled:cursor-not-allowed"
              >
                {busy ? "生成中..." : "保存为图片 (PNG)"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== 海报本体 (9:16, 720x1280 内部坐标系) =====

import { forwardRef } from "react";

const POSTER_WIDTH = 720;
const POSTER_HEIGHT = 1280;
const POSTER_SCALE = 0.45; // 展示缩放比例

export const SharePoster = forwardRef<
  HTMLDivElement,
  {
    pet: CloudPet;
    portraitUrl: string | null;
    portraitFailed: boolean;
    onPortraitError: () => void;
  }
>(function SharePoster(
  { pet, portraitUrl, portraitFailed, onPortraitError },
  ref
) {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: POSTER_WIDTH * POSTER_SCALE,
        height: POSTER_HEIGHT * POSTER_SCALE,
        background: "#F5EFE0",
      }}
    >
      {/* 内部内容按 1:1 渲染,通过外层 transform 缩放展示 */}
      <div
        style={{
          width: POSTER_WIDTH,
          height: POSTER_HEIGHT,
          transform: `scale(${POSTER_SCALE})`,
          transformOrigin: "top left",
        }}
      >
        <PosterContent
          pet={pet}
          portraitUrl={portraitUrl}
          portraitFailed={portraitFailed}
          onPortraitError={onPortraitError}
        />
      </div>
    </div>
  );
});

function PosterContent({
  pet,
  portraitUrl,
  portraitFailed,
  onPortraitError,
}: {
  pet: CloudPet;
  portraitUrl: string | null;
  portraitFailed: boolean;
  onPortraitError: () => void;
}) {
  return (
    <div
      className="relative w-full h-full flex flex-col"
      style={{
        background: `
          linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 50%, #E8D9B8 100%),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/></svg>")
        `,
      }}
    >
      {/* 顶部:小标 + 编号 */}
      <div className="px-12 pt-10 flex items-baseline justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-brown-600">
          MUSEUM SPECIMEN
        </span>
        <span className="font-mono text-sm font-bold text-brick">No.052</span>
      </div>

      {/* 立绘 */}
      <div className="flex-1 flex items-center justify-center px-12 py-8">
        <div
          className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-warm-brown"
          style={{
            boxShadow: "0 8px 32px rgba(110, 86, 53, 0.3)",
          }}
        >
          {portraitUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portraitUrl}
              alt={pet.petName}
              className="w-full h-full object-cover"
              onError={onPortraitError}
            />
          ) : portraitFailed ? (
            // 加载失败,显示占位
            <div
              className="w-full h-full flex flex-col items-center justify-center bg-oat-200"
              style={{ color: "#8B6F47" }}
            >
              <div className="text-6xl mb-2">🐾</div>
              <div className="font-serif text-2xl font-bold text-brown-900">
                {pet.petName}
              </div>
              <div className="text-xs text-brown-600 mt-1">
                立绘加载失败
              </div>
            </div>
          ) : (
            // 加载中,显示骨架
            <div
              className="w-full h-full flex items-center justify-center bg-oat-200 animate-pulse"
              style={{ color: "#A89A78" }}
            >
              <span className="text-sm">载入中...</span>
            </div>
          )}
        </div>
      </div>

      {/* 名字 + 品种 */}
      <div className="px-12 text-center">
        <h1
          className="font-serif text-5xl font-bold text-brown-900 mb-2"
          style={{ letterSpacing: "0.05em" }}
        >
          {pet.petName}
        </h1>
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-brown-600">
          {pet.breedZh}
        </p>
      </div>

      {/* 分隔 */}
      <div className="flex items-center justify-center my-6 px-12">
        <div className="flex-1 h-px bg-warm-brown/40" />
        <span className="px-3 text-warm-brown">✦</span>
        <div className="flex-1 h-px bg-warm-brown/40" />
      </div>

      {/* 性格 + 品种 chip */}
      <div className="px-12 flex items-center justify-center gap-3 mb-6">
        <div
          className="px-4 py-1.5 rounded-full border-2 border-warm-brown/60 bg-oat-50/80 text-sm font-medium"
          style={{ color: "#8B6F47" }}
        >
          {PERSONALITY_LABEL[pet.personality]}
        </div>
        <div className="px-4 py-1.5 rounded-full border-2 border-warm-brown/60 bg-oat-50/80 text-sm font-medium text-brown-700">
          变体 v{pet.variantIndex}
        </div>
      </div>

      {/* 印章 */}
      <div className="flex justify-center mb-6">
        <div
          className="px-8 py-3 text-center"
          style={{
            background: "rgba(164, 74, 63, 0.92)",
            clipPath:
              "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))",
            boxShadow:
              "0 4px 12px rgba(164, 74, 63, 0.3), inset 0 0 0 1px rgba(255, 220, 200, 0.3)",
          }}
        >
          <div className="font-serif text-lg font-bold text-[#F5E9D0] tracking-widest">
            我的云宠物
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F5E9D0]/80 mt-0.5">
            MY CLOUD PET · PET ATLAS
          </div>
        </div>
      </div>

      {/* 底部:URL */}
      <div className="px-12 pb-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brown-500">
          out-three-tan.vercel.app
        </p>
      </div>

      {/* 4 角装饰 */}
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />
    </div>
  );
}

function CornerOrnament({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const map = {
    tl: { top: 16, left: 16, transform: "rotate(0deg)" },
    tr: { top: 16, right: 16, transform: "rotate(90deg)" },
    bl: { bottom: 16, left: 16, transform: "rotate(-90deg)" },
    br: { bottom: 16, right: 16, transform: "rotate(180deg)" },
  };
  const p = map[position];
  return (
    <div
      className="absolute pointer-events-none"
      style={{ ...p, color: "#8B6F47", opacity: 0.5 }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M 0 12 L 0 0 L 12 0" />
        <circle cx="0" cy="0" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
