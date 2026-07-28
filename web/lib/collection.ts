/**
 * web/lib/collection.ts · v0.8 标本编号 + 收藏数据工具
 *
 * 给所有已发布品种 1-150 固定编号(按字典序),让用户感觉自己是 150 件收藏的第 N 件。
 * 这个编号是 stable 的,content/pets/ 顺序不变就不变。
 */

import { getAllPets } from "./pets";

const _sortedSlugs = (() => {
  const all = getAllPets();
  return all
    .filter((p) => p.status === "published")
    .map((p) => p.slug)
    .sort();
})();

/** 获取 slug 在 150 件收藏中的 1-based 编号 */
export function getSpecimenNumber(slug: string): number {
  const idx = _sortedSlugs.indexOf(slug);
  return idx >= 0 ? idx + 1 : 0;
}

/** 收藏总件数 (默认 150,但实际 published 数为准) */
export const TOTAL_SPECIMENS = _sortedSlugs.length;

/** 获取所有已发布 slug 列表 (server-side, 给 client 用来渲染 passport 网格) */
export function getAllSpecimenSlugs(): string[] {
  return [..._sortedSlugs];
}
