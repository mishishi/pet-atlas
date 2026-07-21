/**
 * web/components/cloud-pet/MoodPortrait.tsx · M2.5 状态感知立绘
 *
 * 给立绘(图片)外面包一层 overlay,按 PetStats 实时加装饰效果。
 * 立绘本身不动,纯 CSS filter + SVG 装饰叠加。
 *
 * 设计原则:
 * - 立绘是 vintage museum specimen card,装饰要"vintage" 风格
 *   (空碗、Zzz、雨滴、✨ 闪光、灰暗角)
 * - 所有装饰 pointer-events-none,不影响点击
 * - 8s transition,stat 变化时是平滑过渡不是生硬切换
 *
 * 触发条件(基于 stat 0-100):
 * - 饱腹低(< 50):空碗左下角
 * - 能量低(< 50):Zzz + 月亮右上
 * - 心情低(< 50):雨滴 3 颗上方
 * - 状态好(全> 70):✨ 闪光 4 角
 * - 极差(全< 20):灰度 vignette 覆盖
 *
 * 装饰强度按 stat 反向插值:
 * - stat 0 → 装饰 opacity 1
 * - stat 50 → 装饰 opacity 0
 * - 之上:消失
 */

"use client";

import { useEffect, useState } from "react";
import { getCurrentStats, type PetStats } from "@/lib/petStats";

export interface MoodPortraitProps {
  src: string;
  alt: string;
  className?: string;
  /** 可选外部 stats,优先用(避免重复 read localStorage) */
  stats?: PetStats | null;
}

/** 0-1 压抑度:stat 越低压抑越重(0-50 反向插值) */
function tiredOf(stat: number): number {
  if (stat >= 50) return 0;
  return (50 - stat) / 50;
}

/** 0-1 愉悦度:stat 越高越开心(70+ 开始,100 顶满) */
function happyOf(stat: number): number {
  if (stat < 70) return 0;
  return Math.min(1, (stat - 70) / 30);
}

