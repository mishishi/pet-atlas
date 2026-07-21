/**
 * web/components/brand/FavoritesList.tsx · 收藏列表 (M3 polish · 2026-07-21)
 *
 * 客户端组件,显示当前用户收藏的品种缩略图。
 * 在 /profile 页面用。
 *
 * 用法:
 *   <FavoritesList />
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getFavorites } from "@/lib/favorites";
import { getAllPets, getCoverUrl } from "@/lib/pets";
import type { Pet } from "@/lib/types";
import { SafeImage } from "@/components/ui/SafeImage";

const STORAGE_KEY = "pet-atlas:favorites:v1";

export function FavoritesList() {
  const [favSlugs, setFavSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavSlugs(getFavorites());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        setFavSlugs(getFavorites());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!mounted) return null; // SSR 不渲染,避免 hydration mismatch

  if (favSlugs.length === 0) {
    return (
      <div
        className="mt-6 rounded-2xl p-6 text-center"
        style={{
          background: "rgba(245, 233, 208, 0.5)",
          border: "1px solid rgba(139, 111, 71, 0.15)",
        }}
      >
        <div className="text-3xl mb-2 opacity-60">🤍</div>
        <p className="text-sm text-brown-700 mb-1">还没有收藏品种</p>
        <p className="text-xs text-brown-500 mb-3">
          进图鉴点 ♡ 收藏喜欢的品种
        </p>
        <Link
          href="/pets"
          className="inline-block text-xs px-3 py-1.5 rounded-full border border-warm-brown text-warm-brown hover:bg-warm-brown/5 transition-colors"
        >
          去逛品种 →
        </Link>
      </div>
    );
  }

  // 用 getAllPets 找收藏的 Pet 对象
  const allPets = getAllPets();
  const favPets: Pet[] = favSlugs
    .map((slug) => allPets.find((p) => p.slug === slug))
    .filter((p): p is Pet => p !== undefined);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-base font-bold text-brown-900 flex items-center gap-2">
          <span aria-hidden>❤️</span>
          <span>我的收藏</span>
          <span className="text-xs text-brown-500 font-mono">
            ({favSlugs.length})
          </span>
        </h3>
        {favSlugs.length > 6 && (
          <Link
            href="/pets?filter=favorites"
            className="text-xs text-brown-500 hover:text-brown-900 transition-colors"
          >
            查看全部 →
          </Link>
        )}
      </div>
      <ul className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {favPets.slice(0, 6).map((pet) => (
          <li key={pet.slug}>
            <Link
              href={`/pets/${pet.slug}`}
              className="group block"
              title={`${pet.name.zh} · ${pet.name.en}`}
            >
              <div
                className="relative aspect-[9/16] overflow-hidden rounded-md bg-oat-200 border border-brown-200/60 group-hover:border-warm-brown group-hover:-translate-y-0.5 transition-all"
              >
                <SafeImage
                  src={getCoverUrl(pet.slug, "thumb")}
                  fallback={getCoverUrl(pet.slug, "full")}
                  alt={`${pet.name.zh} 收藏`}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-brick/90 flex items-center justify-center text-[10px] text-white">
                  ❤️
                </div>
              </div>
              <div className="mt-1 text-center text-[11px] font-medium text-brown-800 truncate">
                {pet.name.zh}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
