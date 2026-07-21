/**
 * web/app/pets/[slug]/page.tsx · 品种详情页
 *
 * 重设计 (2026-07-20):
 * - 大标本卡封面(同 HeroPoster 的木框 SpecimenFrame)
 * - 折痕纸背景 + 侧边植物图鉴(简化版)
 * - 标本卡 N° 印章(右上)
 * - 罗马数字 I / II / III
 * - 性格评分用罗马数字 I-X
 * - 6 张图谱缩略图带 mini 木框
 * - 历史时间线(竖向)
 * - LeafDivider 区段分隔
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ATLAS_SLOTS,
  getBreedAtlas,
  getCoverUrl,
  getPetBySlug,
  isVintagePaperBreed,
} from "@/lib/pets";
import { SpecimenFrame } from "@/components/brand/SpecimenFrame";
import { BotanicalBorder, LeafDivider } from "@/components/brand/BotanicalBorder";
import { ScrollProgress } from "@/components/brand/ScrollProgress";
import { FavoriteButton } from "@/components/brand/FavoriteButton";
import { BreedReadTracker } from "@/components/cloud-pet/BreedReadTracker";

/** 为所有已发布品种生成静态页(构建期一次跑完) */
export async function generateStaticParams() {
  const { getAllPets } = await import("@/lib/pets");
  return getAllPets().map((p) => ({ slug: p.slug }));
}

