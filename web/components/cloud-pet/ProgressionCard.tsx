/**
 * web/components/cloud-pet/ProgressionCard.tsx · M2.5 进度卡
 *
 * 显示:
 * - 等级 + emoji + title
 * - xp bar (current/next level)
 * - 签到按钮 + streak
 * - 解锁的 badges
 *
 * 客户端组件(localStorage + 实时更新)
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  type Progression,
  getProgression,
  refreshProgression,
  checkIn,
  checkedInToday,
  xpForLevel,
  levelProgress,
  levelTitle,
  LEVEL_META,
  BADGES,
  type Badge,
  type LevelTitle,
} from "@/lib/petProgression";

export function ProgressionCard() {
  const [prog, setProg] = useState<Progression | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [levelUpFlash, setLevelUpFlash] = useState<{ from: number; to: number } | null>(null);

  useEffect(() => {
    setProg(refreshProgression());
    const onStorage = () => setProg(refreshProgression());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const flash = useCallback((msg: string, ms = 2500) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }, []);

  const handleCheckIn = useCallback(() => {
    const r = checkIn();
    setProg(r.prog);
    if (r.ok) {
      flash(`签到成功! +${r.gained} xp · 连签 ${r.prog.streakDays} 天 🔥`);
      // 检查升级
      const before = prog?.level || 1;
      if (r.prog.level > before) {
        setLevelUpFlash({ from: before, to: r.prog.level });
        setTimeout(() => setLevelUpFlash(null), 3500);
      }
    } else {
      flash(r.reason || "签到失败");
    }
  }, [flash, prog]);

  if (!prog) return null;

  const { level, intoLevel, nextLevelTotal } = levelProgress(prog.xp);
  const title = levelTitle(level);
  const meta = LEVEL_META[title as LevelTitle];
  const xpPct = nextLevelTotal > 0 ? Math.min(100, (intoLevel / nextLevelTotal) * 100) : 100;
  const didCheckIn = checkedInToday();

  return (
    <div
      className="bg-oat-100/60 rounded-xl p-4 border border-brown-200/70 mb-4"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/></svg>\")",
      }}
    >
      {/* 等级 + title */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2"
          style={{ borderColor: meta.color, background: `${meta.color}15` }}
          aria-hidden
        >
          {meta.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-brown-600">等级</span>
            <span className="text-2xl font-bold" style={{ color: meta.color }}>
              {level}
            </span>
            <span className="text-sm font-medium" style={{ color: meta.color }}>
              {title}
            </span>
            {levelUpFlash && (
              <span className="text-xs font-mono text-brick animate-pulse">
                🎉 升至 Lv {levelUpFlash.to}!
              </span>
            )}
          </div>
          <div className="text-[10px] text-brown-500">{meta.desc}</div>
        </div>
      </div>

      {/* XP bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] text-brown-600 mb-1">
          <span>XP 进度</span>
          <span className="font-mono">
            {intoLevel} / {nextLevelTotal}
          </span>
        </div>
        <div className="h-2 rounded-full bg-brown-100/80 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${xpPct}%`,
              background: `linear-gradient(90deg, ${meta.color}99 0%, ${meta.color} 100%)`,
            }}
          />
        </div>
        <div className="text-[10px] text-brown-500 text-right mt-0.5 font-mono">
          总 {prog.xp} xp
        </div>
      </div>

      {/* 签到 + Streak */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={handleCheckIn}
          disabled={didCheckIn}
          className={[
            "flex-1 py-2 rounded-lg border text-sm font-medium transition-all",
            didCheckIn
              ? "bg-warm-brown/10 border-warm-brown/30 text-warm-brown cursor-default"
              : "bg-warm-brown border-warm-brown text-white hover:opacity-90 active:scale-[0.98]",
          ].join(" ")}
          type="button"
        >
          {didCheckIn ? "✓ 今日已签" : "📅 每日签到"}
        </button>
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-oat-50 border border-warm-brown/30">
          <span className="text-base" aria-hidden>
            🔥
          </span>
          <span className="text-sm font-mono font-bold text-brown-800">
            {prog.streakDays}
          </span>
          <span className="text-[10px] text-brown-600">天</span>
        </div>
      </div>

      {/* Badges */}
      {prog.unlockedBadges.length > 0 && (
        <div>
          <div className="text-[10px] text-brown-600 mb-1.5">已解锁成就</div>
          <div className="flex flex-wrap gap-1.5">
            {prog.unlockedBadges.map((key) => {
              const b = BADGES.find((bd) => bd.key === key);
              if (!b) return null;
              return (
                <div
                  key={key}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-warm-brown/10 border border-warm-brown/30 text-[10px] text-brown-800"
                  title={b.desc}
                >
                  <span aria-hidden>{b.emoji}</span>
                  <span>{b.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* xp 来源提示 */}
      <p className="text-[10px] text-brown-500 text-center mt-3 leading-relaxed">
        喂食 +5xp · 玩耍 +8xp · 休息 +3xp · 签到 +20xp(+streak bonus)
      </p>

      {/* toast */}
      {toast && (
        <div
          className="mt-3 px-3 py-2 rounded-lg bg-brown-50 border border-brown-200 text-center text-sm text-brown-800"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
