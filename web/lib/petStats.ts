/**
 * web/lib/petStats.ts · M2 宠物状态数据层(localStorage)
 *
 * 设计目标:
 * - 3 维状态:hunger(饱腹)/ energy(能量)/ happiness(心情)
 * - 随时间自然衰减(读时计算 elapsed 衰减,写时锁存)
 * - 3 个动作:feed / play / rest,各加冷却时间
 * - 派生 mood(emoji + 文案)给 UI 用
 *
 * 升级路径:跟 cloudPet.ts 一致,localStorage 主,未来 TCB 同步只换 storage 层。
 *
 * Storage key:
 * - pet-atlas:pet-stats:v1
 */

import { getAdoptedPet } from "./cloudPet";

export type PetStats = {
  /** 饱腹度,0-100,100 = 饱 */
  hunger: number;
  /** 能量,0-100,100 = 满电 */
  energy: number;
  /** 心情,0-100,100 = 嗨 */
  happiness: number;
  /** 上次喂食时间戳(ms),0 = 从未 */
  lastFedAt: number;
  /** 上次玩耍时间戳(ms) */
  lastPlayedAt: number;
  /** 上次休息时间戳(ms) */
  lastRestedAt: number;
  /** 上次 save 时间戳(用于计算衰减基线) */
  lastUpdatedAt: number;
};

export type ActionType = "feed" | "play" | "rest";

export type Mood =
  | "happy"   // 开心
  | "calm"    // 平静
  | "hungry"  // 饿了
  | "sleepy"  // 困了
  | "bored"   // 无聊
  | "sad";    // 难过

const KEY_STATS = "pet-atlas:pet-stats:v1";

/** 每小时自然衰减 */
const DECAY_PER_HOUR = {
  hunger: 10,     // 10 小时从饱到饿
  energy: 8,      // 12.5 小时
  happiness: 5,   // 20 小时,作为下限约束
} as const;

/** 单次动作配置 */
const ACTION_CONFIG: Record<
  ActionType,
  {
    /** 主加成的维度 */
    primary: "hunger" | "energy" | "happiness";
    /** 主加成数值 */
    primaryDelta: number;
    /** 副作用(可多个) */
    secondary: Partial<Record<"hunger" | "energy" | "happiness", number>>;
    /** 冷却时间(ms) */
    cooldownMs: number;
    /** 按钮文案 */
    label: string;
    /** 按钮 emoji */
    emoji: string;
  }
> = {
  feed: {
    primary: "hunger",
    primaryDelta: 35,
    secondary: { happiness: 5 },
    cooldownMs: 60_000,
    label: "喂食",
    emoji: "🍖",
  },
  play: {
    primary: "happiness",
    primaryDelta: 25,
    secondary: { energy: -15 },
    cooldownMs: 60_000,
    label: "玩耍",
    emoji: "🎾",
  },
  rest: {
    primary: "energy",
    primaryDelta: 40,
    secondary: { hunger: -5 },
    cooldownMs: 60_000,
    label: "休息",
    emoji: "💤",
  },
};

const DEFAULT_STATS: Omit<PetStats, "lastUpdatedAt"> = {
  hunger: 70,
  energy: 70,
  happiness: 60,
  lastFedAt: 0,
  lastPlayedAt: 0,
  lastRestedAt: 0,
};

const STAT_MIN = 0;
const STAT_MAX = 100;

