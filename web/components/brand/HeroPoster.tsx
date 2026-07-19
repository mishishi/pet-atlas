/**
 * HeroPoster · 主页 hero
 *
 * 风格:标本卡海报 / Vintage Museum Specimen Card
 * - 大标题 + 叶片装饰
 * - 红色印章 "No. 051 / 050"(顶右)
 * - 罗马数字 I / II / III(桌机)
 * - 3 个大画框(中前左后右错位)+ VINTAGE PAPER 飘带(桌机)
 * - 移动端(<md):只显示 1 个主画框,植物图鉴 / 罗马数字隐藏
 * - 侧边植物图鉴(桉树/干花/薰衣草/多肉/谷穗)
 * - 折痕纸背景
 * - 底部副标题 + 开始浏览 CTA
 */

import Link from "next/link";
import { getAllPets, getCoverUrl } from "@/lib/pets";
import { SpecimenFrame } from "./SpecimenFrame";
import { BotanicalBorder, LeafDivider } from "./BotanicalBorder";

/* 主组件 */
export function HeroPoster() {
  const featured = [
    {
      slug: "golden-retriever",
      nameZh: "金毛寻回犬",
      nameEn: "Golden Retriever",
      size: "thumb" as const,
    },
    {
      slug: "persian-silver-chinchilla",
      nameZh: "银渐层波斯",
      nameEn: "Silver Chinchilla Persian",
      size: "medium" as const,
    },
    {
      slug: "bearded-dragon",
      nameZh: "鬃狮蜥",
      nameEn: "Bearded Dragon",
      size: "thumb" as const,
    },
  ];

  const allPets = getAllPets();
  const slugsAvailable = new Set(allPets.map((p) => p.slug));
  const safe = featured.filter((f) => slugsAvailable.has(f.slug));
  const final3 =
    safe.length === 3
      ? safe
      : safe.concat(
          allPets
            .filter((p) => !safe.find((s) => s.slug === p.slug))
            .slice(0, 3 - safe.length)
            .map((p) => ({
              slug: p.slug,
              nameZh: p.name.zh,
              nameEn: p.name.en,
              size: "medium" as const,
            }))
        );

  return (
    <section className="relative w-full overflow-hidden">
      {/* ============ 折痕纸背景 ============ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
        }}
      />
      {/* 中心竖向折痕(桌机) */}
      <div
        className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-24 md:w-40 lg:w-56 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139, 111, 71, 0.06) 40%, rgba(139, 111, 71, 0.14) 50%, rgba(139, 111, 71, 0.06) 60%, transparent 100%)",
        }}
      />
      {/* 副竖向折痕 */}
      <div
        className="hidden md:block absolute top-0 bottom-0 left-1/3 w-12 md:w-20 pointer-events-none opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139, 111, 71, 0.05) 50%, transparent 100%)",
        }}
      />
      <div
        className="hidden md:block absolute top-0 bottom-0 right-1/3 w-12 md:w-20 pointer-events-none opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139, 111, 71, 0.05) 50%, transparent 100%)",
        }}
      />
      {/* 横向折痕 */}
      <div
        className="absolute left-0 right-0 top-1/3 h-6 md:h-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(139, 111, 71, 0.08) 50%, transparent 100%)",
        }}
      />
      <div
        className="absolute left-0 right-0 top-2/3 h-6 md:h-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(139, 111, 71, 0.07) 50%, transparent 100%)",
        }}
      />

      {/* 角部水渍 */}
      <div
        className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(139, 111, 71, 0.18) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(139, 111, 71, 0.15) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-48 h-48 pointer-events-none opacity-60 hidden md:block"
        style={{
          background:
            "radial-gradient(circle, rgba(164, 74, 63, 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/4 left-1/4 w-16 h-16 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 111, 71, 0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-24 h-12 pointer-events-none opacity-40 hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse, rgba(139, 111, 71, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* 纸张噪点 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/></svg>\")",
        }}
      />

      {/* ============ 植物图鉴(只桌机) ============ */}
      <div className="hidden md:block">
        <BotanicalBorder />
      </div>

      {/* ============ 罗马数字(只桌机) ============ */}
      <div className="hidden md:block absolute left-6 top-24 font-serif text-lg text-brown-600/60 select-none z-20">
        I
      </div>
      <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 font-serif text-lg text-brown-600/60 select-none z-20">
        II
      </div>
      <div className="hidden md:block absolute left-6 bottom-10 font-serif text-lg text-brown-600/60 select-none z-20">
        III
      </div>

      {/* ============ 主内容 ============ */}
      <div className="relative z-20 px-4 sm:px-6 md:px-12 lg:px-20 py-8 md:py-14 lg:py-16">
        {/* 顶部:标题 + 印章 */}
        <div className="flex items-start justify-between gap-3 sm:gap-6 mb-6 md:mb-10">
          <div className="flex-1 min-w-0 pl-1 md:pl-4">
            <h1
              className="font-serif font-bold text-brown-900 leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(2.5rem, 11vw, 7rem)",
                textShadow: "0 1px 0 rgba(245, 233, 208, 0.8)",
              }}
            >
              宠物大百科
            </h1>
            <LeafDivider className="w-48 sm:w-72 md:w-96 lg:w-[28rem] h-auto mt-2 md:mt-3" />
          </div>

          <div className="pt-1 md:pt-4 shrink-0">
            <SpecimenStamp />
          </div>
        </div>

        {/* ============ 中部:画框区域 ============ */}
        {/* 桌机:3 大画框错位 */}
        <div className="hidden md:block relative h-[480px] lg:h-[540px] mb-8 lg:mb-10">
          {final3.map((pet, i) => {
            const config = [
              { rotate: -3, scale: 0.92, zIndex: 10, left: "15%", top: "8%" },
              { rotate: 0, scale: 1.05, zIndex: 30, left: "42%", top: "0" },
              { rotate: 2.5, scale: 0.92, zIndex: 10, left: "69%", top: "8%" },
            ][i];
            return (
              <div
                key={pet.slug}
                className="absolute"
                style={{
                  left: config.left,
                  top: config.top,
                  transform: "translateX(-50%)",
                }}
              >
                <SpecimenFrame
                  url={getCoverUrl(pet.slug, pet.size) || ""}
                  nameZh={pet.nameZh}
                  nameEn={pet.nameEn}
                  rotate={config.rotate}
                  scale={config.scale}
                  zIndex={config.zIndex}
                  priority={i === 1}
                  showRibbon
                />
              </div>
            );
          })}
        </div>

        {/* 移动端:只显示中间 1 个大画框 + 左右 peek */}
        <div className="md:hidden relative h-[400px] sm:h-[440px] flex items-center justify-center mb-6">
          {/* 左 peek(只有中画框高度的 80%,轻微 rotate,露一半) */}
          <div
            className="absolute left-[6%] top-[10%] w-[26%] z-10 opacity-70"
            style={{ transform: "rotate(-4deg)" }}
          >
            <SpecimenFrame
              url={getCoverUrl(final3[0].slug, "thumb") || ""}
              fallbackUrl={getCoverUrl(final3[0].slug, "full") || undefined}
              nameZh={final3[0].nameZh}
              nameEn={final3[0].nameEn}
              width="100%"
              showRibbon={false}
              shadowLevel="sm"
            />
          </div>
          {/* 右 peek */}
          <div
            className="absolute right-[6%] top-[10%] w-[26%] z-10 opacity-70"
            style={{ transform: "rotate(3deg)" }}
          >
            <SpecimenFrame
              url={getCoverUrl(final3[2].slug, "thumb") || ""}
              fallbackUrl={getCoverUrl(final3[2].slug, "full") || undefined}
              nameZh={final3[2].nameZh}
              nameEn={final3[2].nameEn}
              width="100%"
              showRibbon={false}
              shadowLevel="sm"
            />
          </div>
          {/* 主画框 */}
          <div className="relative z-20 w-[55%]">
            <SpecimenFrame
              url={getCoverUrl(final3[1].slug, "medium") || ""}
              fallbackUrl={getCoverUrl(final3[1].slug, "full") || undefined}
              nameZh={final3[1].nameZh}
              nameEn={final3[1].nameEn}
              width="100%"
              priority
              showRibbon
              shadowLevel="lg"
            />
          </div>
        </div>

        {/* 底部:副标题 + CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6 pl-1 md:pl-4 pr-1 md:pr-4">
          <div>
            <p className="font-serif text-base md:text-lg text-brown-800 leading-snug">
              50 种动物的{" "}
              <span className="italic">vintage</span>{" "}
              标本卡图谱
            </p>
            <p className="font-mono text-[10px] sm:text-xs md:text-sm text-brown-600 mt-1 tracking-wider">
              犬 · 猫 · 小型哺乳 · 鸟 · 爬虫
            </p>
          </div>

          <Link href="/pets" className="group shrink-0">
            <div
              className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 font-serif text-sm sm:text-base md:text-lg text-brown-900 border-2 border-brown-700 transition-all duration-300 hover:bg-brown-700 hover:text-oat-100"
              style={{
                background: "rgba(245, 233, 208, 0.4)",
                boxShadow: "0 4px 12px -4px rgba(110, 86, 53, 0.25)",
              }}
            >
              <span>开始浏览</span>
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 红色印章 "No. 051 / 050" */
function SpecimenStamp() {
  return (
    <div className="relative inline-block stamp-ink stamp-pulse cursor-pointer">
      <div
        className="relative px-3 py-1.5 sm:px-5 sm:py-2 md:px-7 md:py-3"
        style={{
          background: "rgba(164, 74, 63, 0.92)",
          clipPath:
            "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))",
          boxShadow:
            "0 2px 8px rgba(164, 74, 63, 0.3), inset 0 0 0 1px rgba(255, 220, 200, 0.3)",
        }}
      >
        <div className="font-mono text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.18em] text-[#F5E9D0] flex items-center gap-1.5 sm:gap-2">
          <span>No.</span>
          <span className="text-sm sm:text-base md:text-xl font-bold">051</span>
          <span className="opacity-60">/</span>
          <span className="text-sm sm:text-base md:text-xl font-bold">050</span>
        </div>
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.3) 31%, transparent 32%, transparent 50%, rgba(255,255,255,0.2) 51%, transparent 52%)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
    </div>
  );
}
