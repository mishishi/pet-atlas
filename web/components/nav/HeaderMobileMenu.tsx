"use client";

/**
 * HeaderMobileMenu · 移动端汉堡包菜单 (Top3-2, 2026-07-28)
 *
 * 设计:
 *  - md 以下 hamburger button (左上) → tap 打开全屏 drawer
 *  - vintage 老纸 + 拉丁小标 + brown 边框,跟整体风格一致
 *  - 5 个主 nav + 5 个类目快捷入口 + 搜索 + 登录
 *  - 锁滚动,backdrop blur,ESC 关闭
 *  - prefers-reduced-motion 关闭动画
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthMenu } from "../auth/AuthMenu";

interface Props {
  /** 5 个主导航 */
  primaryNav: { href: string; label: string }[];
  /** 5 个 category 快捷入口 */
  categoryNav: { href: string; label: string; latin: string }[];
}

export function HeaderMobileMenu({ primaryNav, categoryNav }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 路由切换自动关闭
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 锁滚动
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border-2 border-warm-brown text-warm-brown shrink-0 transition-transform active:scale-95"
        style={{
          background: "rgba(245, 233, 208, 0.5)",
          boxShadow: "inset 0 0 0 1px rgba(139, 111, 71, 0.2)",
        }}
        aria-label="打开菜单"
        aria-expanded={false}
      >
        {/* 三横线 hamburger */}
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="mobile-menu-backdrop"
        aria-hidden
      />

      {/* Drawer — 右侧滑入 */}
      <aside
        className="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单"
      >
        {/* 顶部装饰 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b-2 border-warm-brown/30">
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brown-500">
              Tabula Itineris
            </span>
            <span className="font-serif text-base font-bold text-brown-900 mt-0.5">
              导航 · Index
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-warm-brown text-warm-brown hover:bg-warm-brown hover:text-oat-100 transition-colors"
            aria-label="关闭菜单"
          >
            <span className="text-lg leading-none">✕</span>
          </button>
        </div>

        {/* 主体滚动区 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* 5 个主导航 */}
          <ul className="space-y-1 mb-6">
            {primaryNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between py-3 px-3 rounded transition-colors ${
                      isActive
                        ? "bg-brown-100 text-brown-900"
                        : "text-brown-700 hover:bg-oat-300/60 hover:text-brown-900"
                    }`}
                  >
                    <span className="font-serif text-lg">{item.label}</span>
                    <span
                      aria-hidden
                      className="text-brown-500 text-sm"
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* 5 个 category 快捷入口 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-6 h-px bg-brown-500 opacity-50" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brown-500">
                Tabula Classium
              </span>
              <span className="inline-block flex-1 h-px bg-brown-500 opacity-30" />
            </div>
            <ul className="grid grid-cols-1 gap-1.5">
              {categoryNav.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="flex items-center justify-between py-2 px-3 rounded text-brown-700 hover:bg-oat-300/60 hover:text-brown-900 transition-colors"
                  >
                    <span className="font-serif text-base">{c.label}</span>
                    <span className="font-display italic text-[11px] text-brown-500 tracking-wider">
                      {c.latin}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* GitHub link */}
          <div className="border-t border-brown-200 pt-4">
            <a
              href="https://github.com/mishishi/pet-atlas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 px-3 text-brown-700 hover:text-brown-900"
            >
              <span className="font-serif">GitHub 仓库</span>
              <span aria-hidden className="text-sm">↗</span>
            </a>
          </div>
        </div>

        {/* 底部 footer:Auth + 装饰 */}
        <div className="px-5 py-3 border-t border-brown-200/60 flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brown-500">
            Museum · 1876
          </span>
          <AuthMenu />
        </div>
      </aside>

      <style jsx>{`
        @keyframes mobileMenuFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes mobileMenuSlideIn {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .mobile-menu-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(74, 51, 28, 0.5);
          backdrop-filter: blur(2px);
          z-index: 70;
          animation: mobileMenuFadeIn 0.25s ease-out;
          cursor: pointer;
        }
        .mobile-menu-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(360px, 88vw);
          background: linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 100%);
          z-index: 75;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 32px -4px rgba(74, 51, 28, 0.4);
          animation: mobileMenuSlideIn 0.32s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .mobile-menu-drawer::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 4px;
          background: linear-gradient(180deg,
            var(--brown-500) 0%,
            var(--brown-700) 100%
          );
          opacity: 0.6;
        }
        @media (prefers-reduced-motion: reduce) {
          .mobile-menu-backdrop,
          .mobile-menu-drawer {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
