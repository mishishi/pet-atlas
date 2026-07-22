/**
 * web/lib/petProgression.ts · M2.5 粘性升级
 *
 * 设计目标:
 * - Pet 等级 + 经验值(xp)
 * - 每日签到 + 连续天数 streak
 * - 等级 title(新手/朋友/伙伴/家人/灵魂伴侣)
 * - 解锁 badges(7/30/100 日连签)
 *
 * 数据来源(不重写现有 petStats):
 * - 喂食/玩耍/休息 action 触发时各自加 xp(由 PetStatusCard 在 performAction 后调)
 * - 用户手动点"签到"按钮加 xp + 维护 streak
 *
 * Storage key:
 * - pet-atlas:pet-progression:v1
 */

const KEY_PROG = "pet-atlas:pet-progression:v1";

export type LevelTitle = "新手" | "朋友" | "伙伴" | "家人" | "灵魂伴侣";

export type Progression = {
  /** 累计 xp */
  xp: number;
  /** 当前等级(从 1 开始) */
  level: number;
  /** 累计签到次数 */
  totalCheckIns: number;
  /** 连续签到天数 */
  streakDays: number;
  /** 上次签到日期 YYYY-MM-DD (本地时区) */
  lastCheckInDate: string;
  /** 解锁的 badge key 列表 */
  unlockedBadges: string[];
};

/** 升级所需累计 xp(总 xp,不是增量) */
export function xpForLevel(level: number): number {
  // 等级 N → 累计 N(N-1)/2 × 50 xp 到达
  // 简化:每级 +50,+100,+150,... 累计
  // Lv 1: 0, Lv 2: 50, Lv 3: 150, Lv 4: 300, Lv 5: 500 ...
  return Math.round((level * (level - 1) * 50) / 2);
}

/** 当前等级内:已获得 xp / 升到下一级需要 xp */
export function levelProgress(xp: number): { level: number; intoLevel: number; nextLevelTotal: number } {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  const intoLevel = xp - xpForLevel(level);
  const nextLevelTotal = xpForLevel(level + 1) - xpForLevel(level);
  return { level, intoLevel, nextLevelTotal };
}

/** 等级 title 映射 */
export function levelTitle(level: number): LevelTitle {
  if (level <= 2) return "新手";
  if (level <= 4) return "朋友";
  if (level <= 9) return "伙伴";
  if (level <= 19) return "家人";
  return "灵魂伴侣";
}

/** level title 对应 emoji + 描述 */
export const LEVEL_META: Record<LevelTitle, { emoji: string; desc: string; color: string }> = {
  新手: { emoji: "🌱", desc: "刚认识你的小可爱", color: "#8B6F47" },
  朋友: { emoji: "🤝", desc: "开始熟悉你的味道", color: "#4A5D3A" },
  伙伴: { emoji: "🌟", desc: "形影不离的好伙伴", color: "#C9A14A" },
  家人: { emoji: "🏠", desc: "已经是家里的一员", color: "#A44A3F" },
  灵魂伴侣: { emoji: "💫", desc: "默契满满的灵魂伙伴", color: "#5B3A8B" },
};

// ===== Action XP 表 =====
export const ACTION_XP: Record<"feed" | "play" | "rest", number> = {
  feed: 5,
  play: 8,
  rest: 3,
};
export const DAILY_CHECKIN_XP = 20;

/** Badge 列表(连续签到 + 总签到 + 等级) */
export interface Badge {
  key: string;
  name: string;
  desc: string;
  emoji: string;
  /** 解锁条件:streakDays / totalCheckIns / level */
  check: (p: Progression) => boolean;
}

export const BADGES: Badge[] = [
  { key: "streak-3", name: "三日连签", desc: "连续签到 3 天", emoji: "🔥", check: (p) => p.streakDays >= 3 },
  { key: "streak-7", name: "一周相伴", desc: "连续签到 7 天", emoji: "🌟", check: (p) => p.streakDays >= 7 },
  { key: "streak-30", name: "一月之约", desc: "连续签到 30 天", emoji: "💎", check: (p) => p.streakDays >= 30 },
  { key: "total-50", name: "半个百", desc: "累计签到 50 次", emoji: "🎖", check: (p) => p.totalCheckIns >= 50 },
  { key: "level-5", name: "伙伴", desc: "等级 5 以上", emoji: "🌟", check: (p) => p.level >= 5 },
  { key: "level-10", name: "家人", desc: "等级 10 以上", emoji: "🏠", check: (p) => p.level >= 10 },
];

