/**
 * CategoryFilter · /pets 页面顶部分类筛选 + 跳锚
 *
 * - 5 个分类 tab,带数量徽章
 * - sticky 在 page title 之下,滚动时始终可见
 * - 移动端横滑,桌面端居中
 */

import Link from "next/link";

export interface CategoryOption {
  key: string;
  zh: string;
  count: number;
}

export function CategoryFilter({ categories }: { categories: CategoryOption[] }) {
  return (
    <nav
      aria-label="分类筛选"
      className="sticky top-16 z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-3 backdrop-blur-md"
      style={{
        background: "rgba(245, 233, 208, 0.85)",
        borderBottom: "1px solid rgba(139, 111, 71, 0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500 shrink-0 hidden sm:inline mr-1">
          分类
        </span>
        {categories.map((cat) => (
          <a
            key={cat.key}
            href={`#cat-${cat.key}`}
            className="group shrink-0 inline-flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-full border border-brown-200 bg-oat-50 hover:bg-brown-700 hover:text-oat-100 hover:border-brown-700 transition-all min-h-[40px]"
          >
            <span className="font-serif text-sm">{cat.zh}</span>
            <span className="font-mono text-[10px] text-brown-500 group-hover:text-oat-200 transition-colors">
              {String(cat.count).padStart(2, "0")}
            </span>
          </a>
        ))}
        <Link
          href="/about"
          className="shrink-0 ml-auto hidden md:inline-flex items-center gap-1 text-xs font-mono text-brown-500 hover:text-brown-900"
        >
          关于本站 →
        </Link>
      </div>
    </nav>
  );
}
