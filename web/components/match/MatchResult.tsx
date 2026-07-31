"use client";

/**
 * components/match/MatchResult.tsx · 单个 Top 结果卡 (P2 商业化, 2026-07-31)
 *
 * - 排名徽章 (1/2/3)
 * - 品种卡 (cover + 名称 + 拉丁)
 * - 评分 + 等级标签
 * - "为什么匹配" 3 条理由
 * - 查看详情 / 分享 按钮
 */

import Link from "next/link";
import Image from "next/image";
import { scoreLabel, type ScoredPet } from "@/lib/matchmaker";
import { getCoverUrl, getSpecimenNumberClient } from "@/lib/pets-data";
import { ShareButton } from "@/components/brand/ShareButton";

export function MatchResult({
  match,
  rank,
  total,
}: {
  match: ScoredPet;
  rank: number;
  total: number;
}) {
  const { pet, score, reasons } = match;
  const { label, color } = scoreLabel(score);
  const cover = getCoverUrl(pet.slug, "thumb") || "";
  const fallback = getCoverUrl(pet.slug, "full") || "";
  const num = String(getSpecimenNumberClient(pet.slug)).padStart(3, "0");

  // 排名 1/2/3 颜色
  const rankColors = {
    1: { bg: "var(--brick)", text: "var(--oat-50)", emoji: "🥇" },
    2: { bg: "var(--brown-500)", text: "var(--oat-50)", emoji: "🥈" },
    3: { bg: "var(--brown-300)", text: "var(--brown-900)", emoji: "🥉" },
  } as const;
  const rankStyle = rankColors[rank as 1 | 2 | 3] || rankColors[3];

  return (
    <article
      className="relative border-2 border-warm-brown rounded-[var(--radius-lg)] bg-oat-100 overflow-hidden shadow-[var(--shadow-paper-md)] hover:shadow-[var(--shadow-paper-lg)] transition-shadow"
      style={{ animation: `slideUp 0.4s ${0.1 * (rank - 1)}s both ease-out` }}
    >
      {/* 排名徽章 */}
      <div
        className="absolute top-0 left-0 z-10 px-3 py-1.5 rounded-br-[var(--radius)] font-mono text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5"
        style={{ background: rankStyle.bg, color: rankStyle.text }}
      >
        <span aria-hidden>{rankStyle.emoji}</span>
        <span>
          TOP {rank} / {total}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-0">
        {/* Cover */}
        <div className="relative aspect-[9/16] md:aspect-auto md:min-h-[260px] bg-oat-200 overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={`${pet.name.zh} cover`}
              fill
              sizes="(max-width: 768px) 100vw, 180px"
              className="object-cover"
              unoptimized
              onError={(e) => {
                // 切换到 full size fallback
                const img = e.currentTarget as HTMLImageElement;
                if (fallback && img.src !== fallback) img.src = fallback;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
              🐾
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="p-5 md:p-6 flex flex-col">
          {/* 顶部 meta: N° + category */}
          <div className="flex items-center gap-2 mb-2 font-mono text-[10px] uppercase tracking-wider text-brown-500">
            <span className="text-brick">N° {num}</span>
            <span>·</span>
            <span>
              {pet.category === "dog"
                ? "犬 / Canis"
                : pet.category === "cat"
                ? "猫 / Felis"
                : pet.category === "small-mammal"
                ? "小型哺乳 / Mammalia"
                : pet.category === "bird"
                ? "鸟 / Aves"
                : "爬虫 / Reptilia"}
            </span>
          </div>

          {/* 名称 */}
          <h3 className="font-serif text-xl md:text-2xl font-bold text-brown-900 leading-tight">
            {pet.name.zh}
          </h3>
          <p className="font-display italic text-sm text-warm-brown mt-0.5">
            {pet.name.en}
          </p>

          {/* 评分 */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span
                className="font-serif text-3xl font-bold"
                style={{ color }}
              >
                {score}
              </span>
              <span className="font-mono text-xs text-brown-500">/ 100</span>
            </div>
            <span
              className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: color + "22", color }}
            >
              {label}
            </span>
          </div>

          {/* 评分进度条 */}
          <div className="mt-2 h-1.5 bg-oat-300 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${score}%`,
                background: `linear-gradient(90deg, var(--brown-500) 0%, ${color} 100%)`,
              }}
            />
          </div>

          {/* 为什么匹配 */}
          <div className="mt-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brown-500 mb-1.5">
              Cur Matching · 为什么
            </div>
            <ul className="space-y-1">
              {reasons.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-brown-700"
                >
                  <span className="text-brick shrink-0 mt-0.5">·</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 一句总结 (personality.summary) */}
          {pet.personality?.summary && (
            <p className="mt-3 text-sm italic text-brown-600 font-display border-l-2 border-warm-brown/30 pl-3">
              {pet.personality.summary}
            </p>
          )}

          {/* 操作按钮 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/pets/${pet.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brown-700 text-oat-100 hover:bg-brown-800 font-serif text-xs transition-colors"
            >
              <span>翻开标本卡</span>
              <span aria-hidden>→</span>
            </Link>
            <ShareButton
              title={`${pet.name.zh} · AI 配对 #${rank}`}
              text={`我在 Pet Atlas 答 5 道题,AI 配对师给我推荐了 ${pet.name.zh} (匹配度 ${score}/100) — 你也来试试?`}
              variant="outline"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  );
}
