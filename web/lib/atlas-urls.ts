/**
 * web/lib/atlas-urls.ts · 纯函数 URL 构造(无 fs 依赖,client 也能用)
 *
 * 作用:把 fs 相关的 server-only 代码(pets.ts)与纯 URL 构造拆开
 * 这样 client component(AtlasViewer, SpecimenFrame)可以导入 URL 构造
 * 而不会带上 `import fs from "fs"` 拖死 bundler
 */

const ATLAS_BASE_URL = (
  process.env.NEXT_PUBLIC_ATLAS_BASE_URL || ""
).replace(/\/$/, "");

export type CoverSize = "thumb" | "medium" | "full";

/** 类别 → TCB 目录名 */
function atlasDirName(category: string): string {
  if (category === "dog") return "dog";
  if (category === "cat") return "cat";
  if (category === "small-mammal") return "small-mammal";
  return "bird-reptile"; // reptile / bird 都用这个
}

/** slot index → 文件名 */
const SLOT_KEYS = ["cover", "traits", "personality", "history", "care", "famous"];
function atlasFileName(slotIndex: number): string {
  const slot = String(slotIndex).padStart(2, "0");
  const key = SLOT_KEYS[slotIndex - 1] ?? "cover";
  return `${slot}-${key}.png`;
}

/** 通用图谱 URL 构造(纯函数,client/server 都能用) */
export function buildAtlasUrl(
  category: string,
  slug: string,
  slotIndex: number
): string {
  const path = `/${atlasDirName(category)}/${slug}/${atlasFileName(slotIndex)}`;
  return ATLAS_BASE_URL ? `${ATLAS_BASE_URL}${path}` : path;
}

/**
 * 封面图 URL 构造(带尺寸变体)
 *
 * 2026-07-27: 加入 thumb/medium 缩略图(150 张 × ~50KB,commit 进 git)
 * - thumb: 384px 宽(列表页 / PetCard 用,本地 01-cover-thumb.jpg)
 * - medium: 768px 宽(详情页 spec 用,本地 01-cover-medium.jpg)
 * - full: TCB CDN(原图,~1-5MB,首屏不要拉)
 *
 * 缩略图走本地是因为:(1) commit 进 git production 永远有兜底
 * (2) 首屏 LCP 优化,避免首屏去 TCB 拉 1-5MB 大图
 */
export function buildCoverUrl(
  category: string,
  slug: string,
  size: CoverSize = "full"
): string {
  const dir = atlasDirName(category);
  const basePath = `/${dir}/${slug}`;

  // thumb/medium 走本地 (commit 进 git,production 永远可用)
  if (size === "thumb") {
    return `${basePath}/01-cover-thumb.jpg`;
  }
  if (size === "medium") {
    return `${basePath}/01-cover-medium.jpg`;
  }

  // full 走 TCB (本地无,1-5MB 太大不进 git)
  if (ATLAS_BASE_URL) {
    return `${ATLAS_BASE_URL}${basePath}/01-cover.png`;
  }
  return `${basePath}/01-cover.png`;
}

/** TCB 模式判断(纯 env 判断) */
export function isTcbMode(): boolean {
  return Boolean(ATLAS_BASE_URL);
}