/** Per-breed OG meta — 分享时显示该品种的封面 + 名字 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pet = getPetBySlug(slug);
  if (!pet) return {};
  const cover = getCoverUrl(slug, "medium") || getCoverUrl(slug, "full");
  const title = `${pet.name.zh} · ${pet.name.en}`;
  const description = `查看 ${pet.name.zh} 的 6 页 vintage 标本卡图谱 —— 形态、性格、历史、养护。${pet.origin?.country ? `原产 ${pet.origin.country}。` : ""}`;
  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      images: cover
        ? [
            {
              url: cover,
              width: 1024,
              height: 1820,
              alt: `${pet.name.zh} vintage 标本卡`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pet = getPetBySlug(slug);
  if (!pet) notFound();

  const atlas = getBreedAtlas(slug);
  const coverUrl = atlas?.gallery[0] ?? null;
  const personality = pet.personality;
  const physical = pet.physical;
  const showLegacyBanner = Boolean(atlas) && !isVintagePaperBreed(slug);

  return (
    <>
      {/* 2026-07-20: 读图鉴解锁 1 次 reroll(无 UI,纯 side effect) */}
      <BreedReadTracker slug={slug} />
      <div
        className="relative w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
        }}
      >
      {/* 纸张噪点 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/></svg>\")",
        }}
      />

      {/* 角部水渍 */}
      <div
        className="absolute top-0 left-0 w-72 h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(139, 111, 71, 0.14) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(139, 111, 71, 0.12) 0%, transparent 60%)",
        }}
      />

      {/* 植物图鉴(轻量版,只放左上和右下) */}
      <div className="absolute -left-4 top-24 w-28 md:w-40 lg:w-48 pointer-events-none z-10 hidden md:block">
        <BotanicalDecoration variant="left" />
      </div>
      <div className="absolute -right-4 bottom-24 w-28 md:w-40 lg:w-48 pointer-events-none z-10 hidden md:block">
        <BotanicalDecoration variant="right" />
      </div>

      {/* 罗马数字 */}
      <div className="absolute left-3 md:left-6 top-1/2 font-serif text-base md:text-lg text-brown-600/60 select-none z-20 hidden md:block">
        II
      </div>
      <div className="absolute right-3 md:right-6 bottom-32 font-serif text-base md:text-lg text-brown-600/60 select-none z-20 hidden md:block">
        III
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 py-8 md:py-12">
        {/* ============ Top Nav ============ */}
        <div className="mb-8 md:mb-12 flex items-center justify-between">
          <Link
            href="/pets"
            className="group inline-flex items-center gap-2 text-sm text-brown-700 hover:text-brown-900 transition-colors"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            <span>全部品种</span>
          </Link>
          <div className="flex items-center gap-3">
            {/* M3 polish: 收藏按钮 */}
            <FavoriteButton slug={pet.slug} />
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brown-600 hidden sm:block">
              {categoryLabel(pet.category)} · No. {petNum(slug)}
            </div>
          </div>
        </div>

        {/* ============ Legacy banner ============ */}
        {showLegacyBanner && (
          <div className="mb-6 md:mb-10 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 shadow-sm">
            <div className="flex items-start gap-2">
              <span aria-hidden className="text-base">🎨</span>
              <div className="flex-1">
                <p className="font-semibold">
                  本品种图谱为早期风格,正在用 vintage paper 统一重做中
                </p>
                <p className="mt-1 text-xs text-amber-800/80">
                  重做完成后会自动替换为带暖棕画框 + 治愈水彩的统一风格。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============ Hero Section: 大画框 + 文字 ============ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start mb-12 md:mb-20">
          {/* 左:大画框 */}
          <div className="md:col-span-5 lg:col-span-5 flex justify-center md:justify-end">
            <div className="w-[260px] sm:w-[300px] md:w-full max-w-[340px]">
              <SpecimenFrame
                url={getCoverUrl(pet.slug, "medium") || ""}
                fallbackUrl={getCoverUrl(pet.slug, "full") || undefined}
                nameZh={pet.name.zh}
                nameEn={pet.name.en}
                width="100%"
                priority
                showRibbon
              />
            </div>
          </div>

          {/* 右:文字区 */}
          <div className="md:col-span-7 lg:col-span-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-3 md:mb-4 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-brick" />
              标本卡 · Specimen
            </div>

            <h1
              className="font-serif font-bold text-brown-900 leading-[1] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              {pet.name.zh}
            </h1>
            <p className="mt-2 md:mt-3 font-serif italic text-brown-600 text-lg md:text-xl">
              {pet.name.en}
            </p>
            {pet.name.alias?.zh && pet.name.alias.zh.length > 0 && (
              <p className="mt-2 md:mt-3 text-sm text-brown-700">
                别名 · {pet.name.alias.zh.join(" · ")}
              </p>
            )}

            <div className="my-6 md:my-8 max-w-md">
              <LeafDivider className="w-full h-auto" />
            </div>

            {/* 性格 summary(若有) */}
            {personality?.summary && (
              <p className="font-serif text-xl md:text-2xl text-brown-800 italic leading-snug mb-6 md:mb-8">
                "{personality.summary}"
              </p>
            )}

            {/* Stats grid */}
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {physical?.heightCm && (
                <Stat label="身高" value={physical.heightCm} unit="cm" />
              )}
              {physical?.weightKg && (
                <Stat label="体重" value={physical.weightKg} unit="kg" />
              )}
              {physical?.lifespanYears && (
                <Stat
                  label="寿命"
                  value={physical.lifespanYears}
                  unit="年"
                />
              )}
              {pet.origin?.country && (
                <Stat
                  label="原产"
                  value={pet.origin.country}
                  sub={pet.origin.region}
                />
              )}
            </dl>

            {physical?.coat && (
              <p className="mt-5 md:mt-6 text-sm text-brown-700 leading-relaxed">
                <span className="font-mono text-[10px] uppercase tracking-widest text-brown-500 mr-2">
                  被毛
                </span>
                {physical.coat}
              </p>
            )}
          </div>
        </div>

        {/* ============ In-page TOC (visible) ============ */}
        <nav
          aria-label="本页目录"
          className="mb-10 md:mb-16 flex flex-wrap items-center gap-x-1 gap-y-2 px-4 md:px-6 py-3 md:py-4 rounded-xl"
          style={{
            background: "rgba(245, 233, 208, 0.5)",
            border: "1px solid rgba(139, 111, 71, 0.15)",
            boxShadow: "var(--shadow-paper)",
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500 mr-3 hidden sm:inline">
            目录
          </span>
          {personality && (
            <a
              href="#personality"
              className="px-3 py-1.5 font-serif text-sm text-brown-700 hover:text-brown-900 hover:bg-oat-200 rounded transition-colors"
            >
              性格
            </a>
          )}
          {atlas && (
            <a
              href="#atlas"
              className="px-3 py-1.5 font-serif text-sm text-brown-700 hover:text-brown-900 hover:bg-oat-200 rounded transition-colors"
            >
              图谱
            </a>
          )}
          {pet.history?.timeline && pet.history.timeline.length > 0 && (
            <a
              href="#history"
              className="px-3 py-1.5 font-serif text-sm text-brown-700 hover:text-brown-900 hover:bg-oat-200 rounded transition-colors"
            >
              历史
            </a>
          )}
          {pet.famous && pet.famous.length > 0 && (
            <a
              href="#famous"
              className="px-3 py-1.5 font-serif text-sm text-brown-700 hover:text-brown-900 hover:bg-oat-200 rounded transition-colors"
            >
              名场面
            </a>
          )}
        </nav>

        {/* ============ M3 polish: 滚动进度条 + Sticky TOC 高亮 ============ */}
        <ScrollProgress
          sections={[
            ...(personality ? [{ id: "personality", label: "性格", en: "Personality" }] : []),
            ...(atlas ? [{ id: "atlas", label: "图谱", en: "Plates" }] : []),
            ...(pet.history?.timeline && pet.history.timeline.length > 0
              ? [{ id: "history", label: "历史", en: "History" }]
              : []),
            ...(pet.famous && pet.famous.length > 0
              ? [{ id: "famous", label: "名场面", en: "Famous" }]
              : []),
          ]}
        />

        {/* ============ Personality Section ============ */}
        {personality && (
          <section id="personality" className="mb-12 md:mb-20 scroll-mt-20">
            <SectionHeading
              eyebrow="No. 02"
              title="性格"
              en="Personality"
            />

            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "rgba(245, 233, 208, 0.5)",
                boxShadow: "var(--shadow-paper-md)",
                border: "1px solid rgba(139, 111, 71, 0.15)",
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                <ScoreBar
                  label="亲人度"
                  v={personality.affection}
                  en="Affection"
                />
                <ScoreBar
                  label="活跃度"
                  v={personality.activity}
                  en="Activity"
                />
                <ScoreBar
                  label="服从度"
                  v={personality.obedience}
                  en="Obedience"
                />
                <ScoreBar
                  label="独立性"
                  v={personality.independence}
                  en="Independence"
                />
                <ScoreBar
                  label="吠叫度"
                  v={personality.vocalization}
                  en="Vocalization"
                />
                <ScoreBar
                  label="智商"
                  v={personality.intelligence}
                  en="Intelligence"
                />
              </div>

              {personality.tags && personality.tags.length > 0 && (
                <>
                  <div
                    className="my-5 md:my-6 mx-auto max-w-md"
                    style={{ height: 1, background: "rgba(139, 111, 71, 0.15)" }}
                  />
                  <ul className="flex flex-wrap gap-2 justify-center">
                    {personality.tags.map((t) => (
                      <li
                        key={t}
                        className="font-serif text-sm px-3 py-1 rounded-full"
                        style={{
                          background: "rgba(139, 111, 71, 0.08)",
                          color: "var(--brown-700)",
                          border: "1px solid rgba(139, 111, 71, 0.2)",
                        }}
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
        )}

        {/* ============ 6 张图谱缩略图 ============ */}
        {atlas && (
          <section id="atlas" className="mb-12 md:mb-20 scroll-mt-20">
            <SectionHeading
              eyebrow="No. 03"
              title="图谱"
              en="The Six Plates"
              rightSlot={
                <Link
                  href={`/pets/${pet.slug}/atlas?page=1`}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-600 hover:text-brown-900"
                >
                  全屏查看 →
                </Link>
              }
            />

            <ol className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {atlas.gallery.map((url, i) => {
                const page = i + 1;
                const label = ATLAS_SLOTS[i] ?? `图 ${page}`;
                return (
                  <li key={url}>
                    <Link
                      href={`/pets/${pet.slug}/atlas?page=${page}`}
                      className="group block"
                    >
                      <div
                        className="relative p-1.5 transition-transform group-hover:scale-[1.03] group-hover:z-10"
                        style={{
                          background:
                            "linear-gradient(135deg, #B8956A 0%, #8B6F47 50%, #6E5635 100%)",
                          boxShadow: "var(--shadow-paper)",
                        }}
                      >
                        <div className="relative aspect-[9/16] overflow-hidden bg-oat-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`${label} · 第 ${page} 页`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-1.5 left-1.5 rounded-full bg-ink/80 text-oat text-[10px] w-5 h-5 flex items-center justify-center font-mono">
                            {page}
                          </div>
                        </div>
                      </div>
                      <div className="mt-1.5 text-center">
                        <div className="font-serif text-xs text-brown-800">
                          {label}
                        </div>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-brown-500 italic">
                          {["Cover", "Traits", "Personality", "History", "Care", "Famous"][i]}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* ============ History Timeline ============ */}
        {pet.history?.timeline && pet.history.timeline.length > 0 && (
          <section id="history" className="mb-12 md:mb-20 scroll-mt-20">
            <SectionHeading eyebrow="No. 04" title="历史" en="History" />

            <ol className="relative max-w-2xl mx-auto pl-8 md:pl-0">
              {/* 中线 */}
              <div
                className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px"
                style={{ background: "rgba(139, 111, 71, 0.2)" }}
                aria-hidden="true"
              />
              {pet.history.timeline.map((node, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <li
                    key={node.year + i}
                    className={`relative mb-6 md:mb-8 md:flex ${
                      isLeft ? "md:justify-start" : "md:justify-end"
                    }`}
                  >
                    {/* 圆点 */}
                    <div
                      className="absolute -left-5 md:left-1/2 md:-translate-x-1/2 top-1.5 w-3 h-3 rounded-full"
                      style={{
                        background: "var(--brown-600)",
                        boxShadow: "0 0 0 3px rgba(245, 233, 208, 1)",
                      }}
                      aria-hidden="true"
                    />
                    <div
                      className={`md:w-[calc(50%-2rem)] ${
                        isLeft ? "md:pr-8 md:text-right" : "md:pl-8"
                      }`}
                    >
                      <div className="font-mono text-sm font-bold text-brick">
                        {node.year}
                      </div>
                      <p className="mt-1 font-serif text-sm md:text-base text-brown-800 leading-relaxed">
                        {node.event}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* ============ Famous ============ */}
        {pet.famous && pet.famous.length > 0 && (
          <section id="famous" className="mb-12 md:mb-20 scroll-mt-20">
            <SectionHeading eyebrow="No. 05" title="名场面" en="Famous For" />
            <ul className="max-w-2xl mx-auto space-y-3">
              {pet.famous.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-serif text-brown-800"
                >
                  <span
                    className="shrink-0 inline-block w-6 h-6 mt-0.5 rounded-full text-center text-xs font-mono font-bold leading-6"
                    style={{
                      background: "var(--brick)",
                      color: "#F5E9D0",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ============ CTA ============ */}
        {atlas ? (
          <div className="flex justify-center my-12 md:my-16">
            <Link
              href={`/pets/${pet.slug}/atlas?page=1`}
              className="group inline-flex items-center gap-3 px-8 py-4 font-serif text-lg text-brown-900 border-2 border-brown-700 transition-all duration-300 hover:bg-brown-700 hover:text-oat-100"
              style={{
                background: "rgba(245, 233, 208, 0.4)",
                boxShadow: "0 4px 12px -4px rgba(110, 86, 53, 0.25)",
              }}
            >
              <span>开始图鉴</span>
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-ink-soft">
            本品种的 6 页图谱正在制作中,敬请期待。
          </p>
        )}

        {/* Footer */}
        <div className="mt-12 md:mt-16 text-center">
          <Link
            href="/pets"
            className="text-sm text-brown-600 hover:text-brown-900 transition-colors"
          >
            ← 返回品种列表
          </Link>
        </div>
      </main>
    </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 内部小组件                                                          */
/* ------------------------------------------------------------------ */

/** 属性块(罗马数字风格) */
function Stat({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
}) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "rgba(245, 233, 208, 0.55)",
        boxShadow: "var(--shadow-paper)",
        border: "1px solid rgba(139, 111, 71, 0.12)",
      }}
    >
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500">
        {label}
      </dt>
      <dd className="mt-1.5 flex items-baseline gap-1">
        <span className="font-serif text-lg md:text-xl font-bold text-brown-900">
          {value}
        </span>
        {unit && (
          <span className="font-mono text-xs text-brown-600">{unit}</span>
        )}
      </dd>
      {sub && (
        <dd className="mt-0.5 text-xs text-brown-600">{sub}</dd>
      )}
    </div>
  );
}

/** 性格评分条(罗马数字) */
function ScoreBar({ label, v, en }: { label: string; v: number; en: string }) {
  const num = Math.max(0, Math.min(10, Math.round(v)));
  const roman = toRoman(num);
  const pct = num * 10;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <div>
          <div className="font-serif text-sm text-brown-900">{label}</div>
          <div className="font-mono text-[9px] uppercase tracking-wider text-brown-500 italic">
            {en}
          </div>
        </div>
        <div
          className="font-mono text-base font-bold text-brown-700"
          title={`${num}/10`}
        >
          {roman}
        </div>
      </div>
      <div
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: "rgba(139, 111, 71, 0.12)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #B8956A 0%, #8B6F47 100%)",
          }}
        />
      </div>
    </div>
  );
}

/** 段头 */
function SectionHeading({
  eyebrow,
  title,
  en,
  rightSlot,
}: {
  eyebrow: string;
  title: string;
  en: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-2 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-brick" />
          {eyebrow}
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brown-900 leading-tight">
          {title}
          <span className="ml-3 font-serif italic text-base md:text-lg text-brown-500 font-normal">
            {en}
          </span>
        </h2>
      </div>
      {rightSlot}
    </div>
  );
}

/** 简化的植物图鉴(详情页边角) */
function BotanicalDecoration({
  variant,
}: {
  variant: "left" | "right";
}) {
  return (
    <svg
      viewBox="0 0 120 320"
      className="w-full h-auto"
      style={{
        transform: variant === "right" ? "scaleX(-1)" : undefined,
        opacity: 0.75,
      }}
      aria-hidden="true"
    >
      {/* 主茎 */}
      <path
        d="M 60 0 C 58 80, 62 160, 60 240 S 56 300, 60 320"
        stroke="#8B6F47"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      {/* 侧茎 */}
      <path
        d="M 60 60 C 35 70, 18 85, 8 100 M 60 60 C 85 70, 102 85, 112 100"
        stroke="#8B6F47"
        strokeWidth="0.7"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M 60 140 C 32 150, 15 170, 5 190 M 60 140 C 88 150, 105 170, 115 190"
        stroke="#8B6F47"
        strokeWidth="0.7"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M 60 220 C 38 230, 22 250, 15 270 M 60 220 C 82 230, 98 250, 105 270"
        stroke="#8B6F47"
        strokeWidth="0.7"
        fill="none"
        opacity="0.55"
      />
      {/* 叶片 */}
      {[
        { cx: 8, cy: 100, rx: 14, ry: 7, rot: -45 },
        { cx: 112, cy: 100, rx: 14, ry: 7, rot: 45 },
        { cx: 5, cy: 190, rx: 15, ry: 8, rot: -40 },
        { cx: 115, cy: 190, rx: 15, ry: 8, rot: 40 },
        { cx: 15, cy: 270, rx: 12, ry: 6, rot: -35 },
        { cx: 105, cy: 270, rx: 12, ry: 6, rot: 35 },
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.rx}
          ry={leaf.ry}
          transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
          fill="#A8C5A0"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function categoryLabel(cat: string): string {
  return {
    dog: "犬",
    cat: "猫",
    "small-mammal": "小型哺乳",
    bird: "鸟",
    reptile: "爬虫",
  }[cat] || cat;
}

/** 从 slug 算一个稳定的 specimen 编号(只是装饰,不一定有意义) */
function petNum(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return String(Math.abs(h) % 999).padStart(3, "0");
}

/** 1-10 转罗马数字 */
function toRoman(n: number): string {
  if (n <= 0 || n > 10) return String(n);
  return ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n];
}
