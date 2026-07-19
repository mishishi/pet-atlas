/**
 * HeroPoster · 主页 hero
 *
 * 风格:标本卡海报 / Vintage Museum Specimen Card
 * - 大标题 + 叶片装饰
 * - 红色印章 "No. 051 / 050"(顶右)
 * - 罗马数字 I / II / III
 * - 3 个大画框(中前左后右错位)+ VINTAGE PAPER 飘带
 * - 侧边植物图鉴(桉树/干花/薰衣草/多肉/谷穗)
 * - 折痕纸背景(中线竖向阴影 + 角部水渍)
 * - 底部副标题 + 开始浏览 CTA
 */

import Link from "next/link";
import Image from "next/image";
import { getAllPets, getCoverUrl } from "@/lib/pets";
import { BotanicalBorder, LeafDivider } from "./BotanicalBorder";

/* 单个画框组件 */
function SpecimenFrame({
  slug,
  nameZh,
  nameEn,
  rotate,
  scale,
  zIndex,
  ribbon,
}: {
  slug: string;
  nameZh: string;
  nameEn: string;
  rotate: number;
  scale: number;
  zIndex: number;
  ribbon: string;
}) {
  const url = getCoverUrl(slug) || "";
  return (
    <div
      className="relative shrink-0 transition-transform duration-700 hover:scale-[1.02]"
      style={{
        transform: `rotate(${rotate}deg) scale(${scale})`,
        zIndex,
        width: "clamp(180px, 24vw, 320px)",
      }}
    >
      {/* 外木框 */}
      <div
        className="relative p-2 md:p-3"
        style={{
          background: "linear-gradient(135deg, #B8956A 0%, #8B6F47 50%, #6E5635 100%)",
          boxShadow:
            "0 18px 40px -12px rgba(74, 51, 28, 0.55), 0 6px 14px -6px rgba(74, 51, 28, 0.4), inset 0 0 0 1px rgba(255, 240, 200, 0.15)",
        }}
      >
        {/* 内木线 */}
        <div
          className="absolute inset-1 md:inset-2 pointer-events-none"
          style={{
            border: "1px solid rgba(255, 240, 200, 0.25)",
          }}
        />

        {/* 内卡纸 */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "9 / 16",
            background:
              "linear-gradient(180deg, #F5E9D0 0%, #EFE0C0 100%)",
            boxShadow: "inset 0 0 30px rgba(139, 111, 71, 0.18)",
          }}
        >
          {/* 内卡纸纸张质感 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, rgba(139,111,71,0.12) 0%, transparent 40%), radial-gradient(circle at 70% 80%, rgba(139,111,71,0.1) 0%, transparent 35%)",
            }}
          />

          {/* 实际图 */}
          {url ? (
            <Image
              src={url}
              alt={nameZh}
              fill
              sizes="(max-width: 768px) 30vw, 24vw"
              className="object-cover"
              priority={zIndex >= 20}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-brown-400 text-sm">
              {nameZh}
            </div>
          )}

          {/* 卡片底部名称 */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-end justify-between"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(245, 233, 208, 0.6) 60%, rgba(245, 233, 208, 0.95) 100%)",
            }}
          >
            <div>
              <div className="font-serif text-sm md:text-base font-semibold text-brown-900">
                {nameZh}
              </div>
              <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-wider text-brown-600 italic">
                {nameEn}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VINTAGE PAPER 飘带 — 浮在画框底部 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-3 md:-bottom-4 pointer-events-none"
        style={{ zIndex: zIndex + 5 }}
      >
        <RibbonBanner text={ribbon} />
      </div>
    </div>
  );
}

/* 飘带(两端凹口) */
function RibbonBanner({ text }: { text: string }) {
  return (
    <svg
      viewBox="0 0 220 32"
      className="w-32 md:w-44 lg:w-52 h-auto"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbon-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5E9D0" />
          <stop offset="100%" stopColor="#E8D9B8" />
        </linearGradient>
      </defs>
      <path
        d="M 14 4 L 206 4 L 198 16 L 206 28 L 14 28 L 22 16 Z"
        fill="url(#ribbon-fill)"
        stroke="#8B6F47"
        strokeWidth="0.8"
      />
      <text
        x="110"
        y="20"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="9"
        fontWeight="600"
        letterSpacing="0.15em"
        fill="#6E5635"
        style={{ textTransform: "uppercase" }}
      >
        {text}
      </text>
    </svg>
  );
}

