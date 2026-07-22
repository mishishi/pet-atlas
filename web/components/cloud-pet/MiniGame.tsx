/**
 * web/components/cloud-pet/MiniGame.tsx · M2.5 互动小游戏
 *
 * 30s 反应速度 tap 游戏:
 * - 屏幕随机位置出现 pet emoji
 * - 点中 +1 hit,emoji 立即换位置
 * - 30s 后结算
 *
 * 奖励 (基于 hit 数):
 * - 0-2: 心情 -3
 * - 3-5: +xp 5, 心情 +3
 * - 6-9: +xp 12, 心情 +5
 * - 10+: +xp 20, 心情 +10
 *
 * 用法: <MiniGame onClose={...} onComplete={...} />
 * 客户端组件
 */

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { addXp } from "@/lib/petProgression";
import { setStats, getCurrentStats, type PetStats } from "@/lib/petStats";

const GAME_DURATION_SEC = 30;

const PET_EMOJIS = [
  "🐕", "🐈", "🐰", "🐹", "🐦", "🐢", "🦜", "🐠",
  "🐶", "🐱", "🐾", "🦊", "🐻", "🐼", "🐨",
];

const HIT_REWARDS: Array<{ min: number; xp: number; moodDelta: number; label: string; emoji: string }> = [
  { min: 10, xp: 20, moodDelta: 10, label: "天才!手速惊人", emoji: "🏆" },
  { min: 6, xp: 12, moodDelta: 5, label: "很棒!反应超快", emoji: "🌟" },
  { min: 3, xp: 5, moodDelta: 3, label: "还不错~继续加油", emoji: "✨" },
  { min: 0, xp: 0, moodDelta: -3, label: "再试一次~", emoji: "💪" },
];

export interface MiniGameProps {
  onClose: () => void;
  onComplete?: (hits: number) => void;
}

export function MiniGame({ onClose, onComplete }: MiniGameProps) {
  const [hits, setHits] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION_SEC);
  const [active, setActive] = useState(true);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<typeof HIT_REWARDS[number] | null>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // 百分比
  const [pop, setPop] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 倒计时
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setActive(false);
          setDone(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  // 游戏结束结算
  useEffect(() => {
    if (!done) return;
    const r = HIT_REWARDS.find((x) => hits >= x.min) || HIT_REWARDS[HIT_REWARDS.length - 1];
    setResult(r);
    // 写入 xp
    if (r.xp > 0) {
      addXp(r.xp);
      window.dispatchEvent(new Event("storage"));
    }
    // 写入心情
    const current = getCurrentStats();
    if (current) {
      const next: PetStats = {
        ...current,
        happiness: Math.max(0, Math.min(100, current.happiness + r.moodDelta)),
        lastUpdatedAt: Date.now(),
      };
      setStats(next);
      window.dispatchEvent(new Event("storage"));
    }
    onComplete?.(hits);
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  // 随机位置
  const randomize = useCallback(() => {
    // 留 80px 边距(emoji 64px)
    setPosition({
      x: 10 + Math.random() * 80, // 10-90%
      y: 10 + Math.random() * 75, // 10-85%
    });
  }, []);

  // 击中
  const handleHit = useCallback(() => {
    if (!active || done) return;
    setHits((h) => h + 1);
    setPop(true);
    setTimeout(() => setPop(false), 300);
    randomize();
  }, [active, done, randomize]);

  // 选一个 pet emoji 固定(hits 变化时换)
  const currentEmoji = PET_EMOJIS[hits % PET_EMOJIS.length];

  if (done && result) {
    return (
      <div
        className="fixed inset-0 z-50 bg-oat-50/95 backdrop-blur-sm flex items-center justify-center p-4"
        role="dialog"
        aria-label="游戏结果"
      >
        <div
          className="bg-oat-100 rounded-2xl p-6 max-w-sm w-full border-2 border-warm-brown/40 shadow-xl text-center"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/></svg>\")",
          }}
        >
          <div className="text-5xl mb-2" aria-hidden>
            {result.emoji}
          </div>
          <div className="text-2xl font-serif font-bold text-brown-900 mb-1">
            {result.label}
          </div>
          <div className="text-sm text-brown-600 mb-4">
            {GAME_DURATION_SEC}s 内击中 {hits} 次
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="px-3 py-2 rounded-lg bg-warm-brown/10 border border-warm-brown/30">
              <div className="text-[10px] text-brown-600">获得 XP</div>
              <div className="text-xl font-mono font-bold text-warm-brown">+{result.xp}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-warm-brown/10 border border-warm-brown/30">
              <div className="text-[10px] text-brown-600">心情</div>
              <div className="text-xl font-mono font-bold text-warm-brown">
                {result.moodDelta > 0 ? "+" : ""}
                {result.moodDelta}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-warm-brown text-white font-medium hover:opacity-90"
              type="button"
            >
              收下奖励
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-oat-50/95 backdrop-blur-sm"
      role="dialog"
      aria-label="反应小游戏"
    >
      {/* 顶部 HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="px-3 py-1.5 rounded-full bg-oat-100/90 border border-warm-brown/40 shadow-sm">
          <span className="text-xs text-brown-600 font-mono">⏱ {secondsLeft}s</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-warm-brown/15 border border-warm-brown/40 shadow-sm">
          <span className="text-sm font-mono font-bold text-warm-brown">
            击中 {hits} 次
          </span>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-full bg-oat-100/90 border border-brown-300 text-xs text-brown-700 hover:bg-brown-50"
          type="button"
        >
          退出
        </button>
      </div>

      {/* 游戏区 */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ touchAction: "manipulation" }}
      >
        <button
          onClick={handleHit}
          className={[
            "absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center text-4xl border-2 shadow-lg transition-all select-none cursor-pointer",
            pop ? "scale-150 opacity-0" : "scale-100",
            "bg-oat-50 border-warm-brown hover:border-warm-brown/80 hover:scale-110 active:scale-95",
          ].join(" ")}
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transition: pop ? "transform 0.3s, opacity 0.3s" : "transform 0.1s",
          }}
          aria-label="点击 pet"
          type="button"
        >
          {currentEmoji}
        </button>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-xs text-brown-600">
          30 秒内尽可能多地点中 pet · 点中 10+ 次有惊喜 🏆
        </p>
      </div>
    </div>
  );
}
