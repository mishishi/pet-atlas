/**
 * web/lib/search-pets.ts · 搜索用的精简 pet 数据 (server-only)
 *
 * 抽出来单独的文件,避免 Header (会被 client component import) 拉整个 pets.ts 的 fs 依赖
 *
 * 这里是只读、纯数据 prep,无副作用。
 */

import { getAllPets } from "./pets";

export interface SearchPet {
  slug: string;
  nameZh: string;
  nameEn: string;
  aliasZh?: string[];
  category: "dog" | "cat" | "small-mammal" | "bird" | "reptile";
}

/** 准备搜索用的精简 pet 列表(150 个) */
export function getSearchPets(): SearchPet[] {
  return getAllPets()
    .filter((p) => p.status === "published")
    .map((p) => ({
      slug: p.slug,
      nameZh: p.name.zh,
      nameEn: p.name.en,
      aliasZh: p.name.alias?.zh,
      category: p.category,
    }));
}
