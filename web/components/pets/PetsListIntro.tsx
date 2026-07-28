/**
 * web/components/pets/PetsListIntro.tsx · /pets 列表页顶部 intro
 *
 * - 标题 + 拉丁 caption + drop cap 简介
 * - "随机翻开一只" 按钮 (client) → 跳到 random breed
 * - 总数 150 件
 *
 * v0.9 polish:让 /pets 不那么裸,跟 detail page 风格统一
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PetsListIntroProps {
  totalCount: number;
  allSlugs: string[];
}

export function PetsListIntro({ totalCount, allSlugs }: PetsListIntroProps) {
  const router = useRouter();
  const [rolling, setRolling] = useState(false);

  const rollRandom = () => {
    if (allSlugs.length === 0) return;
    setRolling(true);
    const slug = allSlugs[Math.floor(Math.random() * allSlugs.length)];
    setTimeout(() => {
      router.push(`/pets/${slug}`);
    }, 300);
  };

  return (
    <section
      className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 md:pt-12 pb-6 md:pb-8"
      style={{ position: "relative" }}
    >
      {/* 装饰角 */}
      <div
        aria-hidden
        className="hidden md:block"
        style={{
          position: "absolute",
          top: 0,
          right: 24,
          width: 120,
          height: 120,
          background:
            "radial-gradient(circle at 100% 0%, rgba(139, 111, 71, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* 顶部:小标签 + 编号 */}
      <div
        className="font-mono uppercase tracking-[0.3em] text-xs mb-2 flex items-center gap-3"
        style={{ color: "var(--brown-500)" }}
      >
        <span
          className="inline-block h-px w-8"
          style={{ background: "var(--brown-500)", opacity: 0.5 }}
        />
        <span>— Index Collectionis · 馆藏索引 —</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-end">
        <div>
          <h1
            className="font-serif font-bold text-brown-900 leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
          >
            150 件馆藏
          </h1>
          <p
            className="mt-2 font-display italic text-base md:text-lg"
            style={{ color: "var(--warm-brown)" }}
          >
            The Atlas of Breeds · Tabulae C et Quinquaginta
          </p>
          <p
            className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed"
            style={{ color: "var(--brown-700)" }}
          >
            <span
              className="font-serif float-left mr-2 leading-[0.85]"
              style={{
                fontSize: 44,
                color: "var(--brown-700)",
                fontWeight: 600,
              }}
              aria-hidden
            >
              这
            </span>
            里收藏了 150 种动物的完整 6 页图谱 — 从温顺的拉布拉多到孤傲的雪豹,
            从刚孵化的玄凤鹦鹉到慵懒的苏卡达象龟。每件都配 6 页 vintage 标本卡,
            涵盖形态、性格、历史、养护与名场面。
          </p>
        </div>

        {/* 右侧:总数 + 随机按钮 */}
        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          <div
            className="font-mono uppercase tracking-[0.2em] text-[10px]"
            style={{ color: "var(--brown-500)" }}
          >
            Total Specimens
          </div>
          <div
            className="font-serif leading-none"
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "var(--brown-900)",
            }}
          >
            {totalCount}
          </div>
          <button
            onClick={rollRandom}
            disabled={rolling}
            className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-mono uppercase tracking-[0.2em] border-2 transition-all"
            style={{
              background: "var(--brown-700)",
              color: "var(--oat-100)",
              borderColor: "var(--brown-700)",
              minHeight: 44,
              cursor: rolling ? "wait" : "pointer",
              opacity: rolling ? 0.7 : 1,
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-block",
                transform: rolling ? "rotate(360deg)" : "rotate(0deg)",
                transition: "transform 600ms ease",
              }}
            >
              🎲
            </span>
            <span>{rolling ? "..." : "随机翻开一只"}</span>
          </button>
        </div>
      </div>

      {/* 装饰双横线 + 拉丁小语 */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <span
          className="inline-block h-px w-16"
          style={{ background: "var(--brown-400)", opacity: 0.4 }}
        />
        <span
          className="font-display italic text-xs"
          style={{ color: "var(--brown-500)", opacity: 0.7 }}
        >
          — Quaerite et invenietis —
        </span>
        <span
          className="inline-block h-px w-16"
          style={{ background: "var(--brown-400)", opacity: 0.4 }}
        />
      </div>
    </section>
  );
}
