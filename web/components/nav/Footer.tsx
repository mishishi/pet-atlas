/**
 * Footer · vintage 标本卡升级版 (v1.2)
 *
 * 设计:
 *  - 顶部装饰条: 双横线 + 拉丁 "Tabula Indicis · Index"
 *  - 4 列布局: 品牌 (印章) / 浏览 (4 链接) / 数据 (5 品类统计) / 社区 (GitHub + 资源)
 *  - 底部装饰: 拉丁 "Ad Annum MMXXVI" + CC 协议
 *
 * 跟 Header 印章 / 列表页 Tabula I-V / Atlas Tabula I-VI 形成完整 vintage 体系
 */
import Link from "next/link";
import { Container } from "../ui/Container";

const CATEGORIES = [
  { key: "dog", zh: "犬", en: "Canis", desc: "30 个品种" },
  { key: "cat", zh: "猫", en: "Felis", desc: "24 个品种" },
  { key: "small-mammal", zh: "小型哺乳", en: "Mammalia", desc: "18 个品种" },
  { key: "bird", zh: "鸟", en: "Aves", desc: "17 个品种" },
  { key: "reptile", zh: "爬虫", en: "Reptilia", desc: "11 个品种" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-warm-brown/30 bg-oat-200">
      {/* 顶部 vintage 装饰条 */}
      <div className="border-b border-warm-brown/20 bg-oat-300/40">
        <Container size="xl" className="py-3 flex items-center justify-center gap-3">
          <span className="inline-block h-px flex-1 max-w-32 bg-warm-brown/30" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-warm-brown/70">
            Tabula Indicis
          </span>
          <span className="font-display italic text-[10px] text-warm-brown/50">·</span>
          <span className="font-display italic text-[10px] text-warm-brown/70 tracking-wide">
            Index of Breeds
          </span>
          <span className="inline-block h-px flex-1 max-w-32 bg-warm-brown/30" />
        </Container>
      </div>

      <Container size="xl" className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* 第 1 列: 品牌 (印章 + 副标) */}
          <div className="md:col-span-4">
            <Link
              href="/"
              className="group inline-flex items-start gap-3 transition-opacity hover:opacity-80"
            >
              {/* 圆形品牌印章 */}
              <span
                aria-hidden
                className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border-2 border-warm-brown text-warm-brown transition-transform group-hover:rotate-[-6deg]"
                style={{
                  background: "rgba(245, 233, 208, 0.4)",
                  boxShadow: "inset 0 0 0 1px rgba(139, 111, 71, 0.2)",
                }}
              >
                <span className="font-display italic text-[11px] leading-none text-center">
                  <span className="block">P.A.</span>
                  <span className="block text-[8px] tracking-widest mt-px">1876</span>
                </span>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-xl font-bold text-brown-900 tracking-tight">
                  宠物大百科
                </span>
                <span className="font-display italic text-[10px] uppercase tracking-[0.25em] text-brown-500 mt-0.5">
                  Pet Atlas · Museum of Breeds
                </span>
              </div>
            </Link>
            <p className="mt-4 font-serif text-sm text-brown-600 leading-relaxed max-w-xs">
              为爱宠收藏一整套图鉴 ——
              vintage 标本卡美学 + 治愈手绘水彩 + 信息图。
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-warm-brown/40 bg-oat-100/60">
              <span className="font-display italic text-[9px] uppercase tracking-[0.3em] text-warm-brown/70">
                N°
              </span>
              <span className="font-mono text-xs font-medium text-brick tracking-widest">
                100
              </span>
              <span className="inline-block w-px h-3 bg-warm-brown/30" />
              <span className="font-display italic text-[9px] uppercase tracking-[0.25em] text-warm-brown/70">
                Specimina
              </span>
            </div>
          </div>

          {/* 第 2 列: 浏览 */}
          <div className="md:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-4 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-brick" />
              浏览
            </div>
            <nav className="space-y-2.5 text-sm">
              <Link
                href="/pets"
                className="block font-serif text-brown-700 hover:text-brown-900 transition-colors"
              >
                全部品种
              </Link>
              <Link
                href="/adopt"
                className="block font-serif text-brown-700 hover:text-brown-900 transition-colors"
              >
                领养云宠物
              </Link>
              <Link
                href="/profile"
                className="block font-serif text-brown-700 hover:text-brown-900 transition-colors"
              >
                我的宠物
              </Link>
              <Link
                href="/about"
                className="block font-serif text-brown-700 hover:text-brown-900 transition-colors"
              >
                关于项目
              </Link>
            </nav>
          </div>

          {/* 第 3 列: 数据 (5 品类) */}
          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-4 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-brick" />
              分类
            </div>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.key}>
                  <Link
                    href={`/pets#cat-${c.key}`}
                    className="group flex items-baseline gap-2"
                  >
                    <span className="font-serif text-brown-700 group-hover:text-brown-900 transition-colors">
                      {c.zh}
                    </span>
                    <span className="font-display italic text-[10px] text-brown-500 tracking-wide">
                      {c.en}
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-brown-500">
                      {c.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 第 4 列: 社区 / 资源 */}
          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-4 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-brick" />
              社区
            </div>
            <nav className="space-y-2.5 text-sm">
              <a
                href="https://github.com/mishishi/pet-atlas"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-serif text-brown-700 hover:text-brown-900 transition-colors"
              >
                GitHub ↗
              </a>
              <a
                href="https://github.com/mishishi/pet-atlas/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-serif text-brown-700 hover:text-brown-900 transition-colors"
              >
                README ↗
              </a>
              <a
                href="https://github.com/mishishi/pet-atlas/blob/main/ARCHITECTURE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-serif text-brown-700 hover:text-brown-900 transition-colors"
              >
                ARCHITECTURE ↗
              </a>
              <a
                href="https://github.com/mishishi/pet-atlas/blob/main/SCREENSHOTS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-serif text-brown-700 hover:text-brown-900 transition-colors"
              >
                SCREENSHOTS ↗
              </a>
            </nav>
          </div>
        </div>
      </Container>

      {/* 底部 vintage 装饰条 */}
      <div className="border-t border-warm-brown/20 bg-oat-300/40">
        <Container size="xl" className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] text-brown-600">
            <span className="font-display italic tracking-wide">© Anno MMXXVI</span>
            <span className="inline-block w-1 h-1 rounded-full bg-warm-brown/40" />
            <span>宠物大百科 · 由 Mavis & Jason 共同制作</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-brown-600">
            <span className="font-mono uppercase tracking-wider">CC BY-NC-SA 4.0</span>
            <span className="inline-block w-1 h-1 rounded-full bg-warm-brown/40" />
            <span className="font-display italic tracking-wide">Museum of Breeds</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
