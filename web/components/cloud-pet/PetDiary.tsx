/**
 * web/components/cloud-pet/PetDiary.tsx · M2 B 宠物日记 UI
 *
 * 展示: 当前领养宠物的 diary 时间线(倒序)
 * - 每条 entry 是一张卡片:动作 emoji + 时间 + mood + 模板渲染的文案
 * - 显示 top N (默认 5),"看更多"展开完整
 *
 * 客户端组件(读 localStorage + TCB 拉新)
 *
 * 用法:
 *   <PetDiary petId={pet.petId} />
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllDiaryEntries,
  getDiaryEntriesByPet,
  relativeTime,
  ACTION_META,
  type DiaryEntry,
} from "@/lib/petDiary";
import { getAdoptedPet } from "@/lib/cloudPet";
import { MOOD_META } from "@/lib/petStats";

const DEFAULT_LIMIT = 5;

export function PetDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [, forceTick] = useState(0); // 强制 re-render(相对时间刷新)

  useEffect(() => {
    setMounted(true);
    refresh();
    // 监听 storage 事件(多 tab + 同步)
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    // 相对时间每分钟更新
    const id = setInterval(() => forceTick((n) => n + 1), 60_000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(id);
    };
  }, []);

  const refresh = useCallback(() => {
    const pet = getAdoptedPet();
    if (!pet) {
      setEntries([]);
      return;
    }
    setEntries(getDiaryEntriesByPet(pet.petId));
  }, []);

  if (!mounted) return null;

  const pet = getAdoptedPet();
  if (!pet) return null;

  const visible = expanded ? entries : entries.slice(0, DEFAULT_LIMIT);
  const hidden = entries.length - visible.length;

  return (
    <div
      className="bg-oat-100/60 rounded-xl p-4 border border-brown-200/70 mb-4"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/></svg>\")",
      }}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-serif text-base font-bold text-brown-900">
          📖 我的日记
        </h3>
        <span className="text-[10px] font-mono text-brown-500">
          {entries.length} 条
        </span>
      </div>

      {/* Timeline */}
      {entries.length === 0 ? (
        <div className="text-center py-6 text-sm text-brown-500">
          还没有日记 · 喂食或玩耍后会自动记一笔
        </div>
      ) : (
        <ol className="space-y-3">
          {visible.map((entry, idx) => (
            <DiaryCard key={entry.id} entry={entry} isFirst={idx === 0} />
          ))}
        </ol>
      )}

      {/* Show more */}
      {hidden > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full mt-3 py-2 text-xs font-medium text-warm-brown hover:text-brown-800 border border-warm-brown/30 rounded-lg hover:bg-warm-brown/5 transition-colors"
        >
          展开剩余 {hidden} 条 ↓
        </button>
      )}
      {expanded && entries.length > DEFAULT_LIMIT && (
        <button
          onClick={() => setExpanded(false)}
          className="w-full mt-3 py-2 text-xs font-medium text-brown-600 hover:text-brown-800 border border-brown-200 rounded-lg hover:bg-brown-50 transition-colors"
        >
          收起 ↑
        </button>
      )}
    </div>
  );
}

// ===== 单条卡片 =====

function DiaryCard({ entry, isFirst }: { entry: DiaryEntry; isFirst: boolean }) {
  const meta = ACTION_META[entry.actionType];
  const moodMeta = MOOD_META[entry.petSnapshot.mood];
  return (
    <li className="relative pl-5">
      {/* Timeline dot + line */}
      <div
        className="absolute left-1 top-2 w-2.5 h-2.5 rounded-full border-2 border-oat-50"
        style={{ background: meta.color }}
        aria-hidden
      />
      {!isFirst && (
        <div
          className="absolute left-[10px] -top-3 w-0.5 h-3 bg-brown-200"
          aria-hidden
        />
      )}

      <div className="text-[10px] font-mono text-brown-500 mb-0.5">
        {relativeTime(entry.timestamp)}
      </div>

      <div className="flex items-start gap-2 mb-1">
        <span className="text-base" aria-hidden>
          {meta.emoji}
        </span>
        <span
          className="text-[11px] font-medium px-1.5 py-0.5 rounded"
          style={{ background: `${meta.color}1A`, color: meta.color }}
        >
          {meta.label}
        </span>
        <span className="text-[11px]" aria-hidden>
          {moodMeta.emoji}
        </span>
      </div>

      <p className="text-sm text-brown-800 leading-relaxed">{entry.text}</p>

      {/* Sync indicator */}
      {entry.syncStatus === "pending" && (
        <div className="text-[9px] font-mono text-amber-600 mt-0.5">待同步</div>
      )}
    </li>
  );
}
