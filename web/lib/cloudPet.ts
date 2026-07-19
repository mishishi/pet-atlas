/**
 * web/lib/cloudPet.ts · 云宠物数据层(localStorage)
 *
 * M1 没有用户系统,所有数据存浏览器 localStorage。
 * 上线轻登录时,把 storage 升到 TCB 即可,核心数据结构不变。
 *
 * 数据模型:
 * - cloudPet      : 用户已领养的宠物(1 个)
 * - rerollState   : reroll 配额(1 免费 + 读图鉴解锁 N 个,累计上限 3)
 * - breedReads    : 读过的品种记录(用于计算"还差几篇解锁 reroll")
 *
 * Storage keys:
 * - pet-atlas:cloud-pet:v1
 * - pet-atlas:reroll:v1
 * - pet-atlas:breed-reads:v1
 *
 * v1 后缀:数据结构升级时改 v2,旧数据可读可写就保留,大改直接清。
 */

import type { BreedCategory } from "./breedFeatures";

export type Personality = "curious" | "social" | "independent";
export type ColorPreference = "classic" | "cream" | "blue";

export type CloudPet = {
  petId: string;            // uuid
  breedSlug: string;        // 品种 slug,对应 BREED_FEATURES
  breedZh: string;          // 品种中文名
  breedCategory: BreedCategory;
  petName: string;          // 用户起的名字 2-6 字
  personality: Personality;
  colorPreference: ColorPreference;
  variantIndex: 1 | 2 | 3;  // 哪个变体(池子里 3 个)
  tcbUrl: string;           // 该变体的 URL(本地或 TCB)
  createdAt: number;        // 领养时间戳
};

export type RerollState = {
  /** 累计已用 reroll 次数 */
  used: number;
  /** 累计已解锁的 reroll 次数(含免费 1 次) */
  unlocked: number;
  /** 上限:每次领养最多 3 张 */
  readonly max: 3;
};

export type BreedReadRecord = {
  /** slug -> 阅读次数(本会话窗口内) */
  [slug: string]: number;
};

const KEY_PET = "pet-atlas:cloud-pet:v1";
const KEY_REROLL = "pet-atlas:reroll:v1";
const KEY_READS = "pet-atlas:breed-reads:v1";

/** SSR 安全:localStorage 只在 client 存在 */
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
    console.warn(`[cloudPet] 写入失败: ${key}`, err);
  }
}

// ===== CloudPet 读写 =====

export function getAdoptedPet(): CloudPet | null {
  return readJSON<CloudPet | null>(KEY_PET, null);
}

export function saveAdoptedPet(pet: CloudPet): void {
  writeJSON(KEY_PET, pet);
  // 新领养 = 重置 reroll
  const fresh: RerollState = { used: 0, unlocked: 1, max: 3 };
  writeJSON(KEY_REROLL, fresh);
}

export function clearAdoptedPet(): void {
  if (!isClient()) return;
  localStorage.removeItem(KEY_PET);
  localStorage.removeItem(KEY_REROLL);
  localStorage.removeItem(KEY_READS);
}

// ===== Reroll 配额 =====

const DEFAULT_REROLL: RerollState = { used: 0, unlocked: 1, max: 3 };

export function getRerollState(): RerollState {
  return readJSON<RerollState>(KEY_REROLL, DEFAULT_REROLL);
}

export function setRerollState(state: RerollState): void {
  writeJSON(KEY_REROLL, state);
}

export function consumeReroll(): boolean {
  const state = getRerollState();
  if (state.used >= state.max) return false;
  if (state.used >= state.unlocked) return false;
  const next: RerollState = { ...state, used: state.used + 1 };
  setRerollState(next);
  return true;
}

/** 读 1 篇图鉴 = 解锁 1 次 reroll(累计上限 max) */
export function unlockRerollByReading(): RerollState {
  const state = getRerollState();
  if (state.unlocked >= state.max) return state;
  const next: RerollState = { ...state, unlocked: state.unlocked + 1 };
  setRerollState(next);
  return next;
}

export function canReroll(): boolean {
  const s = getRerollState();
  return s.used < s.unlocked && s.used < s.max;
}

export function remainingRerolls(): number {
  const s = getRerollState();
  return Math.max(0, Math.min(s.unlocked, s.max) - s.used);
}

// ===== 读图鉴记录 =====

const DEFAULT_READS: BreedReadRecord = {};

export function getBreedReads(): BreedReadRecord {
  return readJSON<BreedReadRecord>(KEY_READS, DEFAULT_READS);
}

export function recordBreedRead(slug: string): void {
  const reads = getBreedReads();
  reads[slug] = (reads[slug] || 0) + 1;
  writeJSON(KEY_READS, reads);
  // 顺手 +1 reroll
  unlockRerollByReading();
}

// ===== 工具:生成 UUID(M1 用 crypto.randomUUID,fallback 用 time-based) =====

export function generatePetId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `pet-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ===== 显示辅助 =====

export const PERSONALITY_LABEL: Record<Personality, string> = {
  curious: "好奇心满满",
  social: "温顺粘人",
  independent: "独立高冷",
};

export const COLOR_LABEL: Record<ColorPreference, string> = {
  classic: "经典色",
  cream: "奶油色",
  blue: "蓝灰色",
};
