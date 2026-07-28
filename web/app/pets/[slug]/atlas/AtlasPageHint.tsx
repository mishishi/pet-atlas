"use client";

/**
 * AtlasPageHint · 首次访问翻页浮层提示 (P1-1, 2026-07-28)
 *
 * 设计意图:
 *  - 新用户打开 Atlas 第一页,会被卡住不知道能翻页
 *  - 6 秒后自动消失,或点"知道了" / 点背景 / 按 ESC / 翻页 立刻消失
 *  - localStorage 记忆 (atlas-hint-seen),只首次展示
 *  - 跟博物馆 specimen card 风格一致 (oat 纸 + brown 边框 + 拉丁小标)
 *  - 移动端友好 (底部偏上,不挡大画框)
 *
 * 注意:
 *  - 此组件是 "use client" (localStorage 跟 useEffect)
 *  - 不要 import 任何 server-only 模块
 *  - prefers-reduced-motion 关闭动画
 */

import { useEffect, useState } from "react";

const STORAGE_KEY = "atlas-hint-seen";
const AUTO_DISMISS_MS = 7000;

export function AtlasPageHint({
  onDismiss,
  onUserInteract,
}: {
  onDismiss?: () => void;
  /** 任意一次有效翻页时调用 (用来立刻关 hint) */
  onUserInteract?: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 检查 localStorage — 已看过就不再显示
    let alreadySeen = false;
    try {
      alreadySeen = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* private mode 等等,直接当看过 */
      alreadySeen = true;
    }
    if (alreadySeen) return;

    // 延迟 600ms 显示,等首屏 paint 完成
    const showTimer = window.setTimeout(() => setVisible(true), 600);

    // 自动消失
    const dismissTimer = window.setTimeout(() => {
      handleDismiss();
    }, AUTO_DISMISS_MS);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(dismissTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 听键盘翻页 — 翻页就立刻关
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "a" ||
        e.key === "A" ||
        e.key === "d" ||
        e.key === "D"
      ) {
        handleDismiss();
        onUserInteract?.();
      } else if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // 听触摸滑动 — swipe 翻页也立刻关
  useEffect(() => {
    if (!visible) return;
    let startX: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0]?.clientX ?? null;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (startX == null) return;
      const dx = (e.changedTouches[0]?.clientX ?? 0) - startX;
      if (Math.abs(dx) > 50) {
        handleDismiss();
        onUserInteract?.();
      }
      startX = null;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function handleDismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    onDismiss?.();
  }

  if (!visible) return null;

  return (
    <>
      {/* 背景遮罩 — 点击关闭 */}
      <div
        onClick={handleDismiss}
        className="atlas-hint-backdrop"
        aria-hidden
      />
      <div
        role="dialog"
        aria-label="Atlas 翻页提示"
        aria-modal="false"
        className="atlas-hint-card"
      >
        {/* 顶部装饰线 + 拉丁小标 */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-block h-px w-10 bg-brown-500 opacity-50" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-brown-700">
            Prima Visitatio
          </span>
          <span className="inline-block h-px w-10 bg-brown-500 opacity-50" />
        </div>

        {/* 中文大字标题 */}
        <h2 className="font-serif text-xl md:text-2xl font-bold text-brown-900 text-center leading-tight">
          标本卡可翻阅
        </h2>

        {/* 拉丁副标题 */}
        <p className="font-display italic text-sm text-brown-600 text-center mt-1 tracking-wide">
          Folia versa manu
        </p>

        {/* 翻页示意图 — 双箭头 */}
        <div className="mt-5 mb-4 flex items-center justify-center gap-6 md:gap-8">
          <div className="flex flex-col items-center gap-1.5">
            <div className="atlas-hint-arrow atlas-hint-arrow-left">
              <span aria-hidden>←</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-brown-600">
              Previous
            </span>
          </div>
          <span className="font-mono text-[10px] text-brown-400 mt-[-1.2rem]">/</span>
          <div className="flex flex-col items-center gap-1.5">
            <div className="atlas-hint-arrow atlas-hint-arrow-right">
              <span aria-hidden>→</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-brown-600">
              Next
            </span>
          </div>
        </div>

        {/* 提示说明列表 */}
        <ul className="space-y-1.5 text-center text-xs md:text-sm text-brown-700">
          <li className="flex items-center justify-center gap-2">
            <kbd className="atlas-hint-kbd">←</kbd>
            <kbd className="atlas-hint-kbd">→</kbd>
            <span>键盘翻页</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="atlas-hint-kbd-mini">👆</span>
            <span>触摸滑动翻页 (移动端)</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <kbd className="atlas-hint-kbd-mini">T</kbd>
            <span>文字版</span>
            <span className="text-brown-400 mx-1">·</span>
            <kbd className="atlas-hint-kbd-mini">F</kbd>
            <span>全屏</span>
          </li>
        </ul>

        {/* 知道了 按钮 */}
        <div className="mt-5 text-center">
          <button
            onClick={handleDismiss}
            className="atlas-hint-cta"
            aria-label="关闭翻页提示"
          >
            <span>知 道 了</span>
            <span className="font-mono text-[9px] ml-1.5 opacity-70">ESC</span>
          </button>
        </div>

        {/* 底部装饰 */}
        <div className="mt-3 text-center font-mono text-[9px] text-brown-500 tracking-wider">
          — 6 张 · Tabula I — VI —
        </div>
      </div>

      {/* 样式 */}
      <style jsx>{`
        @keyframes atlasHintFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes atlasHintCardIn {
          0% { transform: translateY(12px) scale(0.96); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes atlasHintArrowBounceLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
        }
        @keyframes atlasHintArrowBounceRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .atlas-hint-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(74, 51, 28, 0.32);
          backdrop-filter: blur(2px);
          z-index: 60;
          animation: atlasHintFadeIn 0.3s ease-out;
          cursor: pointer;
        }
        .atlas-hint-card {
          position: fixed;
          left: 50%;
          bottom: 12vh;
          transform: translateX(-50%);
          z-index: 70;
          width: min(420px, calc(100vw - 32px));
          padding: 22px 22px 18px;
          background: linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 100%);
          border: 2px solid var(--brown-500);
          box-shadow:
            0 12px 32px -4px rgba(74, 51, 28, 0.45),
            0 0 0 6px rgba(245, 233, 208, 0.5),
            0 0 0 8px rgba(139, 111, 71, 0.3);
          animation: atlasHintCardIn 0.42s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        /* 顶部挂绳装饰 */
        .atlas-hint-card::before {
          content: "";
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 18px;
          background:
            radial-gradient(circle at 12px 8px, var(--brown-500) 4px, transparent 5px),
            linear-gradient(180deg, transparent 0%, transparent 50%, var(--brown-500) 50%, var(--brown-500) 60%, transparent 60%);
          opacity: 0.6;
        }
        .atlas-hint-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 2px solid var(--brown-500);
          background: rgba(245, 233, 208, 0.7);
          color: var(--brown-700);
          font-size: 28px;
          font-weight: 600;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(74, 51, 28, 0.2);
        }
        .atlas-hint-arrow-left {
          animation: atlasHintArrowBounceLeft 1.4s ease-in-out infinite;
        }
        .atlas-hint-arrow-right {
          animation: atlasHintArrowBounceRight 1.4s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        .atlas-hint-kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 24px;
          padding: 0 6px;
          border: 1.5px solid var(--brown-400);
          border-bottom-width: 2.5px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.4);
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--brown-700);
          font-weight: 600;
        }
        .atlas-hint-kbd-mini {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 22px;
          height: 20px;
          padding: 0 5px;
          border: 1.5px solid var(--brown-400);
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.4);
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: var(--brown-700);
          font-weight: 600;
        }
        .atlas-hint-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 10px 24px;
          background: var(--brown-700);
          color: var(--oat-100);
          border: 2px solid var(--brown-900);
          font-family: var(--font-serif, serif);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 44px;
          box-shadow: 0 2px 0 var(--brown-900);
        }
        .atlas-hint-cta:hover {
          background: var(--brown-900);
          transform: translateY(1px);
          box-shadow: 0 1px 0 var(--brown-900);
        }
        .atlas-hint-cta:active {
          transform: translateY(2px);
          box-shadow: none;
        }
        @media (max-width: 640px) {
          .atlas-hint-card {
            bottom: 8vh;
            padding: 18px 16px 14px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .atlas-hint-backdrop,
          .atlas-hint-card,
          .atlas-hint-arrow-left,
          .atlas-hint-arrow-right {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
