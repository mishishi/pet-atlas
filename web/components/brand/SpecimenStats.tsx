/**
 * web/components/brand/SpecimenStats.tsx · 主页 "标本数据展柜"
 *
 * 4 格数据展示,放在 HeroPoster 和 FeaturedBreeds 之间
 * 视觉: vintage 标本卡风 + 罗马数字 plate + 拉丁短句
 *
 * 4 个数据:
 *  - 100 品种 (5 大品类)
 *  - 600 图谱 (6 张/品种)
 *  - 300 立绘 (3 张/品种)
 *  - 5 品类 (犬/猫/小哺乳/鸟/爬虫)
 */

import { Container } from "../ui/Container";

const STATS = [
  {
    n: "100",
    label: "个品种",
    en: "Specimina",
    desc: "5 大品类,200+ 年图鉴传统",
    roman: "I",
  },
  {
    n: "600",
    label: "张图谱",
    en: "Tabulae",
    desc: "6 张/品种,vintage 标本卡",
    roman: "II",
  },
  {
    n: "300",
    label: "张立绘",
    en: "Icones",
    desc: "3 张/品种,治愈水彩风",
    roman: "III",
  },
  {
    n: "5",
    label: "大品类",
    en: "Classes",
    desc: "犬 · 猫 · 小哺乳 · 鸟 · 爬虫",
    roman: "IV",
  },
];

export function SpecimenStats() {
  return (
    <section className="relative py-16 md:py-20 bg-oat-100/60 border-y-2 border-warm-brown/20">
      {/* 装饰上横线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-warm-brown/15" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-warm-brown/15" />

      <Container size="xl">
        {/* 顶部装饰条 */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="inline-block h-px flex-1 max-w-24 bg-warm-brown/30" />
          <span className="font-display italic text-sm text-warm-brown/70 tracking-wide">
            Museum of Breeds
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-warm-brown/60">
            ·
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-warm-brown/70">
            Collection in Numbers
          </span>
          <span className="inline-block h-px flex-1 max-w-24 bg-warm-brown/30" />
        </div>

        {/* 4 格数据展示 */}
        <ol className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s) => (
            <li
              key={s.en}
              className="relative text-center px-4 py-6 md:py-8 border-2 border-warm-brown/30 rounded-xl bg-oat-50/80 shadow-[var(--shadow-paper)] transition-all duration-500 hover:-translate-y-1 hover:border-warm-brown/60 hover:shadow-[var(--shadow-paper-lg)]"
            >
              {/* 罗马数字角标 */}
              <span className="absolute top-2 left-3 font-display italic text-xs text-warm-brown/40 tracking-wider">
                {s.roman}
              </span>

              {/* 大数字 */}
              <div className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-brown-900 leading-none tracking-tight">
                {s.n}
              </div>

              {/* 中文标签 */}
              <div className="mt-2 font-serif text-lg md:text-xl text-brown-700">
                {s.label}
              </div>

              {/* 拉丁名 */}
              <div className="mt-1 font-display italic text-sm md:text-base text-warm-brown/80 tracking-wide">
                {s.en}
              </div>

              {/* 描述 */}
              <div className="mt-2 text-xs text-brown-500 leading-relaxed max-w-[20ch] mx-auto">
                {s.desc}
              </div>
            </li>
          ))}
        </ol>

        {/* 底部拉丁装饰 */}
        <p className="mt-8 text-center font-display italic text-sm md:text-base text-warm-brown/70 tracking-wide">
          — 犬 · 猫 · 小型哺乳 · 鸟 · 爬虫 —
        </p>
      </Container>
    </section>
  );
}
