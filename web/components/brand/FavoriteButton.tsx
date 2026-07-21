/**
 * web/components/brand/FavoriteButton.tsx · 收藏按钮 (M3 polish · 2026-07-21)
 *
 * 客户端组件,使用 localStorage 持久化。
 * 在 /pets/[slug] 详情页用。
 *
 * 用法:
 *   <FavoriteButton slug="labrador-retriever" />
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

const STORAGE_KEY = "pet-atlas:favorites:v1";

export function FavoriteButton({ slug }: { slug: string }) {
  const [fav, setFav] = useState(false);
  const [pulse, setPulse] = useState(false);

  // 初次加载 + 多 tab 同步
  useEffect(() => {
    setFav(isFavorite(slug));
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        setFav(isFavorite(slug));
      }
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
    <button
      type="button"
      onClick={handleClick}
      aria-label={fav ? "取消收藏" : "加入收藏"}
      aria-pressed={fav}
      className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
        fav
          ? "border-brick bg-brick text-oat-50 shadow-md"
          : "border-brown-300/60 bg-oat-50/60 text-brown-700 hover:border-brick hover:text-brick"
      }`}
    >
      {/* Heart icon */}
      <span
        className={`relative text-lg transition-transform ${
          pulse ? "animate-important-pulse" : ""
        }`}
        aria-hidden
      >
        {fav ? "❤️" : "🤍"}
      </span>
      <span className="text-sm font-medium">
        {fav ? "已收藏" : "收藏"}
      </span>
    </button>
  );
}
