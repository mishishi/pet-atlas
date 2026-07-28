"use client";

/**
 * ExploredToast · 详情页底部「已探索 N 件」一次性 toast (P1-3, 2026-07-28)
 *
 * 设计意图:
 *  - 用户滚到详情页底部,弹个庆祝 toast
 *  - 显示当前 collection 数量 + 进度条
 *  - 一次性,localStorage 记忆 (p1-explored-toast-shown)
 *  - 风格跟 museum specimen card 一致
 *
 * 触发:
 *  - IntersectionObserver 监听 sentinel
 *  - sentinel 是详情页最底部的元素 (历史/名场面 section 之后)
 *  - 进入视口 30% 时显示
 *  - 6s 自动消失 / 点 X 立即关
 *
 * 注意:
 *  - 复用 B-10 useCollection hook (跟 CollectionPassport 共用 localStorage)
 *  - 不 import server-only 模块
 *  - prefers-reduced-motion 关闭动画
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCollection } from "@/lib/useCollection";

const STORAGE_KEY = "p1-explored-toast-shown";
const TOTAL = 150;

export function ExploredToast() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { collection } = useCollection();
  const [visible, setVisible] = useState(false);

  // 用 ref 记 "本次 session 是否已触发过" (防 1 个 detail page 多次进出反复弹)
  const triggeredRef = useRef(false);

  useEffect(() => {
    // 1. 已 dismiss 过 → 直接退出
    let alreadyDismissed = false;
    try {
      alreadyDismissed = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      alreadyDismissed = true;
    }
    if (alreadyDismissed) return;

    // 2. IntersectionObserver 监听 sentinel
    const node = sentinelRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          if (!triggeredRef.current) {
            triggeredRef.current = true;
            // 延迟 400ms 显示,等滚动停下来
            window.setTimeout(() => setVisible(true), 400);
            obs.disconnect();
          }
        }
      },
      { threshold: [0, 0.3, 0.5, 1] }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // 6 秒自动消失
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => handleDismiss(), 6000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function handleDismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  const count = collection.size;
  const percent = Math.min(100, Math.round((count / TOTAL) * 100));

  return (
    <>
      {/* Sentinel 放在最底部,等用户滚到这里时触发 toast */}
      <div
        ref={sentinelRef}
        aria-hidden
        className="h-px w-full pointer-events-none"
      />

      {visible && (
        <>
          {/* 轻量遮罩 (不抢戏) */}
          <div
            onClick={handleDismiss}
            className="explored-toast-backdrop"
            aria-hidden
          />
          <div
            role="status"
            aria-live="polite"
            className="explored-toast-card"
          >
            {/* 顶部装饰线 + 拉丁小标 */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="inline-block h-px w-8 bg-brown-500 opacity-50" />
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-brown-700">
                Collectio Crescit
              </span>
              <span className="inline-block h-px w-8 bg-brown-500 opacity-50" />
            </div>

            {/* 庆祝大字 */}
            <h3 className="font-serif text-lg md:text-xl font-bold text-brown-900 text-center leading-tight">
              {count === 0
                ? "翻开第一张标本卡"
                : count >= TOTAL
                ? "全套馆藏已集齐!"
                : `已探索 ${count} / ${TOTAL} 件`}
            </h3>

            {/* Latin + en 双行小副标题 */}
            <p className="font-display italic text-xs text-brown-600 text-center mt-1 tracking-wide">
              {count >= TOTAL
                ? "Museum Completum"
                : "Specimina explorata"}
            </p>

            {/* 进度条 */}
            <div className="mt-4 mb-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-brown-600 mb-1.5">
                <span>0</span>
                <span className="font-bold text-brown-900">{percent}%</span>
                <span>{TOTAL}</span>
              </div>
              <div
                className="h-2 w-full overflow-hidden"
                style={{
                  background: "rgba(139, 111, 71, 0.15)",
                  borderRadius: 1,
                }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${percent}%`,
                    background:
                      "linear-gradient(90deg, #B8956A 0%, #8B6F47 50%, #6E5635 100%)",
                    transition: "width 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)",
                  }}
                />
              </div>
            </div>

            {/* 双 CTA */}
            <div className="flex items-center gap-2 mt-2">
              <Link
                href="/pets"
                onClick={handleDismiss}
                className="flex-1 text-center px-3 py-2 text-xs font-mono uppercase tracking-wider text-oat-100 bg-brown-700 hover:bg-brown-900 border border-brown-900 transition-colors min-h-[36px] flex items-center justify-center"
                style={{ letterSpacing: "0.1em" }}
              >
                再翻一张
              </Link>
              <Link
                href="/"
                onClick={handleDismiss}
                className="flex-1 text-center px-3 py-2 text-xs font-mono uppercase tracking-wider text-brown-700 hover:text-brown-900 border border-brown-500 hover:border-brown-700 transition-colors min-h-[36px] flex items-center justify-center"
                style={{ background: "rgba(245, 233, 208, 0.4)" }}
              >
                看护照
              </Link>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-brown-500 hover:text-brown-900 transition-colors text-base"
              aria-label="关闭提示"
            >
              ✕
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes exploredToastIn {
          0% {
            transform: translate(-50%, 16px) scale(0.96);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
          }
        }
        .explored-toast-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(74, 51, 28, 0.18);
          backdrop-filter: blur(1px);
          z-index: 50;
          animation: exploredToastIn 0.3s ease-out reverse;
          cursor: pointer;
        }
        .explored-toast-card {
          position: fixed;
          left: 50%;
          bottom: 6vh;
          transform: translateX(-50%);
          z-index: 55;
          width: min(380px, calc(100vw - 32px));
          padding: 20px 22px 16px;
          background: linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 100%);
          border: 2px solid var(--brown-500);
          box-shadow:
            0 12px 32px -4px rgba(74, 51, 28, 0.5),
            0 0 0 5px rgba(245, 233, 208, 0.5),
            0 0 0 7px rgba(139, 111, 71, 0.25);
          animation: exploredToastIn 0.42s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        /* 顶部挂绳装饰 */
        .explored-toast-card::before {
          content: "";
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 18px;
          background:
            radial-gradient(circle at 10px 8px, var(--brown-500) 4px, transparent 5px),
            linear-gradient(180deg, transparent 0%, transparent 50%, var(--brown-500) 50%, var(--brown-500) 60%, transparent 60%);
          opacity: 0.6;
        }
        @media (max-width: 640px) {
          .explored-toast-card {
            bottom: 4vh;
            padding: 18px 18px 14px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .explored-toast-backdrop,
          .explored-toast-card {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