function clamp(n: number): number {
  if (n < STAT_MIN) return STAT_MIN;
  if (n > STAT_MAX) return STAT_MAX;
  return Math.round(n);
}

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readJSON<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[petStats] 写入失败: ${key}`, err);
  }
}

// ===== 核心:读 = 算衰减 + 锁存 =====

/**
 * 读当前状态(自动应用衰减),若宠物未领养返回 null
 * 副作用:把衰减后的状态写回 localStorage,作为下次衰减的基线
 */
export function getCurrentStats(): PetStats | null {
  if (!getAdoptedPet()) return null;

  const saved = readJSON<PetStats | null>(KEY_STATS, null);
  const now = Date.now();

  // 首次读取 → 初始化
  if (!saved || saved.lastUpdatedAt === 0) {
    const fresh: PetStats = { ...DEFAULT_STATS, lastUpdatedAt: now };
    writeJSON(KEY_STATS, fresh);
    return fresh;
  }

  // 计算衰减
  const elapsedHours = Math.max(0, (now - saved.lastUpdatedAt) / 3_600_000);
  const decayed: PetStats = {
    hunger: clamp(saved.hunger - DECAY_PER_HOUR.hunger * elapsedHours),
    energy: clamp(saved.energy - DECAY_PER_HOUR.energy * elapsedHours),
    happiness: clamp(saved.happiness - DECAY_PER_HOUR.happiness * elapsedHours),
    lastFedAt: saved.lastFedAt,
    lastPlayedAt: saved.lastPlayedAt,
    lastRestedAt: saved.lastRestedAt,
    lastUpdatedAt: now,
  };

  // 锁存(防止下次读取再衰减)
  writeJSON(KEY_STATS, decayed);
  return decayed;
}

// ===== 动作 =====

export type ActionResult =
  | { ok: true; stats: PetStats; feedback: string }
  | { ok: false; reason: string; stats: PetStats | null; cooldownMs: number };

const FEEDBACK_POOL: Record<ActionType, string[]> = {
  feed: [
    "吃饱了,打了个小嗝~",
    "嗯嗯好吃!谢谢主人",
    "碗底都舔干净了",
    "吃饱了想睡觉",
  ],
  play: [
    "跑得飞起!摇尾巴了",
    "在屋子里转圈圈",
    "玩得超开心,眼睛亮了",
    "叼着球跑给你看",
  ],
  rest: [
    "呼呼大睡,Zzz...",
    "伸个懒腰,精神满满",
    "闭眼休息中,别打扰",
    "打了个小呼噜",
  ],
};

function pickFeedback(action: ActionType): string {
  const arr = FEEDBACK_POOL[action];
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 冷却剩余毫秒(0 = 不在冷却) */
export function getCooldownRemaining(stats: PetStats | null, action: ActionType): number {
  if (!stats) return 0;
  const last = {
    feed: stats.lastFedAt,
    play: stats.lastPlayedAt,
    rest: stats.lastRestedAt,
  }[action];
  if (last === 0) return 0;
  const elapsed = Date.now() - last;
  return Math.max(0, ACTION_CONFIG[action].cooldownMs - elapsed);
}

export function performAction(action: ActionType): ActionResult {
  const current = getCurrentStats();
  if (!current) {
    return {
      ok: false,
      reason: "请先领养一只宠物",
      stats: null,
      cooldownMs: 0,
    };
  }

  const cfg = ACTION_CONFIG[action];
  const remaining = getCooldownRemaining(current, action);
  if (remaining > 0) {
    return {
      ok: false,
      reason: `冷却中,还剩 ${Math.ceil(remaining / 1000)} 秒`,
      stats: current,
      cooldownMs: remaining,
    };
  }

  const now = Date.now();
  const newStats: PetStats = {
    ...current,
    [cfg.primary]: clamp(current[cfg.primary] + cfg.primaryDelta),
    lastUpdatedAt: now,
  };

  // 应用副作用
  for (const [k, v] of Object.entries(cfg.secondary)) {
    const key = k as "hunger" | "energy" | "happiness";
    newStats[key] = clamp(newStats[key] + (v as number));
  }

  // 标记动作时间
  if (action === "feed") newStats.lastFedAt = now;
  if (action === "play") newStats.lastPlayedAt = now;
  if (action === "rest") newStats.lastRestedAt = now;

  writeJSON(KEY_STATS, newStats);

  return {
    ok: true,
    stats: newStats,
    feedback: pickFeedback(action),
  };
}

// ===== 派生:心情 =====

export function deriveMood(stats: PetStats): Mood {
  const { hunger, energy, happiness } = stats;
  // 优先级:需求 > 情绪
  if (energy < 20) return "sleepy";
  if (hunger < 25) return "hungry";
  if (happiness >= 70) return "happy";
  if (happiness >= 45) return "calm";
  if (happiness >= 25) return "bored";
  return "sad";
}

export const MOOD_META: Record<
  Mood,
  { emoji: string; label: string; description: string; color: string }
> = {
  happy: {
    emoji: "✨",
    label: "很开心",
    description: "在阳光下打滚,摇尾巴",
    color: "#4A5D3A", // forest
  },
  calm: {
    emoji: "🍃",
    label: "平静",
    description: "安静地陪在你身边",
    color: "#8B6F47", // brown
  },
  hungry: {
    emoji: "🍖",
    label: "饿了",
    description: "肚子在咕咕叫",
    color: "#A44A3F", // brick
  },
  sleepy: {
    emoji: "💤",
    label: "困了",
    description: "想找个地方睡觉",
    color: "#6B5B8E", // dusty purple
  },
  bored: {
    emoji: "💭",
    label: "有点无聊",
    description: "需要你陪它玩",
    color: "#C9A14A", // amber
  },
  sad: {
    emoji: "💧",
    label: "有点难过",
    description: "需要你的爱",
    color: "#A45C8E", // rose
  },
};

// ===== 给 UI 用的 action 配置 =====

export function getActionConfig(action: ActionType) {
  return ACTION_CONFIG[action];
}

export const ALL_ACTIONS: ActionType[] = ["feed", "play", "rest"];

// ===== Reset (M2.5 调试/重置用) =====

export function clearPetStats(): void {
  if (!isClient()) return;
  localStorage.removeItem(KEY_STATS);
}
