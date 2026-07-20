/**
 * web/lib/petDiary.ts · M2 B 宠物日记 (数据层 + 文案模板)
 *
 * 设计:
 * - 触发: event-driven (喂/玩/休息) + 领养时首条
 * - 文案: 模板字符串 + 变量替换 (M2 不上 LLM,模板够用)
 * - 存储: localStorage 主 + TCB 同步 (M2.5 已留接口)
 * - 数据: append-only,按 timestamp 倒序展示
 *
 * 升级路径 (M3+):
 * - 上 LLM 写更生动的文案(基于最近 N 条 entry + 品种特征)
 * - 文案 prompt 模板化(给 LLM 喂上下文)
 *
 * Storage key:
 * - pet-atlas:pet-diary:v1
 */

import { type PetStats, type Mood, MOOD_META } from "./petStats";
import type { CloudPet } from "./cloudPet";

export type DiaryActionType = "feed" | "play" | "rest" | "adopt";

export type DiaryEntry = {
  /** uuid */
  id: string;
  /** ms timestamp */
  timestamp: number;
  /** 触发动作 */
  actionType: DiaryActionType;
  /** 触发时的宠物快照(防止 reroll 后历史失真) */
  petSnapshot: {
    petId: string;
    petName: string;
    breedZh: string;
    mood: Mood;
  };
  /** 触发时的 3 维 stat */
  stats: {
    hunger: number;
    energy: number;
    happiness: number;
  };
  /** 模板渲染好的文案(中文) */
  text: string;
  /** TCB 同步状态(本地写入时 'pending',TCB ack 后变 'synced') */
  syncStatus?: "pending" | "synced" | "error";
};

const KEY_DIARY = "pet-atlas:pet-diary:v1";

/** 单只宠物最大保留 entry 数(防 localStorage 爆炸) */
const MAX_ENTRIES_PER_PET = 200;

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): DiaryEntry[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEY_DIARY);
    if (!raw) return [];
    return JSON.parse(raw) as DiaryEntry[];
  } catch {
    return [];
  }
}

function writeAll(entries: DiaryEntry[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEY_DIARY, JSON.stringify(entries));
  } catch (err) {
    console.warn("[petDiary] 写入失败:", err);
  }
}

/** 读所有 entry(按 timestamp 倒序) */
export function getAllDiaryEntries(): DiaryEntry[] {
  return readAll().sort((a, b) => b.timestamp - a.timestamp);
}

/** 按 petId 过滤 */
export function getDiaryEntriesByPet(petId: string): DiaryEntry[] {
  return getAllDiaryEntries().filter((e) => e.petSnapshot.petId === petId);
}

/** 追加一条 entry(append-only) */
export function appendDiaryEntry(
  actionType: DiaryActionType,
  pet: CloudPet,
  stats: PetStats,
  mood: Mood
): DiaryEntry {
  const entry: DiaryEntry = {
    id: generateId(),
    timestamp: Date.now(),
    actionType,
    petSnapshot: {
      petId: pet.petId,
      petName: pet.petName,
      breedZh: pet.breedZh,
      mood,
    },
    stats: {
      hunger: stats.hunger,
      energy: stats.energy,
      happiness: stats.happiness,
    },
    text: renderDiaryText(actionType, pet, mood, stats),
    syncStatus: "pending",
  };
  const all = readAll();
  all.push(entry);
  // trim 老的
  const trimmed = trimEntries(all, pet.petId);
  writeAll(trimmed);
  // 异步 fire-and-forget 同步 TCB
  if (isClient()) {
    import("./tcbSync")
      .then(({ pushDiaryEntriesToTcb }) => pushDiaryEntriesToTcb([entry]))
      .catch((err) => console.warn("[petDiary] sync 调度失败", err));
  }
  return entry;
}

/** 删除某只宠物的所有 diary(clearAdoptedPet 时调用) */
export function clearDiaryForPet(petId: string): void {
  if (!isClient()) return;
  const all = readAll().filter((e) => e.petSnapshot.petId !== petId);
  writeAll(all);
}

