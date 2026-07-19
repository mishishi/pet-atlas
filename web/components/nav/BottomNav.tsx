/**
 * BottomNav · 移动端底部 tab(2026-07-20 新增)
 *
 * 设计原则:
 * - 移动端优先,桌面端也保留(放右下角或底部)
 * - 3 个 tab:首页 / 我的 / 全部品种
 * - 当前页高亮(暖棕底色)
 * - 复古标本卡风(暖棕 icon + 米色背景)
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "首页",
    icon: HomeIcon,
    match: (p: string) => p === "/",
  },
  {
    href: "/pets",
    label: "图鉴",
    icon: BookIcon,
    match: (p: string) => p.startsWith("/pets"),
  },
  {
    href: "/profile",
    label: "我的",
    icon: PawIcon,
    match: (p: string) => p.startsWith("/profile") || p.startsWith("/adopt"),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname() || "/";
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-brown-300/60 md:hidden"
      style={{
        background:
          "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 100%)",
        boxShadow: "0 -4px 16px rgba(139, 111, 71, 0.12)",
      }}
    >
      <div className="flex items-stretch justify-around max-w-md mx-auto">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
                active
                  ? "text-warm-brown"
                  : "text-brown-500 hover:text-brown-700"
              }`}
            >
              <Icon active={active} />
              <span
                className={`text-xs font-medium tracking-wide ${
                  active ? "font-bold" : ""
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ===== Icons (inline SVG, 24×24, warm brown palette) =====

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5Z" />
    </svg>
  );
}

function BookIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5V4.5Z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M8 7h7M8 11h7" />
    </svg>
  );
}

function PawIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={active ? 1.4 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="7" cy="9" rx="2" ry="2.5" />
      <ellipse cx="12" cy="6" rx="2" ry="2.5" />
      <ellipse cx="17" cy="9" rx="2" ry="2.5" />
      <ellipse cx="19" cy="14" rx="1.6" ry="2" />
      <path d="M9 14c-2 0-3 1.5-3 3 0 1.5 1.2 2.5 2.5 2.5 1 0 1.5-.5 2.5-.5s1.5.5 2.5.5c1.3 0 2.5-1 2.5-2.5 0-1.5-1-3-3-3-.8 0-1.3.4-2 .4s-1.2-.4-2-.4Z" />
    </svg>
  );
}
