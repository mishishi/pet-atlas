"use client";

/**
 * SoundToggle · 全局翻页音效开关 (P2 polish, 2026-07-30)
 *
 * - 放在 Atlas header 右上角
 * - 默认开, 用户可关 (localStorage pet-atlas-sound-on)
 * - 点击同时 unlock AudioContext (Chrome autoplay policy)
 * - 跟 prefers-reduced-motion 联动: 系统关 → 视觉上显示关闭
 * - 图标: 开 = 喇叭, 关 = 喇叭斜线
 */

import { useEffect, useState } from "react";
import { isSoundOn, setSoundOn, unlockAudio } from "@/lib/sounds";

export function SoundToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOn(isSoundOn());
  }, []);

  const handleClick = () => {
    unlockAudio(); // 第一次点击解锁 AudioContext
    const next = !on;
    setOn(next);
    setSoundOn(next);
  };

  // SSR 期间 / 还未 mount: 不渲染 (避免 hydration mismatch)
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="翻页音效"
        className={`flex items-center justify-center w-9 h-9 rounded-full border border-warm-brown/40 text-warm-brown/60 transition-colors hover:bg-warm-brown/5 ${className}`}
        style={{ visibility: "hidden" }}
      >
        <SoundIcon on={true} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={on ? "关闭翻页音效" : "开启翻页音效"}
      title={on ? "翻页音效 (开)" : "翻页音效 (关)"}
      className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
        on
          ? "border-warm-brown/60 text-warm-brown hover:bg-warm-brown/10"
          : "border-warm-brown/20 text-warm-brown/40 hover:bg-warm-brown/5"
      } ${className}`}
    >
      <SoundIcon on={on} />
    </button>
  );
}

function SoundIcon({ on }: { on: boolean }) {
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
      {/* 喇叭主体 */}
      <path d="M11 5 L6 9 H3 V15 H6 L11 19 Z" fill="currentColor" fillOpacity="0.15" />
      {/* 声波 (on 时显示) */}
      {on ? (
        <>
          <path d="M15.5 8.5 a5 5 0 0 1 0 7" />
          <path d="M18 6 a8 8 0 0 1 0 12" />
        </>
      ) : (
        /* 关: 一道斜线 */
        <line x1="16" y1="9" x2="22" y2="15" />
      )}
    </svg>
  );
}
