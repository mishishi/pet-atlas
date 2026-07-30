"use client";

/**
 * ThemeToggle · 暗/亮模式切换 (P2 polish, 2026-07-30)
 *
 * - 默认跟随系统 prefers-color-scheme
 * - 用户切换后 localStorage 记录 (pet-atlas-theme)
 * - 用 class="dark" on <html> 触发 CSS 变量切换
 * - 图标: sun (亮 mode) / moon (暗 mode)
 * - 不在 layout 渲染 (避免 SSR mismatch), 只在 client mount 后显示
 */

import { useEffect, useState } from "react";

const STORAGE_KEY = "pet-atlas-theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // 读 localStorage (默认跟随系统)
    const stored = (typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null) as
      | "light"
      | "dark"
      | null;
    const sysPrefersDark =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (sysPrefersDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const handleClick = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  // SSR / 未 mount: 不渲染 (避免 hydration mismatch)
  if (theme === null) {
    return (
      <button
        type="button"
        aria-label="主题切换"
        className={`flex items-center justify-center w-9 h-9 rounded-full border border-warm-brown/40 text-warm-brown/60 transition-colors hover:bg-warm-brown/5 ${className}`}
        style={{ visibility: "hidden" }}
      >
        <SunIcon />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
      title={theme === "dark" ? "暗色模式 (夜间)" : "亮色模式 (白天)"}
      className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
        theme === "dark"
          ? "border-brown-300/60 text-brown-200 hover:bg-brown-300/10"
          : "border-warm-brown/60 text-warm-brown hover:bg-warm-brown/10"
      } ${className}`}
    >
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

/** 应用主题 (改 <html> class + localStorage) */
function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (theme === "dark") html.classList.add("dark");
  else html.classList.remove("dark");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.15" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </svg>
  );
}
