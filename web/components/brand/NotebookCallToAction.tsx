/**
 * web/components/brand/NotebookCallToAction.tsx · 详情页底部 CTA
 *
 * "收藏到笔记本" 大画框 CTA,放在 atlas CTA 之后。
 * 视觉: vintage 标本卡 + 暖棕双框 + 燕麦底 + 拉丁装饰
 *
 * 包含:
 *  - 大按钮: 收藏 / 已收藏 (跟右上角 FavoriteButton 同步状态)
 *  - 3 个推荐 breed 缩略图 (用 SpecimenFrame)
 *  - 拉丁 "Collect in Your Codex · 1876"
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { getCoverUrl } from "@/lib/pets-data";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Pet } from "@/lib/types";

interface Props {
  slug: string;
  nameZh: string;
  nameEn: string;
  related?: Pet[]; // 3 个推荐 breed
}

const STORAGE_KEY = "pet-atlas:favorites:v1";

export function NotebookCallToAction({ slug, nameZh, nameEn, related = [] }: Props) {
  const [fav, setFav] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setFav(isFavorite(slug));
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) setFav(isFavorite(slug));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [slug]);

  const handleClick = useCallback(() => {
    const added = toggleFavorite(slug);
    setFav(added);
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  }, [slug]);

  return (
    <section
      className="mt-16 md:mt-20 max-w-3xl mx-auto rounded-2xl p-8 md:p-12 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(245, 233, 208, 0.7) 0%, rgba(232, 217, 184, 0.7) 100%)",
        boxShadow: "0 8px 32px -8px rgba(110, 86, 53, 0.25), inset 0 0 0 1px rgba(139, 111, 71, 0.15)",
      }}
    >
      {/* 双层画框 */}
      <div className="absolute inset-3 md:inset-4 border-2 border-warm-brown/40 rounded-xl pointer-events-none" />
      <div className="absolute inset-5 md:inset-6 border border-warm-brown/20 rounded-lg pointer-events-none" />

      {/* 装饰水渍 */}
      <div
        className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 0%, rgba(139, 111, 71, 0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative">
        {/* 顶部装饰条 */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="inline-block h-px flex-1 max-w-16 bg-warm-brown/30" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-warm-brown/70">
            Collect in Your Codex
          </span>
          <span className="inline-block h-px flex-1 max-w-16 bg-warm-brown/30" />
        </div>

        {/* 标题 */}
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 text-center leading-tight">
          收藏到笔记本
        </h2>
        <p className="mt-1 font-display italic text-base md:text-lg text-warm-brown text-center tracking-wide">
          — Collectio Mea · Ad Annum MMXXVI —
        </p>
        <p className="mt-3 font-serif text-sm text-brown-600 text-center max-w-md mx-auto">
          看完 <span className="text-brown-800">{nameZh}</span> 之后,把它加入你的私人图鉴集 ——
          跨设备同步,随时打开回看。
        </p>

        {/* 大按钮 */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleClick}
            aria-label={fav ? "取消收藏" : "加入收藏"}
            aria-pressed={fav}
            className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all duration-500 min-h-[56px] ${
              fav
                ? "border-brick bg-brick text-oat-50 shadow-xl scale-[1.02]"
                : "border-warm-brown bg-oat-50 text-brown-800 hover:bg-warm-brown hover:text-oat-50 hover:border-warm-brown hover:shadow-xl hover:scale-[1.02]"
            }`}
          >
            <span
              className={`text-2xl transition-transform ${
                pulse ? "animate-important-pulse" : ""
              }`}
              aria-hidden
            >
              {fav ? "❤️" : "🤍"}
            </span>
            <span className="font-serif text-lg font-medium">
              {fav ? `已加入笔记本` : "加入我的笔记本"}
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.3em] ${
                fav ? "text-oat-200" : "text-brown-500"
              }`}
            >
              {fav ? "✓ Saved" : "Tap to Save"}
            </span>
          </button>
        </div>

        {/* 3 个推荐 breed */}
        {related.length > 0 && (
          <div className="mt-10">
            <div className="text-center mb-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick inline-flex items-center gap-3">
                <span className="inline-block w-6 h-px bg-brick" />
                继续探索
                <span className="inline-block w-6 h-px bg-brick" />
              </div>
            </div>
            <ul className="grid grid-cols-3 gap-3 md:gap-4">
              {related.slice(0, 3).map((p) => {
                const cover = getCoverUrl(p.slug, "thumb") || "";
                const fallback = getCoverUrl(p.slug, "full") || "";
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/pets/${p.slug}`}
                      className="group block focus-visible:outline-2 focus-visible:outline-brown-500 focus-visible:outline-offset-4 rounded-[var(--radius)]"
                    >
                      <article
                        className="bg-oat-100 border-2 border-brown-200 rounded-[var(--radius)] overflow-hidden shadow-[var(--shadow-paper)] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-brown-500"
                      >
                        <div className="relative aspect-[9/16] w-full overflow-hidden bg-oat-200">
                          <SafeImage
                            src={cover}
                            fallback={fallback}
                            alt={`${p.name.zh} vintage paper 标本卡`}
                            fill
                            sizes="(max-width: 768px) 30vw, 12vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="p-2.5 border-t-2 border-brown-200 group-hover:border-warm-brown transition-colors">
                          <h3 className="font-serif text-sm font-bold text-brown-900 truncate">
                            {p.name.zh}
                          </h3>
                          <p className="font-display italic text-[10px] text-brown-500 truncate tracking-wide">
                            {p.name.en}
                          </p>
                        </div>
                      </article>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
