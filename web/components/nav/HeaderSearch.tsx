/**
 * web/components/nav/HeaderSearch.tsx · 全局搜索
 *
 * v0.9 polish:Header 加搜索入口,150 个品种全可搜
 * - 点击放大镜 → 全屏 modal (移动端全屏,桌面端居中卡片)
 * - 实时按 zh / en / alias 过滤
 * - ESC 关闭,Cmd/Ctrl+K 打开
 * - 客户端组件
 */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

interface SearchPet {
  slug: string;
  nameZh: string;
  nameEn: string;
  aliasZh?: string[];
  category: "dog" | "cat" | "small-mammal" | "bird" | "reptile";
}

interface HeaderSearchProps {
  pets: SearchPet[];
}

const CATEGORY_LABEL: Record<SearchPet["category"], string> = {
  dog: "犬",
  cat: "猫",
  "small-mammal": "小型哺乳",
  bird: "鸟",
  reptile: "爬虫",
};

function categoryDir(cat: string): string {
  if (cat === "bird" || cat === "reptile") return "bird-reptile";
  return cat;
}

export function HeaderSearch({ pets }: HeaderSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 全局快捷键:Cmd/Ctrl+K 打开,ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // 打开时自动 focus input + 锁滚动
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // 空 query: 显示推荐(随机 6 个,稳定按 slug 排序前 6)
      return pets.slice(0, 6);
    }
    return pets
      .filter((p) => {
        if (p.nameZh.toLowerCase().includes(q)) return true;
        if (p.nameEn.toLowerCase().includes(q)) return true;
        if (p.aliasZh?.some((a) => a.toLowerCase().includes(q))) return true;
        return false;
      })
      .slice(0, 8);
  }, [query, pets]);

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setOpen(true)}
        aria-label="搜索品种"
        className="group inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-warm-brown/30 transition-colors hover:border-warm-brown hover:bg-oat-300/40"
        style={{ minHeight: 36 }}
      >
        <span
          aria-hidden
          className="text-base text-warm-brown group-hover:text-brown-700"
        >
          ⌕
        </span>
        <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.2em] text-warm-brown/80 group-hover:text-brown-700">
          搜索
        </span>
        <span
          aria-hidden
          className="hidden lg:inline-flex items-center px-1.5 py-0.5 ml-1 font-mono text-[9px] tracking-wider text-warm-brown/60 border border-warm-brown/20 rounded"
        >
          ⌘K
        </span>
      </button>

      {/* === Modal === */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-24 px-4"
          style={{
            background: "rgba(45, 37, 32, 0.65)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-lg overflow-hidden"
            style={{
              background: "var(--oat-200)",
              border: "2px solid var(--brown-500)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
            }}
          >
            {/* Input row */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(139, 111, 71, 0.2)" }}
            >
              <span aria-hidden className="text-xl text-warm-brown shrink-0">
                ⌕
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索 150 个品种 — 名字 / 英文 / 别名"
                className="flex-1 bg-transparent outline-none font-serif text-lg text-brown-900 placeholder:text-brown-500 placeholder:font-mono placeholder:text-sm placeholder:tracking-wider"
                style={{ border: "none" }}
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="关闭"
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 text-warm-brown hover:text-brown-700 border border-warm-brown/30 rounded"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div
              className="max-h-[60vh] overflow-y-auto"
              style={{ background: "var(--oat-100)" }}
            >
              {results.length === 0 ? (
                <div className="px-4 py-12 text-center font-mono text-sm text-warm-brown/70">
                  没有匹配「{query}」的品种
                </div>
              ) : (
                <ul>
                  {results.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/pets/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-oat-300/60"
                        style={{ borderBottom: "1px solid rgba(139, 111, 71, 0.08)" }}
                      >
                        <div
                          className="shrink-0 w-12 h-12 overflow-hidden border border-warm-brown/30 rounded"
                          style={{ background: "var(--oat-200)" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/${categoryDir(p.category)}/${p.slug}/01-cover-thumb.jpg`}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (!img.src.includes("-medium")) {
                                img.src = `/${categoryDir(p.category)}/${p.slug}/01-cover-medium.jpg`;
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-serif text-base text-brown-900 group-hover:text-brick transition-colors">
                            {p.nameZh}
                          </div>
                          <div className="font-display italic text-xs text-warm-brown/80">
                            {p.nameEn}
                            {p.aliasZh && p.aliasZh.length > 0 && (
                              <span className="ml-2 text-warm-brown/60">
                                · {p.aliasZh.join(" · ")}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 text-warm-brown/80 border border-warm-brown/20 rounded shrink-0"
                        >
                          {CATEGORY_LABEL[p.category]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer hint */}
            <div
              className="px-4 py-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-warm-brown/60"
              style={{
                background: "var(--oat-200)",
                borderTop: "1px solid rgba(139, 111, 71, 0.15)",
              }}
            >
              <span>{results.length} / 150 件馆藏</span>
              <span>↑↓ 选择 · Enter 打开 · ESC 关闭</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
