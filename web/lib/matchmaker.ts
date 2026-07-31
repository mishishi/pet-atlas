/**
 * lib/matchmaker.ts · AI Pet Matchmaker 评分引擎 (2026-07-31)
 *
 * 5 道问卷 → 150 品种评分 → Top 3 推荐
 *
 * 评分算法 (rule-based, 0 强制外部依赖):
 * - Q1 居住空间 × pet.physical.sizeGroup (size match)
 * - Q2 活动量 × pet.personality.activity (energy match)
 * - Q3 可投入时间 × pet.personality.independence (time match)
 * - Q4 家庭结构 × pet.tags + category (family match)
 * - Q5 养宠经验 × pet.personality.obedience (experience match)
 *
 * 基准分 50, 每题 +5 到 +20, 不匹配 -5 到 -15
 * 最终 0-100, Top 3 跟完整 150 列表都返回
 *
 * 跟 LLM 区别:
 * - rule-based: 0 cost, 0 延迟, 完全 deterministic, 解释清楚
 * - LLM: 更"语义化", 但需要 API key, 成本, latency, 不 deterministic
 * 当前用 rule-based, 未来可加 LLM 增强
 */

import type { Pet } from "./types";

export type LivingSpace = "apartment" | "largeApartment" | "house" | "farm";
export type ActivityLevel = "sedentary" | "moderate" | "active";
export type TimeAvailable = "low" | "medium" | "high";
export type FamilyType = "single" | "couple" | "withKids" | "withElderly";
export type Experience = "firstTime" | "some" | "experienced";

export interface MatchAnswers {
  space: LivingSpace;
  activity: ActivityLevel;
  time: TimeAvailable;
  family: FamilyType;
  experience: Experience;
}

/** 5 道问卷的元数据 (UI 用) */
export const QUESTIONS: ReadonlyArray<{
  id: keyof MatchAnswers;
  title: string;
  subtitle: string;
  options: ReadonlyArray<{ value: string; label: string; sub: string; emoji: string }>;
}> = [
  {
    id: "space",
    title: "居住空间",
    subtitle: "Living Space",
    options: [
      { value: "apartment", label: "公寓", sub: "< 60 ㎡", emoji: "🏢" },
      { value: "largeApartment", label: "大公寓", sub: "60-120 ㎡", emoji: "🏬" },
      { value: "house", label: "独栋带院", sub: "> 120 ㎡", emoji: "🏡" },
      { value: "farm", label: "农场/乡村", sub: "开阔户外", emoji: "🌾" },
    ],
  },
  {
    id: "activity",
    title: "日常活动量",
    subtitle: "Activity Level",
    options: [
      { value: "sedentary", label: "久坐为主", sub: "在家办公多", emoji: "🛋️" },
      { value: "moderate", label: "适度活动", sub: "每日散步", emoji: "🚶" },
      { value: "active", label: "非常活跃", sub: "跑步/徒步", emoji: "🏃" },
    ],
  },
  {
    id: "time",
    title: "每天可投入时间",
    subtitle: "Time Available",
    options: [
      { value: "low", label: "1-2 小时", sub: "工作/上学忙", emoji: "⏰" },
      { value: "medium", label: "3-4 小时", sub: "标准下班", emoji: "🕐" },
      { value: "high", label: "5+ 小时", sub: "大部分在家", emoji: "🕰️" },
    ],
  },
  {
    id: "family",
    title: "家庭结构",
    subtitle: "Family",
    options: [
      { value: "single", label: "独居", sub: "1 个人", emoji: "🧍" },
      { value: "couple", label: "情侣/夫妻", sub: "2 人", emoji: "👫" },
      { value: "withKids", label: "有小孩", sub: "3-12 岁", emoji: "👨‍👩‍👧" },
      { value: "withElderly", label: "有老人", sub: "需要温顺", emoji: "👴" },
    ],
  },
  {
    id: "experience",
    title: "养宠经验",
    subtitle: "Experience",
    options: [
      { value: "firstTime", label: "第一次", sub: "新手养宠", emoji: "🌱" },
      { value: "some", label: "1-2 只", sub: "有点经验", emoji: "🌿" },
      { value: "experienced", label: "3+ 只", sub: "老手", emoji: "🌳" },
    ],
  },
];

export interface ScoredPet {
  pet: Pet;
  score: number;
  reasons: string[];   // 1-3 条为什么这个 pet 适合
}

/* =========================================================
 *  评分细则 (每一题 ±X 分)
 * ========================================================= */

/** Q1: 居住空间 × 体型 */
function scoreSpace(space: LivingSpace, pet: Pet): number {
  const size = pet.physical?.sizeGroup ?? "medium";
  const m: Record<LivingSpace, string[]> = {
    apartment: ["toy", "small"],          // 公寓只能 toy/small
    largeApartment: ["toy", "small", "medium"],
    house: ["toy", "small", "medium", "large"],  // house 都行, 大型 +0
    farm: ["medium", "large", "giant"],         // 农场才适合 giant
  };
  if (m[space].includes(size)) return 15;
  if (space === "apartment" && (size === "large" || size === "giant")) return -15;
  if (space === "farm" && (size === "toy")) return -10;
  return 0; // 中性
}