// ===== Date utils =====
function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  // YYYY-MM-DD 格式,直接 parse + diff
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

// ===== Storage =====
function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readRaw(): Progression {
  const defaults: Progression = {
    xp: 0,
    level: 1,
    totalCheckIns: 0,
    streakDays: 0,
    lastCheckInDate: "",
    unlockedBadges: [],
  };
  if (!isClient()) return defaults;
  try {
    const raw = localStorage.getItem(KEY_PROG);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) } as Progression;
  } catch {
    return defaults;
  }
}

function writeRaw(p: Progression): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEY_PROG, JSON.stringify(p));
  } catch (err) {
    console.warn("[petProgression] 写入失败", err);
  }
}

// ===== Public API =====

export function getProgression(): Progression {
  return readRaw();
}

/** 客户端初始化:检查 streak 连续性(如果昨天没签就重置) */
export function refreshProgression(): Progression {
  const p = readRaw();
  if (!p.lastCheckInDate) return p;
  const diff = daysBetween(p.lastCheckInDate, todayStr());
  // diff=0 今天已签 / diff=1 昨天签了 streak 连续 / diff>1 断了
  if (diff > 1) {
    p.streakDays = 0;
    writeRaw(p);
  }
  return p;
}

/** 增加 xp(用于 action 触发) + 解锁新 badge + 自动升级 */
export function addXp(amount: number): Progression {
  const p = readRaw();
  p.xp += amount;
  // 升级检测
  const before = p.level;
  const { level } = levelProgress(p.xp);
  p.level = level;
  // 解锁 badge
  const newlyUnlocked: string[] = [];
  for (const b of BADGES) {
    if (!p.unlockedBadges.includes(b.key) && b.check(p)) {
      p.unlockedBadges.push(b.key);
      newlyUnlocked.push(b.key);
    }
  }
  writeRaw(p);
  // 同步到 TCB(只 push 当前 progression,fire-and-forget)
  if (isClient()) {
    import("./tcbSync")
      .then((m) => m.pushProgressionToTcb?.(p))
      .catch(() => {});
  }
  return { ...p, _leveledUp: level > before, _newBadges: newlyUnlocked } as Progression & {
    _leveledUp: boolean;
    _newBadges: string[];
  };
}

/** 每日签到:已签返回 false,未签返回 true + 奖励 */
export function checkIn(): { ok: boolean; prog: Progression; gained: number; reason?: string } {
  const p = readRaw();
  const today = todayStr();
  if (p.lastCheckInDate === today) {
    return { ok: false, prog: p, gained: 0, reason: "今天已经签到啦" };
  }
  // 计算 streak
  if (p.lastCheckInDate) {
    const diff = daysBetween(p.lastCheckInDate, today);
    if (diff === 1) {
      p.streakDays += 1;
    } else if (diff > 1) {
      p.streakDays = 1; // 断签后重新开始
    }
  } else {
    p.streakDays = 1;
  }
  p.lastCheckInDate = today;
  p.totalCheckIns += 1;
  // XP 奖励:基础 20 + 连签 bonus(5 × streak,封顶 50)
  const bonus = Math.min(p.streakDays * 5, 50);
  const gained = DAILY_CHECKIN_XP + bonus;
  p.xp += gained;
  // 升级
  const { level } = levelProgress(p.xp);
  p.level = level;
  // badge
  for (const b of BADGES) {
    if (!p.unlockedBadges.includes(b.key) && b.check(p)) {
      p.unlockedBadges.push(b.key);
    }
  }
  writeRaw(p);
  if (isClient()) {
    import("./tcbSync")
      .then((m) => m.pushProgressionToTcb?.(p))
      .catch(() => {});
  }
  return { ok: true, prog: p, gained };
}

/** 今日是否已签 */
export function checkedInToday(): boolean {
  const p = readRaw();
  return p.lastCheckInDate === todayStr();
}