/** 标记 entry 为 synced(TCB ack 后) */
export function markDiarySynced(ids: string[]): void {
  if (!ids.length || !isClient()) return;
  const idSet = new Set(ids);
  const all = readAll().map((e) =>
    idSet.has(e.id) ? { ...e, syncStatus: "synced" as const } : e
  );
  writeAll(all);
}

function trimEntries(all: DiaryEntry[], petId: string): DiaryEntry[] {
  const forThisPet = all.filter((e) => e.petSnapshot.petId === petId);
  if (forThisPet.length <= MAX_ENTRIES_PER_PET) return all;
  // 删最老的
  const sorted = forThisPet.sort((a, b) => a.timestamp - b.timestamp);
  const toRemove = new Set(sorted.slice(0, sorted.length - MAX_ENTRIES_PER_PET).map((e) => e.id));
  return all.filter((e) => !toRemove.has(e.id));
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `diary-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ===== 文案模板 =====

const TEMPLATES: Record<DiaryActionType, string[]> = {
  adopt: [
    "今天从图鉴里把 {name} 领回家了！一只{breed},{moodEmoji}。希望以后的日子都暖暖的。",
    "在 51 个品种里挑中了 {name}（{breed}），它{moodEmoji}地看着我。心都化了。",
    "从今天起,{name} 就是我的云宠物啦。第一印象:{moodEmoji}。",
  ],
  feed: [
    "{name} 狼吞虎咽地吃完了饭,碗底都舔干净了。饱腹度+{delta},{moodEmoji}。",
    "喂了 {name} 一顿,吃得超香,打了个小嗝~ {moodEmoji}",
    "饭点到了,{name} 准时在脚边打转。喂完它{moodEmoji}地蹭了蹭我的手。",
  ],
  play: [
    "跟 {name} 玩了会儿,它{moodEmoji},在屋子里转圈圈。我也忍不住笑出声。",
    "{name} 叼着球跑过来,玩得超开心。心情+{delta},{moodEmoji}。",
    "今天 {name} 精力充沛,满屋子跑。跑累了就{moodEmoji}趴着喘气。",
  ],
  rest: [
    "{name} 蜷成一团睡了半小时,醒来{moodEmoji}地伸了个懒腰。",
    "让 {name} 安静休息了一会儿,醒来精神奕奕。能量+{delta}。",
    "{name} 打了个小呼噜,睡得香香的。{moodEmoji}",
  ],
};

const ACTION_DELTA: Record<DiaryActionType, number> = {
  adopt: 0,
  feed: 35,
  play: 25,
  rest: 40,
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderDiaryText(
  action: DiaryActionType,
  pet: CloudPet,
  mood: Mood,
  stats: PetStats
): string {
  const tmpl = pick(TEMPLATES[action]);
  return tmpl
    .replace(/{name}/g, pet.petName)
    .replace(/{breed}/g, pet.breedZh)
    .replace(/{moodEmoji}/g, MOOD_META[mood].emoji)
    .replace(/{delta}/g, String(ACTION_DELTA[action]));
}

// ===== 展示辅助 =====

/** 相对时间("刚刚" / "5分钟前" / "1小时前" / "昨天 14:30" / "2026-07-15") */
export function relativeTime(timestamp: number, now: number = Date.now()): string {
  const diff = now - timestamp;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "刚刚";
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;

  const d = new Date(timestamp);
  const nowD = new Date(now);
  const yesterday = new Date(now - day);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const sameYesterday = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameYesterday(d, yesterday)) {
    return `昨天 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  // 同年
  if (d.getFullYear() === nowD.getFullYear()) {
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 动作显示配置(emoji + label + 颜色) */
export const ACTION_META: Record<
  DiaryActionType,
  { emoji: string; label: string; color: string }
> = {
  adopt: { emoji: "🐾", label: "领养", color: "#4A5D3A" }, // forest
  feed: { emoji: "🍖", label: "喂食", color: "#A44A3F" }, // brick
  play: { emoji: "🎾", label: "玩耍", color: "#C9A14A" }, // amber
  rest: { emoji: "💤", label: "休息", color: "#6B5B8E" }, // dusty purple
};
