/**
 * web/components/pets/PetsBrowser.tsx · 品种浏览器 (M3 polish · 2026-07-21)
 *
 * 客户端组件:接收 server 端预加载的 pets 数据,做实时搜索 + 分类筛选 + 0 结果友好提示。
 * 不引入 lib/pets.ts(那里面有 fs/path,只能在 server bundle 用)。
 *
 * 用法:
 *   <PetsBrowser pets={pets} />
 */

"use client";

import { useState, useMemo, useDeferredValue } from "react";
import { Container } from "@/components/ui/Container";
import { BreedCard } from "@/components/brand/BreedCard";
import { CategoryFilter } from "@/components/pets/CategoryFilter";
import type { Pet } from "@/lib/types";

const CATEGORY_LABELS: Array<{
  key: string;
  zh: string;
  en: string;
  desc: string;
}> = [
  { key: "dog", zh: "犬", en: "Canis", desc: "最古老的伙伴" },
  { key: "cat", zh: "猫", en: "Felis", desc: "独立的优雅" },
  { key: "small-mammal", zh: "小型哺乳", en: "Mammalia", desc: "口袋里的温顺" },
  { key: "bird", zh: "鸟", en: "Aves", desc: "天空的羽毛" },
  { key: "reptile", zh: "爬虫", en: "Reptilia", desc: "鳞甲的温度" },
];

export function PetsBrowser({ pets }: { pets: Pet[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query); // 大列表时降级,减少卡顿

  // 搜索过滤(name + alias + tags)
  const matches = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return new Set(pets.map((p) => p.slug));
    const set = new Set<string>();
    for (const p of pets) {
      const haystack = [
        p.name.zh,
        p.name.en,
        ...(p.name.alias?.zh || []),
        p.origin?.country,
        p.tags?.join(" ") || "",
      ]
        .join(" ")
        .toLowerCase();
      if (haystack.includes(q)) set.add(p.slug);
    }
    return set;
  }, [pets, deferredQuery]);

  const grouped = useMemo(
    () =>
      CATEGORY_LABELS.map((cat) => ({
        ...cat,
        pets: pets.filter((p) => p.category === cat.key),
      })),
    [pets]
  );

  const filterOptions = useMemo(
    () =>
      grouped
        .filter((g) => g.pets.length > 0)
        .map((g) => ({ key: g.key, zh: g.zh, count: g.pets.length })),
    [grouped]
  );

  const totalMatches = matches.size;
  const hasQuery = query.trim().length > 0;

  return (
    <>
      {/* Page title + 搜索框 */}
      <section className="pt-12 md:pt-20 pb-6 md:pb-8">
        <Container size="xl">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-brick mb-4 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-brick" />
            Index · 全部品种
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown-900 tracking-tight leading-[1.05] mb-4 max-w-[20ch]">
            {pets.length} 个标本
          </h1>
          <p className="text-lg text-brown-600 max-w-[60ch] mb-6">
            从拉布拉多到鬃狮蜥,按家族分类的完整图鉴。
          </p>

          {/* 搜索框 */}
          <div className="relative max-w-md">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-500 pointer-events-none">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索品种(如 拉布拉多 / Bengal / 蜜袋鼯 / 柯基)"
              className="w-full pl-11 pr-10 py-3 rounded-full border-2 border-brown-200 bg-oat-50/80 focus:border-warm-brown focus:outline-none text-brown-900 placeholder:text-brown-400 font-serif text-sm transition-colors"
              aria-label="搜索品种"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-brown-200 text-brown-700 flex items-center justify-center text-xs hover:bg-brown-300 transition-colors"
                aria-label="清除搜索"
              >
                ×
              </button>
            )}
          </div>

          {/* 搜索结果统计 */}
          {hasQuery && (
            <p className="mt-3 text-sm text-brown-600 animate-[fadeIn_0.2s_ease-out]">
              {totalMatches > 0 ? (
                <>
                  找到 <span className="font-mono font-bold text-warm-brown">{totalMatches}</span> 个品种
                  匹配 "<span className="text-brown-800">{query}</span>"
                </>
              ) : (
                <span className="text-brick">没找到匹配 "{query}" 的品种</span>
              )}
            </p>
          )}
        </Container>
      </section>

      {/* Sticky 分类筛选 */}
      <CategoryFilter categories={filterOptions} />

      {/* Category groups */}
      <section>
        <Container size="xl" className="space-y-20 md:space-y-28 pt-10 md:pt-12 pb-20 md:pb-28">
          {grouped.map((group, i) => {
            // 当前分类下匹配的品种
            const matchedInGroup = group.pets.filter((p) => matches.has(p.slug));
            // 分类里没有匹配 → 整组隐藏
            if (hasQuery && matchedInGroup.length === 0) return null;
            return (
              <div
                key={group.key}
                id={`cat-${group.key}`}
                className="scroll-mt-32"
              >
                <div className="flex items-end justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-brown-200">
                  <div>
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="font-mono text-2xl text-brown-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 tracking-tight">
                        {group.zh}
                      </h2>
                      <span className="font-mono text-sm italic text-brown-500">
                        {group.en}
                      </span>
                    </div>
                    <p className="text-sm text-brown-500 ml-12">{group.desc}</p>
                  </div>
                  <div className="font-mono text-xs text-brown-500">
                    {hasQuery
                      ? `${matchedInGroup.length} / ${group.pets.length} 个匹配`
                      : `${String(group.pets.length).padStart(2, "0")} 个品种`}
                  </div>
                </div>

                <BreedGroup
                  breeds={hasQuery ? matchedInGroup : group.pets}
                  matches={matches}
                  queryActive={hasQuery}
                />
              </div>
            );
          })}

          {/* 0 结果全局提示 */}
          {hasQuery && totalMatches === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-60">🔍</div>
              <p className="text-brown-700 mb-2">没找到 "{query}" 相关品种</p>
              <p className="text-sm text-brown-500 mb-6">
                试试搜索品种名、英文名、别名(如 Yorkie / 仙女猫 / 荷兰猪),或
                原产地(英国 / 中国 / 美国)
              </p>
              <button
                onClick={() => setQuery("")}
                className="px-4 py-2 rounded-full border-2 border-warm-brown text-warm-brown text-sm hover:bg-warm-brown/5 transition-colors"
              >
                清除搜索
              </button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

function BreedGroup({
  breeds,
  matches,
  queryActive,
}: {
  breeds: Pet[];
  matches: Set<string>;
  queryActive: boolean;
}) {
  if (breeds.length === 0) return null;
  const featured = breeds.slice(0, 4);
  const rest = breeds.slice(4);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {featured.map((pet) => (
          <BreedCard key={pet.slug} pet={pet} size="md" />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {rest.map((pet) => (
            <BreedCard key={pet.slug} pet={pet} size="sm" />
          ))}
        </div>
      )}
    </>
  );
}
