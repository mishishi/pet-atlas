/**
 * web/components/cloud-pet/PetStatusCard.tsx · M2 宠物状态卡
 *
 * 包含:
 * - 3 个 stat bar(hunger / energy / happiness)+ 数值
 * - 心情 emoji + 文案(派生自 stats)
 * - 3 个 action 按钮(feed / play / rest)+ 冷却倒计时
 * - 行动反馈 toast(1.5s 自动消失)
 *
 * 客户端组件(读 localStorage + 倒计时)
 *
 * 用法:
 *   <PetStatusCard />
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  type PetStats,
  type ActionType,
  getCurrentStats,
  performAction,
  getCooldownRemaining,
  deriveMood,
  MOOD_META,
  getActionConfig,
  ALL_ACTIONS,
} from "@/lib/petStats";
import {
  getSyncStatus,
  onSyncStatusChange,
  type SyncStatus,
} from "@/lib/tcbSync";

const STAT_DISPLAY: Array<{
  key: "hunger" | "energy" | "happiness";
  label: string;
  emoji: string;
  color: string; // 暖色调
}> = [
  { key: "hunger", label: "饱腹", emoji: "🍖", color: "#A44A3F" }, // brick
  { key: "energy", label: "能量", emoji: "⚡", color: "#C9A14A" }, // amber
  { key: "happiness", label: "心情", emoji: "❤️", color: "#4A5D3A" }, // forest
];

const COOLDOWN_TICK_MS = 1000;

const SYNC_BADGE: Record<SyncStatus, { emoji: string; label: string; tone: string }> = {
  idle: { emoji: "☁️", label: "本地", tone: "text-brown-500" },
  syncing: { emoji: "🔄", label: "同步中", tone: "text-amber-600" },
  synced: { emoji: "☁️", label: "已同步", tone: "text-forest" },
  offline: { emoji: "📡", label: "离线", tone: "text-brown-400" },
  error: { emoji: "⚠️", label: "同步失败", tone: "text-brick" },
};

export function PetStatusCard() {
  const [stats, setStats] = useState<PetStats | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [, forceTick] = useState(0); // 强制 re-render 倒计时

  // 同步状态订阅
  useEffect(() => {
    setSyncStatus(getSyncStatus());
    return onSyncStatusChange(setSyncStatus);
  }, []);

  // 初次加载 + 监听 storage 变化(多 tab 同步)
  useEffect(() => {
    setStats(getCurrentStats());
    const onStorage = () => setStats(getCurrentStats());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 倒计时 tick(每秒)
  useEffect(() => {
    if (!stats) return;
    const id = setInterval(() => forceTick((n) => n + 1), COOLDOWN_TICK_MS);
    return () => clearInterval(id);
  }, [stats]);

  const handleAction = useCallback((action: ActionType) => {
    const result = performAction(action);
    if (result.ok) {
      setStats(result.stats);
      setToast(result.feedback);
      // 1.5s 自动消失
      setTimeout(() => setToast(null), 1500);
    } else {
      // 冷却中:简短提示
      setToast(result.reason);
      setTimeout(() => setToast(null), 1200);
    }
  }, []);

  if (!stats) return null;

  const mood = deriveMood(stats);
  const moodMeta = MOOD_META[mood];

  return (
    <div
      className="bg-oat-100/60 rounded-xl p-4 border border-brown-200/70 mb-4"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/></svg>\")",
      }}
    >
      {/* 心情指示器 + 同步状态 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl" aria-hidden>
          {moodMeta.emoji}
        </span>
        <div className="flex-1">
          <div
            className="text-sm font-medium"
            style={{ color: moodMeta.color }}
          >
            {moodMeta.label}
          </div>
          <div className="text-[11px] text-brown-600">{moodMeta.description}</div>
        </div>
        {/* M2.5 同步状态徽章 */}
        <div
          className={`flex items-center gap-1 text-[10px] font-mono ${SYNC_BADGE[syncStatus].tone}`}
          title={
            syncStatus === "offline"
              ? "当前离线,数据存在本地,联网后自动同步"
              : syncStatus === "error"
              ? "云端同步失败,稍后重试"
              : syncStatus === "synced"
              ? "已同步到云端"
              : "本地模式(未配云端)"
          }
        >
          <span aria-hidden>{SYNC_BADGE[syncStatus].emoji}</span>
          <span>{SYNC_BADGE[syncStatus].label}</span>
        </div>
      </div>

      {/* 状态条 */}
      <div className="space-y-2.5 mb-4">
        {STAT_DISPLAY.map((stat) => (
          <StatBar
            key={stat.key}
            label={stat.label}
            emoji={stat.emoji}
            value={stats[stat.key]}
            color={stat.color}
          />
        ))}
      </div>

      {/* 动作按钮 */}
      <div className="grid grid-cols-3 gap-2">
        {ALL_ACTIONS.map((action) => {
          const cfg = getActionConfig(action);
          const remaining = getCooldownRemaining(stats, action);
          const disabled = remaining > 0;
          return (
            <ActionBtn
              key={action}
              action={action}
              disabled={disabled}
              onClick={() => handleAction(action)}
            />
          );
        })}
      </div>

      {/* 衰减提示 */}
      <p className="text-[10px] text-brown-500 text-center mt-3 leading-relaxed">
        状态随时间自然衰减 · 喂食/玩耍/休息各有 1 分钟冷却
      </p>

      {/* Toast 反馈 */}
      {toast && (
        <div
          className="mt-3 px-3 py-2 rounded-lg bg-brown-50 border border-brown-200 text-center text-sm text-brown-800 animate-[fadeIn_0.2s_ease-out]"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

// ===== 内部子组件 =====

function StatBar({
  label,
  emoji,
  value,
  color,
}: {
  label: string;
  emoji: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-brown-700">
          <span className="mr-1" aria-hidden>
            {emoji}
          </span>
          {label}
        </span>
        <span className="font-mono text-brown-600">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-brown-100/80 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}99 0%, ${color} 100%)`,
          }}
        />
      </div>
    </div>
  );
}

function ActionBtn({
  action,
  disabled,
  onClick,
}: {
  action: ActionType;
  disabled: boolean;
  onClick: () => void;
}) {
  const cfg = getActionConfig(action);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-lg border transition-all",
        disabled
          ? "bg-brown-50 border-brown-200 text-brown-400 cursor-not-allowed"
          : "bg-oat-50 border-warm-brown/40 text-brown-800 hover:bg-warm-brown/10 hover:border-warm-brown active:scale-95",
      ].join(" ")}
      type="button"
    >
      <span className="text-lg" aria-hidden>
        {cfg.emoji}
      </span>
      <span className="text-xs font-medium">{cfg.label}</span>
      <span className="text-[10px] text-brown-500">
        {cfg.primaryDelta > 0 ? "+" : ""}
        {cfg.primaryDelta} {cfg.primary === "hunger" ? "饱腹" : cfg.primary === "energy" ? "能量" : "心情"}
      </span>
    </button>
  );
}
