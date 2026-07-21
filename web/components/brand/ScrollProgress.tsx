/**
 * web/components/brand/ScrollProgress.tsx · 图鉴阅读节奏组件
 *
 * M3 polish · 2026-07-21
 *
 * 提供两个能力:
 * 1. **顶部 scroll progress bar**(细线,显示阅读进度)
 * 2. **Sticky TOC 高亮**(滚动到哪个 section,那个按钮高亮)
 *
 * 用法:
 *   <ScrollProgress sections={[
 *     { id: "personality", label: "性格" },
 *     { id: "atlas", label: "图谱" },
 *     ...
 *   ]} />
 *
 * 客户端组件,使用 IntersectionObserver 监听 section,scroll 事件读 progress。
 */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export interface TocSection {
  id: string;
  label: string;
  en?: string;
}

export function ScrollProgress({ sections }: { sections: TocSection[] }) {
  const [progress, setProgress] = useState(0); // 0-1
  const [activeId, setActiveId] = useState<string | null>(null);
  const [stuck, setStuck] = useState(false);
  const tocRef = useRef<HTMLElement | null>(null);

  // ---- 1. Scroll progress (顶部进度条) ----
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // ---- 2. TOC 高亮(用 IntersectionObserver 监听 section) ----
  useEffect(() => {
    if (sections.length === 0) return;
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // 选离顶部最近 + 还在视口内的 section
    const observer = new IntersectionObserver(
      () => {
        // 主动扫描,选"最近顶部 + 已出现"的 section
        const scrollY = window.scrollY + 120; // 视口偏上一点
        let current: string | null = null;
        for (const el of elements) {
          if (el.offsetTop <= scrollY) {
            current = el.id;
          } else {
            break;
          }
        }
        setActiveId(current ?? elements[0]?.id ?? null);
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: [0, 0.1, 0.5],
      }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // ---- 3. TOC sticky 状态(stuck 时加阴影) ----
  useEffect(() => {
    const el = tocRef.current;
    if (!el) return;
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;";
    el.parentElement?.insertBefore(sentinel, el);
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: [1], rootMargin: "0px 0px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - 80; // 顶部留 80px
      window.scrollTo({ top: y, behavior: "smooth" });
      // 立即设置 active,让用户立刻看到反馈
      setActiveId(id);
    },
    []
  );

  if (sections.length === 0) return null;

  return (
    <>
      {/* 顶部进度条 (fixed, 永远在屏幕最上方) */}
      <div
        className="fixed top-0 left-0 right-0 h-0.5 z-50 pointer-events-none"
        style={{ background: "rgba(139, 111, 71, 0.1)" }}
        aria-hidden
      >
        <div
          className="h-full transition-[width] duration-100 ease-out"
          style={{
            width: `${progress * 100}%`,
            background:
              "linear-gradient(90deg, #B8956A 0%, #8B6F47 50%, #6E5635 100%)",
          }}
        />
      </div>

      {/* Sticky TOC bar (fixed, 跟着滚) */}
      <nav
        ref={tocRef}
        aria-label="本页目录"
        className={`fixed top-1 left-0 right-0 z-40 transition-all duration-200 ${
          stuck
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div
          className="mx-auto max-w-2xl px-3 py-1.5 backdrop-blur-md"
          style={{
            background: "rgba(245, 233, 208, 0.85)",
            borderBottom: "1px solid rgba(139, 111, 71, 0.15)",
            boxShadow: "0 2px 8px -2px rgba(110, 86, 53, 0.15)",
          }}
        >
          <ul className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
            {sections.map((s) => {
              const active = activeId === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => handleClick(e, s.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-serif text-xs whitespace-nowrap transition-colors ${
                      active
                        ? "text-warm-brown"
                        : "text-brown-600 hover:text-brown-900"
                    }`}
                  >
                    {active && (
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--warm-brown)" }}
                        aria-hidden
                      />
                    )}
                    <span>{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