/** Q2: 活动量 × pet.activity (0-10) */
function scoreActivity(level: ActivityLevel, pet: Pet): number {
  const a = pet.personality?.activity ?? 5;
  if (level === "active" && a >= 7) return 18;
  if (level === "active" && a <= 4) return -10;  // 活跃主人配慵懒宠物不匹配
  if (level === "moderate" && a >= 4 && a <= 8) return 15;
  if (level === "sedentary" && a <= 5) return 18;
  if (level === "sedentary" && a >= 8) return -10;
  return 3;
}

/** Q3: 可投入时间 × pet.independence */
function scoreTime(time: TimeAvailable, pet: Pet): number {
  const ind = pet.personality?.independence ?? 5;
  if (time === "low" && ind >= 7) return 15;   // 没时间就养独立宠物
  if (time === "low" && ind <= 4) return -10;
  if (time === "high" && ind <= 5) return 12;  // 有时间就养需要陪伴的
  if (time === "high" && ind >= 8) return -5;
  return 5;
}

/** Q4: 家庭结构 × tags + category */
function scoreFamily(family: FamilyType, pet: Pet): number {
  const tags = pet.tags ?? [];
  const summary = pet.personality?.summary ?? "";
  const allText = (tags.join(" ") + " " + summary).toLowerCase();

  const isFamilyFriendly = tags.some((t) =>
    ["家庭友好", "温顺", "耐寒", "亲人", "友善", "易训练", "稳定"].includes(t)
  );
  const isAggressive = tags.some((t) =>
    ["独立", "倔强", "警觉", "挖洞", "好斗"].includes(t)
  );

  if (family === "withKids") {
    if (isFamilyFriendly) return 18;
    if (isAggressive) return -12;
    return -3;
  }
  if (family === "withElderly") {
    if (pet.category === "cat") return 12;  // 猫适合老人
    if (tags.includes("温顺") && !isAggressive) return 10;
    if (tags.includes("小型")) return 8;  // 小型好照料
    return -3;
  }
  if (family === "single") {
    if (tags.includes("粘人") || (pet.personality?.affection ?? 0) >= 7) return 10;
    return 4;
  }
  if (family === "couple") {
    if (isFamilyFriendly) return 6;
    return 3;
  }
  return 0;
}

/** Q5: 养宠经验 × obedience */
function scoreExperience(exp: Experience, pet: Pet): number {
  const obey = pet.personality?.obedience ?? 5;
  const tags = pet.tags ?? [];
  if (exp === "firstTime") {
    if (obey >= 6) return 15;
    if (tags.includes("易训练")) return 12;
    if (tags.includes("独立") || tags.includes("倔强")) return -10;
    return 0;
  }
  if (exp === "some") return 5;
  if (exp === "experienced") {
    if (tags.includes("独立") || tags.includes("警觉")) return 8;  // 老手能 hold 住独立品种
    return 5;
  }
  return 0;
}

/* =========================================================
 *  主入口
 * ========================================================= */

export function scoreAllPets(answers: MatchAnswers, pets: Pet[]): ScoredPet[] {
  const scored: ScoredPet[] = pets.map((pet) => {
    let score = 50;
    const reasons: string[] = [];
    const breakdown: Array<[string, number]> = [
      ["居住空间", scoreSpace(answers.space, pet)],
      ["活动量", scoreActivity(answers.activity, pet)],
      ["可投入时间", scoreTime(answers.time, pet)],
      ["家庭结构", scoreFamily(answers.family, pet)],
      ["养宠经验", scoreExperience(answers.experience, pet)],
    ];
    let positiveCount = 0;
    for (const [label, delta] of breakdown) {
      score += delta;
      if (delta >= 12) {
        positiveCount++;
        if (positiveCount <= 3) reasons.push(`${label}匹配 (${delta > 0 ? "+" : ""}${delta})`);
      }
    }
    // clamp 0-100
    score = Math.max(0, Math.min(100, score));

    // 兜底 reasons
    if (reasons.length === 0) {
      const size = pet.physical?.sizeGroup;
      const summary = pet.personality?.summary;
      if (summary) reasons.push(summary);
      if (size) reasons.push(`${size}型,适配你的环境`);
    }

    return { pet, score, reasons: reasons.slice(0, 3) };
  });

  // 排序 (分数降序, 字典序兜底)
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.pet.slug.localeCompare(b.pet.slug);
  });

  return scored;
}

/** 拿到 top N */
export function getTopMatches(answers: MatchAnswers, pets: Pet[], n = 3): ScoredPet[] {
  return scoreAllPets(answers, pets).slice(0, n);
}

/** UI 用的等级标签 */
export function scoreLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "极佳匹配", color: "var(--brick)" };
  if (score >= 70) return { label: "高度匹配", color: "var(--brown-600)" };
  if (score >= 55) return { label: "良好匹配", color: "var(--brown-500)" };
  if (score >= 40) return { label: "一般匹配", color: "var(--brown-400)" };
  return { label: "不太匹配", color: "var(--brown-300)" };
}