export function MoodPortrait({ src, alt, className, stats: externalStats }: MoodPortraitProps) {
  const [internalStats, setInternalStats] = useState<PetStats | null>(null);

  // 仅在无外部 stats 时自读(避免重复 IO)
  useEffect(() => {
    if (externalStats !== undefined) return;
    setInternalStats(getCurrentStats());
    const onStorage = () => setInternalStats(getCurrentStats());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [externalStats]);

  const stats = externalStats !== undefined ? externalStats : internalStats;

  if (!stats) {
    // SSR / 加载中:纯图
    return (
      <div className={`relative ${className || ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  const hungerTired = tiredOf(stats.hunger);
  const energyTired = tiredOf(stats.energy);
  const happinessTired = tiredOf(stats.happiness);
  const overallTired = (hungerTired + energyTired + happinessTired) / 3;
  const overallHappy = Math.min(
    1,
    (happyOf(stats.hunger) + happyOf(stats.energy) + happyOf(stats.happiness)) / 3
  );

  // CSS filter 整体调
  const filterStr = (() => {
    if (overallTired > 0.7) return "saturate(0.45) brightness(0.82) contrast(0.95)";
    if (overallTired > 0.4) return "saturate(0.75) brightness(0.95)";
    if (overallHappy > 0.5) return "saturate(1.15) brightness(1.06)";
    return "none";
  })();

  return (
    <div className={`relative ${className || ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-all duration-700 ease-out"
        style={{ filter: filterStr }}
      />

      {/* 1. 状态差 vignette (灰暗角) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
        style={{
          opacity: Math.max(0, (overallTired - 0.4) * 1.67),
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(40, 28, 20, 0.55) 100%)",
        }}
        aria-hidden
      />

      {/* 2. 状态好 - ✨ 闪光 4 角 */}
      {overallHappy > 0.2 && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <Sparkle
            className="absolute top-3 left-3"
            opacity={overallHappy}
            size={18}
          />
          <Sparkle
            className="absolute top-3 right-3"
            opacity={overallHappy}
            size={14}
          />
          <Sparkle
            className="absolute bottom-3 right-3"
            opacity={overallHappy}
            size={20}
          />
          <Sparkle
            className="absolute bottom-3 left-3"
            opacity={overallHappy}
            size={12}
          />
        </div>
      )}

      {/* 3. 饱腹低 - 空碗底部居中(避开左下"柴犬" chip) */}
      {hungerTired > 0.2 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-700"
          style={{ opacity: Math.min(1, hungerTired * 1.5) }}
          aria-hidden
        >
          <EmptyBowl />
        </div>
      )}

      {/* 4. 能量低 - 💤 Zzz + 月亮左侧中部(避开右上 paw) */}
      {energyTired > 0.2 && (
        <div
          className="absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none transition-opacity duration-700"
          style={{ opacity: Math.min(1, energyTired * 1.5) }}
          aria-hidden
        >
          <SleepZzz />
        </div>
      )}

      {/* 5. 心情低 - 💧 雨滴顶部居中(避开 4 角 paw 装饰) */}
      {happinessTired > 0.2 && (
        <div
          className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-700 flex gap-1"
          style={{ opacity: Math.min(1, happinessTired * 1.5) }}
          aria-hidden
        >
          <RainDrop delay={0} />
          <RainDrop delay={0.2} />
          <RainDrop delay={0.4} />
        </div>
      )}
    </div>
  );
}

// ====== SVG 装饰子组件 ======

function Sparkle({
  className,
  opacity,
  size = 16,
}: {
  className?: string;
  opacity: number;
  size?: number;
}) {
  return (
    <svg
      className={`${className || ""} transition-opacity duration-700`}
      style={{ opacity }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0L13.5 8.5L22 12L13.5 15.5L12 24L10.5 15.5L2 12L10.5 8.5L12 0Z"
        fill="#FFF6D6"
        stroke="#8B6F47"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

function EmptyBowl() {
  return (
    <svg
      width="40"
      height="32"
      viewBox="0 0 40 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 碗外圈 */}
      <ellipse
        cx="20"
        cy="22"
        rx="16"
        ry="6"
        fill="#F5EFE0"
        stroke="#8B6F47"
        strokeWidth="1.5"
      />
      {/* 碗内空心 */}
      <ellipse cx="20" cy="22" rx="11" ry="3" fill="#E8D9B8" />
      {/* 裂痕/缺口提示 */}
      <path
        d="M10 18 L13 16 M30 18 L27 16"
        stroke="#A44A3F"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SleepZzz() {
  return (
    <svg
      width="48"
      height="32"
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 月牙 */}
      <path
        d="M16 18 A8 8 0 1 1 24 26 A6 6 0 1 0 16 18 Z"
        fill="#F5EFE0"
        stroke="#8B6F47"
        strokeWidth="1.2"
      />
      {/* Zzz */}
      <text
        x="30"
        y="14"
        fontSize="10"
        fontFamily="monospace"
        fill="#8B6F47"
        fontWeight="bold"
      >
        z
      </text>
      <text
        x="34"
        y="10"
        fontSize="13"
        fontFamily="monospace"
        fill="#8B6F47"
        fontWeight="bold"
      >
        z
      </text>
      <text
        x="39"
        y="6"
        fontSize="16"
        fontFamily="monospace"
        fill="#8B6F47"
        fontWeight="bold"
      >
        Z
      </text>
    </svg>
  );
}

function RainDrop({ delay = 0 }: { delay?: number }) {
  return (
    <svg
      width="14"
      height="20"
      viewBox="0 0 14 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: `rainDrop 1.4s ease-in ${delay}s infinite`,
      }}
    >
      <path
        d="M7 0 C7 0 0 9 0 13 A7 7 0 0 0 14 13 C14 9 7 0 7 0 Z"
        fill="#7B9DB8"
        stroke="#3D5A75"
        strokeWidth="0.8"
        opacity="0.85"
      />
    </svg>
  );
}
