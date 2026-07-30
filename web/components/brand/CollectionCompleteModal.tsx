"use client";

/**
 * CollectionCompleteModal · 集齐 150 弹彩带 (P2 polish, 2026-07-30)
 *
 * 触发:
 * - 当 collection.size 跨过 150 阈值 (跨过才弹, 已经有 150 不再弹)
 * - localStorage pet-atlas-complete-shown 记录已弹过 (避免重复)
 *
 * 视觉:
 * - 全屏 overlay (50% 暖棕半透明)
 * - 中心庆祝面板 (cream 底 + brown 边 + 砖红 accent)
 * - 顶部 "COLLECTION COMPLETE" 拉丁 (大写字间距)
 * - "COLLECTIO PERFECTA" 拉丁小副标
 * - 80 片彩带从顶部飘落 (CSS animation)
 * - 统计: 用时几天 + 总数 + 完成日期
 * - 双 CTA: 分享 / 关闭
 * - 拉丁: "N° CL · COLLECTIO ABSOLUTA · MMXXVI"
 *
 * 彩带 (confetti):
 * - 60-80 个 div, 随机颜色 (brick/forest/sage/rose/oat-500/brown-300)
 * - 随机水平起点 + 旋转 + 4-7s 下落
 * - 纯 CSS @keyframes, 0 外部依赖
 * - 1.5s 后自动消失 (DOM cleanup)
 */

import { useEffect, useState } from "react";
import { ShareButton } from "./ShareButton";
import { useCollection } from "@/lib/useCollection";

const TOTAL = 150;
const FLAG_KEY = "pet-atlas-complete-shown";
const START_KEY = "pet-atlas-collection-started";

interface Props {
  /** 强制显示 (调试用) */
  forceShow?: boolean;
}

export function CollectionCompleteModal({ forceShow = false }: Props) {
  const { collection } = useCollection();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<{ days: number; dateStr: string }>({
    days: 0,
    dateStr: "",
  });

  // 计算 stats (从 first visit 到现在的天数)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    const firstVisit = window.localStorage.getItem(START_KEY);
    let firstTs: number;
    if (!firstVisit) {
      firstTs = Date.now();
      window.localStorage.setItem(START_KEY, String(firstTs));
    } else {
      firstTs = parseInt(firstVisit, 10);
    }
    const now = Date.now();
    const days = Math.max(1, Math.floor((now - firstTs) / 86400000));
    const dateStr = new Date().toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setStats({ days, dateStr });
  }, []);

  // 触发逻辑: 跨过 150 阈值时弹
  useEffect(() => {
    if (!mounted) return;
    if (forceShow) {
      setShow(true);
      return;
    }
    if (collection.size < TOTAL) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(FLAG_KEY) === "1") return;
    // 跨过阈值, 标记已弹, 弹窗
    window.localStorage.setItem(FLAG_KEY, "1");
    setShow(true);
  }, [collection.size, mounted, forceShow]);

  // 锁滚动 + ESC 关闭
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShow(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [show]);

  if (!mounted || !show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="恭喜馆藏集齐"
      style={{
        background: "rgba(46, 36, 24, 0.55)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setShow(false);
      }}
    >
      {/* 彩带层 */}
      <ConfettiLayer />

      {/* 庆祝面板 */}
      <div
        className="relative w-full max-w-md mx-auto bg-oat-100 border-2 border-warm-brown rounded-[var(--radius-lg)] shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FCFAF4 0%, #F5EFE0 100%)",
          animation: "modalPop 0.5s cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}
      >
        {/* 顶部装饰条 */}
        <div
          className="h-1.5 w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--brick) 0%, var(--forest) 33%, var(--sage) 66%, var(--rose) 100%)",
          }}
        />

        <div className="px-6 py-7 md:px-8 md:py-9 text-center">
          {/* 拉丁小副标 */}
          <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-brown-500 mb-2">
            N° CL · COLLECTIO ABSOLUTA · MMXXVI
          </div>
          {/* 主标 */}
          <h2
            className="font-display italic font-bold text-brown-900 mb-1"
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2.25rem)",
              lineHeight: 1.2,
            }}
          >
            Collection Complete
          </h2>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-warm-brown mb-5">
            COLLECTIO PERFECTA · 馆藏已集齐
          </div>

          {/* 数字大字 */}
          <div className="mb-5">
            <span className="font-serif font-bold text-brick" style={{ fontSize: "4rem", lineHeight: 1 }}>
              {TOTAL}
            </span>
            <span className="font-mono text-sm text-brown-500 ml-2">/ 150</span>
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            <div className="border border-warm-brown/30 rounded-lg p-3 bg-oat-50/60">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500">
                DAYS · 用时
              </div>
              <div className="font-serif text-2xl font-bold text-brown-900 mt-1">
                {stats.days}
              </div>
              <div className="text-xs text-brown-600 mt-0.5">天</div>
            </div>
            <div className="border border-warm-brown/30 rounded-lg p-3 bg-oat-50/60">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500">
                TODAY · 完成
              </div>
              <div className="font-serif text-base font-medium text-brown-900 mt-1">
                {stats.dateStr || "今日"}
              </div>
            </div>
          </div>

          {/* 一句感言 */}
          <p className="text-sm text-brown-700 mb-6 leading-relaxed">
            恭喜!你已成为「Pet Atlas 完整馆藏者」之一。
            <br />
            150 张标本卡,从拉布拉多到鬃狮蜥, 全部翻阅完毕。
          </p>

          {/* 双 CTA */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <ShareButton
              title="Pet Atlas · 馆藏已集齐!"
              text="我刚在 Pet Atlas 集齐 150 个品种! 治愈水彩 + vintage 标本卡, 真的停不下来 →"
              variant="default"
            />
            <button
              type="button"
              onClick={() => setShow(false)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-warm-brown/60 text-warm-brown bg-transparent hover:bg-warm-brown/10 transition-all active:scale-95 font-serif text-sm"
            >
              收下这份喜悦
            </button>
          </div>

          {/* 底部小装饰 */}
          <div className="mt-6 font-display italic text-[11px] text-brown-500">
            — "Tabulae omnes lectae, anima saturata." —
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-brown-500/60">
            Musaeum Clausum · 闭馆时刻
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes confettiFall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0.3;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes modalPop { 0%, 100% { transform: none; } }
        }
      `}</style>
    </div>
  );
}

/** 80 片彩带下落 (纯 CSS) */
function ConfettiLayer() {
  // 8 种颜色, 12 个 × 7 行 = 84 片
  const colors = [
    "var(--brick)",
    "var(--forest)",
    "var(--sage)",
    "var(--rose)",
    "var(--brown-300)",
    "var(--brown-500)",
    "var(--oat-500)",
    "var(--oat-600)",
  ];
  const pieces = Array.from({ length: 80 }, (_, i) => i);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {pieces.map((i) => {
        const left = (i * 1.27 + Math.random() * 8) % 100;
        const color = colors[i % colors.length];
        const duration = 4 + (i % 4); // 4-7s
        const delay = (i % 8) * 0.15; // 0-1.05s
        const rotate = (i % 2 === 0 ? 1 : -1) * (180 + (i * 13) % 180);
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: `${left}%`,
              width: "8px",
              height: "14px",
              background: color,
              transform: `rotate(${rotate}deg)`,
              animation: `confettiFall ${duration}s ${delay}s linear forwards`,
              borderRadius: i % 3 === 0 ? "50%" : "2px",
            }}
          />
        );
      })}
    </div>
  );
}