/* 红色印章 "No. 051 / 050" */
function SpecimenStamp() {
  return (
    <div className="relative inline-block">
      <div
        className="relative px-5 py-2 md:px-7 md:py-3"
        style={{
          background: "rgba(164, 74, 63, 0.92)",
          clipPath:
            "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))",
          boxShadow:
            "0 2px 8px rgba(164, 74, 63, 0.3), inset 0 0 0 1px rgba(255, 220, 200, 0.3)",
        }}
      >
        <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.18em] text-[#F5E9D0] flex items-center gap-2">
          <span>No.</span>
          <span className="text-base md:text-xl font-bold">051</span>
          <span className="opacity-60">/</span>
          <span className="text-base md:text-xl font-bold">050</span>
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

/* 主组件 */
export function HeroPoster() {
  const featured = [
    { slug: "golden-retriever", nameZh: "金毛寻回犬", nameEn: "Golden Retriever", ribbon: "Vintage Paper · 2026" },
    { slug: "persian-silver-chinchilla", nameZh: "银渐层波斯", nameEn: "Silver Chinchilla Persian", ribbon: "Vintage Paper · 2026" },
    { slug: "bearded-dragon", nameZh: "鬃狮蜥", nameEn: "Bearded Dragon", ribbon: "Vintage Paper · 2026" },
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
              ribbon: "Vintage Paper · 2026",
            }))
        );

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "min(100vh, 900px)" }}
    >
      {/* ============ 折痕纸背景 ============ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
        }}
      />
      {/* 中心竖向折痕 */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-24 md:w-40 lg:w-56 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139, 111, 71, 0.06) 40%, rgba(139, 111, 71, 0.14) 50%, rgba(139, 111, 71, 0.06) 60%, transparent 100%)",
        }}
      />
      {/* 副竖向折痕 (左 1/3) */}
      <div
        className="absolute top-0 bottom-0 left-1/3 w-12 md:w-20 pointer-events-none opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139, 111, 71, 0.05) 50%, transparent 100%)",
        }}
      />
      {/* 副竖向折痕 (右 1/3) */}
      <div
        className="absolute top-0 bottom-0 right-1/3 w-12 md:w-20 pointer-events-none opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139, 111, 71, 0.05) 50%, transparent 100%)",
        }}
      />
      {/* 横向折痕 (1/3) */}
      <div
        className="absolute left-0 right-0 top-1/3 h-6 md:h-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(139, 111, 71, 0.08) 50%, transparent 100%)",
        }}
      />
      {/* 横向折痕 (2/3) */}
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
        className="absolute top-1/2 right-1/4 w-48 h-48 pointer-events-none opacity-60"
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
        className="absolute bottom-1/4 right-1/3 w-24 h-12 pointer-events-none opacity-40"
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

      {/* ============ 植物图鉴 ============ */}
      <BotanicalBorder />

      {/* ============ 罗马数字 ============ */}
      <div className="absolute left-3 md:left-6 top-20 md:top-24 font-serif text-base md:text-lg text-brown-600/60 select-none z-20">
        I
      </div>
      <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 font-serif text-base md:text-lg text-brown-600/60 select-none z-20">
        II
      </div>
      <div className="absolute left-3 md:left-6 bottom-6 md:bottom-10 font-serif text-base md:text-lg text-brown-600/60 select-none z-20">
        III
      </div>

      {/* ============ 主内容 ============ */}
      <div className="relative z-20 px-6 md:px-12 lg:px-20 py-10 md:py-14 lg:py-16">
        {/* 顶部:标题 + 印章 */}
        <div className="flex items-start justify-between gap-6 mb-6 md:mb-10">
          <div className="flex-1 min-w-0 pl-2 md:pl-4">
            <h1
              className="font-serif font-bold text-brown-900 leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(3rem, 9vw, 7rem)",
                textShadow: "0 1px 0 rgba(245, 233, 208, 0.8)",
              }}
            >
              宠物大百科
            </h1>
            <LeafDivider className="w-72 md:w-96 lg:w-[28rem] h-auto mt-2 md:mt-3" />
          </div>

          <div className="pt-2 md:pt-4 shrink-0">
            <SpecimenStamp />
          </div>
        </div>

        {/* 中部:3 个大画框(中前左右后) */}
        <div className="relative h-[420px] md:h-[480px] lg:h-[540px] flex items-center justify-center gap-2 md:gap-3 lg:gap-4 mb-8 md:mb-10">
          {final3.map((pet, i) => {
            const config = [
              { rotate: -3, scale: 0.92, zIndex: 10 },
              { rotate: 0, scale: 1.05, zIndex: 30 },
              { rotate: 2.5, scale: 0.92, zIndex: 10 },
            ][i];
            return (
              <div
                key={pet.slug}
                className="absolute"
                style={{
                  left: `${15 + i * 27}%`,
                  top: i === 1 ? "0" : "8%",
                  transform: "translateX(-50%)",
                }}
              >
                <SpecimenFrame
                  slug={pet.slug}
                  nameZh={pet.nameZh}
                  nameEn={pet.nameEn}
                  rotate={config.rotate}
                  scale={config.scale}
                  zIndex={config.zIndex}
                  ribbon={pet.ribbon}
                />
              </div>
            );
          })}
        </div>

        {/* 底部:副标题 + CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pl-2 md:pl-4 pr-2 md:pr-4">
          <div>
            <p className="font-serif text-base md:text-lg text-brown-800 leading-snug">
              50 种动物的{" "}
              <span className="italic">vintage</span>{" "}
              标本卡图谱
            </p>
            <p className="font-mono text-xs md:text-sm text-brown-600 mt-1 tracking-wider">
              犬 · 猫 · 小型哺乳 · 鸟 · 爬虫
            </p>
          </div>

          <Link href="/pets" className="group">
            <div
              className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 font-serif text-base md:text-lg text-brown-900 border-2 border-brown-700 transition-all duration-300 hover:bg-brown-700 hover:text-oat-100"
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
