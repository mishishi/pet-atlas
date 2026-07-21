"use client";

/**
 * AtlasViewer · 标本卡翻页(2026-07-20 重设计)
 *
 * 新功能:
 *  - 状态驱动翻页(useState),URL 同步(router.replace,no scroll)
 *  - 键盘 ←/→ 翻页
 *  - CSS 3D flip + 交叉淡入动画
 *  - 顶部进度条(显示 current/total + 6 圆点)
 *  - 右侧 6 张缩略图(sticky,active 高亮)
 *  - 全屏模式(Fullscreen API,左下角 toggle)
 *  - Lazy load:只渲染当前 + 邻页,其他 3 页不下载
 *  - 木框 + VINTAGE PAPER 飘带 + LeafDivider 风格统一
 */

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ATLAS_PAGE_COUNT, ATLAS_SLOTS } from "@/lib/atlas-constants";
import { SpecimenFrame } from "@/components/brand/SpecimenFrame";

interface AtlasViewerProps {
  slug: string;
  nameZh: string;
  nameEn: string;
  gallery: string[];
}

const EN_LABELS = ["Cover", "Traits", "Personality", "History", "Care", "Famous"];

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export default function AtlasViewer({
  slug,
  nameZh,
  nameEn,
  gallery,
}: AtlasViewerProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const initialPage = clamp(parseInt(sp?.get("page") ?? "1", 10) || 1, 1, ATLAS_PAGE_COUNT);
  const [page, setPage] = useState(initialPage);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const detailHref = `/pets/${slug}`;
  const total = ATLAS_PAGE_COUNT;
  const currentLabel = ATLAS_SLOTS[page - 1] ?? `图 ${page}`;
  const currentEn = EN_LABELS[page - 1] ?? `Plate ${page}`;
  const currentImage = gallery[page - 1];
  const prevImage = page > 1 ? gallery[page - 2] : null;
  const nextImage = page < total ? gallery[page] : null;
  // AtlasViewer 用的全尺寸封面(就是 gallery[0])
  const fullCoverUrl = gallery[0] || "";

  /* ==================== 翻页(状态 + URL 同步) ==================== */
  const goTo = useCallback(
    (target: number, dir?: "next" | "prev") => {
      const clamped = clamp(target, 1, total);
      if (clamped === page || isFlipping) return;
      if (dir) setDirection(dir);
      else setDirection(clamped > page ? "next" : "prev");
      setIsFlipping(true);
      setPage(clamped);
      // 动画 350ms 后才允许下一次翻
      setTimeout(() => setIsFlipping(false), 380);
    },
    [page, isFlipping, total]
  );

  // URL 同步(不刷新页面,不滚动)
  useEffect(() => {
    const url = `/pets/${slug}/atlas?page=${page}`;
    router.replace(url, { scroll: false });
  }, [page, slug, router]);

  /* ==================== 键盘 ←/→ 翻页 ==================== */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        goTo(page - 1, "prev");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        goTo(page + 1, "next");
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "Escape" && isFullscreen) {
        exitFullscreen();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(1, "prev");
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(total, "next");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, goTo, isFullscreen, total]);

  /* ==================== Fullscreen API ==================== */
  const containerRef = useRef<HTMLDivElement>(null);

  const enterFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      await containerRef.current.requestFullscreen();
    } catch (e) {
      /* ignore */
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) exitFullscreen();
    else enterFullscreen();
  }, [enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* ==================== Preload 邻页(浏览器原生) ==================== */
  useEffect(() => {
    [prevImage, nextImage].forEach((url) => {
      if (!url) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
      // 不删,留着让浏览器复用缓存
    });
  }, [prevImage, nextImage]);

  /* ==================== 触摸滑动 ==================== */
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 50) {
      goTo(page + (dx < 0 ? 1 : -1), dx < 0 ? "next" : "prev");
    }
    touchStartX.current = null;
  };

  /* ==================== 渲染 ==================== */
  // 计算 flip 动画 class
  const flipClass = useMemo(() => {
    if (!isFlipping) return "";
    return direction === "next" ? "atlas-flip-out-left" : "atlas-flip-out-right";
  }, [isFlipping, direction]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
      }}
    >
      {/* 纸张噪点 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/></svg>\")",
        }}
      />

      {/* 角部水渍 */}
      <div
        className="absolute top-0 left-0 w-72 h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(139, 111, 71, 0.14) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(139, 111, 71, 0.12) 0%, transparent 60%)",
        }}
      />

      <main
        className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-10"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ============ Top bar: 返回 + 进度条 ============ */}
        <div className="flex items-center justify-between gap-4 mb-4 md:mb-6">
          <Link
            href={detailHref}
            className="group inline-flex items-center gap-2 text-sm text-brown-700 hover:text-brown-900 transition-colors"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            <span className="hidden sm:inline">{nameZh}</span>
            <span className="sm:hidden">返回</span>
          </Link>

          {/* 进度条(6 圆点 + Page N / 6) */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
                const isActive = n === page;
                const isPassed = n < page;
                return (
                  <button
                    key={n}
                    onClick={() => goTo(n, n > page ? "next" : "prev")}
                    aria-label={`跳到第 ${n} 页`}
                    className={`h-1.5 rounded-full transition-all ${
                      isActive
                        ? "w-8 bg-brown-700"
                        : isPassed
                        ? "w-3 bg-brown-500 hover:bg-brown-700"
                        : "w-1.5 bg-brown-300 hover:bg-brown-500"
                    }`}
                  />
                );
              })}
            </div>
            <div className="font-mono text-xs text-brown-700">
              <span className="text-base font-bold">{page}</span>
              <span className="text-brown-500"> / {total}</span>
            </div>
          </div>
        </div>

        {/* ============ 中部:大画框 + 左右翻页按钮 ============ */}
        <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6 mb-4 md:mb-6">
          {/* 左侧:上一张(桌机)/顶标(移动) */}
          <div className="flex sm:block">
            <button
              onClick={() => goTo(page - 1, "prev")}
              disabled={page === 1}
              className="group flex items-center gap-2 text-sm text-brown-700 hover:text-brown-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="上一张"
            >
              <span className="inline-block w-9 h-9 md:w-12 md:h-12 rounded-full border-2 border-brown-300 group-hover:border-brown-700 group-hover:bg-brown-700 group-hover:text-oat-100 transition-all flex items-center justify-center text-lg">
                ←
              </span>
              <span className="hidden md:inline">上一张</span>
            </button>
          </div>

          {/* 中:大画框 */}
          <div className="flex justify-center">
            <div
              className={`w-full max-w-[360px] sm:max-w-[440px] md:max-w-[520px] ${flipClass}`}
              key={page}
            >
              <SpecimenFrame
                url={currentImage || fullCoverUrl}
                nameZh={nameZh}
                nameEn={nameEn}
                width="100%"
                priority
                showRibbon
                shadowLevel="lg"
              />
              {/* 大画框下面的页标 */}
              <div className="mt-6 md:mt-8 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-1">
                  Plate {String(page).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </div>
                <h1 className="font-serif text-xl md:text-2xl font-bold text-brown-900">
                  {currentLabel}
                </h1>
                <p className="mt-0.5 font-serif italic text-sm text-brown-500">
                  {currentEn}
                </p>
              </div>
            </div>
          </div>

          {/* 右侧:下一张 */}
          <div className="flex sm:block justify-end">
            <button
              onClick={() => goTo(page + 1, "next")}
              disabled={page === total}
              className="group flex items-center gap-2 text-sm text-brown-700 hover:text-brown-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="下一张"
            >
              <span className="hidden md:inline">下一张</span>
              <span className="inline-block w-9 h-9 md:w-12 md:h-12 rounded-full border-2 border-brown-300 group-hover:border-brown-700 group-hover:bg-brown-700 group-hover:text-oat-100 transition-all flex items-center justify-center text-lg">
                →
              </span>
            </button>
          </div>
        </div>

        {/* ============ 底部:缩略图 + 全屏 + 返回详情 ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
          {/* 6 张缩略图 */}
          <ol className="grid grid-cols-6 gap-2 md:gap-3 max-w-2xl">
            {gallery.map((url, i) => {
              const n = i + 1;
              const isActive = n === page;
              const isPast = n < page;
              const isFuture = n > page;
              return (
                <li key={url}>
                  <button
                    onClick={() => goTo(n, n > page ? "next" : "prev")}
                    aria-label={`跳到第 ${n} 页 · ${ATLAS_SLOTS[i]}`}
                    className={`block w-full relative transition-all ${
                      isActive
                        ? "scale-105 ring-2 ring-brick ring-offset-2 ring-offset-oat-200 z-10"
                        : isPast
                        ? "opacity-70 hover:opacity-100"
                        : isFuture
                        ? "opacity-50 hover:opacity-90"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div
                      className="p-1"
                      style={{
                        background:
                          "linear-gradient(135deg, #B8956A 0%, #8B6F47 50%, #6E5635 100%)",
                        boxShadow: isActive
                          ? "0 6px 16px -2px rgba(74, 51, 28, 0.4)"
                          : "0 2px 4px -1px rgba(74, 51, 28, 0.2)",
                      }}
                    >
                      <div className="relative aspect-[9/16] overflow-hidden bg-oat-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          loading={isPast || isActive ? "eager" : "lazy"}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute top-1 left-1 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-mono font-bold"
                          style={{
                            background: isActive ? "var(--brick)" : "rgba(0,0,0,0.7)",
                            color: "#F5E9D0",
                          }}
                        >
                          {n}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 text-center">
                      <div className="font-mono text-[8px] md:text-[9px] uppercase tracking-wider text-brown-600">
                        {ATLAS_SLOTS[i]}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* 右侧工具栏:全屏 + 返回详情 */}
          <div className="flex flex-col gap-2 md:gap-3 lg:items-end">
            <button
              onClick={toggleFullscreen}
              className="group inline-flex items-center gap-2 px-4 py-2 text-sm text-brown-700 hover:text-brown-900 border border-brown-300 hover:border-brown-700 transition-colors self-start lg:self-end"
              style={{ background: "rgba(245, 233, 208, 0.5)" }}
              aria-label="全屏"
            >
              <span aria-hidden>
                {isFullscreen ? "⤢" : "⤡"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {isFullscreen ? "退出全屏" : "全屏"}
              </span>
              <span className="font-mono text-[9px] text-brown-400 ml-1 hidden sm:inline">
                F
              </span>
            </button>
            <Link
              href={detailHref}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-brown-900 border-2 border-brown-700 hover:bg-brown-700 hover:text-oat-100 transition-colors self-start lg:self-end"
              style={{ background: "rgba(245, 233, 208, 0.4)" }}
            >
              <span>返回详情</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* 键盘快捷键提示(全屏时隐藏) */}
        {!isFullscreen && (
          <div className="mt-6 text-center text-[10px] text-brown-500 font-mono tracking-wider hidden sm:block">
            ← → 翻页 · F 全屏 · Home/End 首尾
          </div>
        )}
      </main>

      {/* 全屏动画 keyframes */}
      <style jsx>{`
        @keyframes atlasFlipOutLeft {
          0% { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
          100% { transform: perspective(1200px) rotateY(-15deg) translateX(-20%); opacity: 0; }
        }
        @keyframes atlasFlipOutRight {
          0% { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
          100% { transform: perspective(1200px) rotateY(15deg) translateX(20%); opacity: 0; }
        }
        @keyframes atlasFlipIn {
          0% { transform: perspective(1200px) rotateY(0deg) scale(0.95); opacity: 0; }
          100% { transform: perspective(1200px) rotateY(0deg) scale(1); opacity: 1; }
        }
        :global(.atlas-flip-out-left) {
          animation: atlasFlipOutLeft 0.32s ease-in forwards;
        }
        :global(.atlas-flip-out-right) {
          animation: atlasFlipOutRight 0.32s ease-in forwards;
        }
        :global(.atlas-flip-in) {
          animation: atlasFlipIn 0.32s ease-out;
        }
      `}</style>
    </div>
  );
}
