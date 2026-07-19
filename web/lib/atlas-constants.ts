/**
 * 图谱常量(纯客户端可用,无 fs / 无 server-only 依赖)
 */

export const ATLAS_PAGE_COUNT = 6;

/** 文件名用的英文 key(对应 public/atlas/ 下的实际文件名) */
export const ATLAS_SLOT_KEYS: readonly string[] = [
  "cover",
  "traits",
  "personality",
  "history",
  "care",
  "famous",
];

/** UI 显示用的中文标签 */
export const ATLAS_SLOTS: readonly string[] = [
  "封面",
  "形态",
  "性格",
  "历史",
  "养护",
  "名场面",
];
