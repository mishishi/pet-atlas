import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ATLAS_SLOTS,
  getBreedAtlas,
  getPetBySlug,
  isVintagePaperBreed,
} from "@/lib/pets";

/** 为所有已发布品种生成静态页(构建期一次跑完) */
export async function generateStaticParams() {
  // 这里直接读目录以避免循环引用 getAllPets 中的过滤逻辑
  const { getAllPets } = await import("@/lib/pets");
  return getAllPets().map((p) => ({ slug: p.slug }));
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
  // 已有图谱但是旧版风格(2026-07-18 11:15 之前跑)→ 提示"重做中"
  const showLegacyBanner = Boolean(atlas) && !isVintagePaperBreed(slug);

  return (
    <main className="flex-1 w-full">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/pets"
            className="text-sm text-ink-soft hover:text-ink"
          >
            ← 全部品种
          </Link>
          <span className="text-xs tracking-widest text-ink-soft uppercase">
            {pet.category}
          </span>
        </div>

        {/* Legacy banner: 已有图但是旧版风格,提示 vintage paper 重做中 */}
        {showLegacyBanner && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 shadow-sm">
            <div className="flex items-start gap-2">
              <span aria-hidden className="text-base">🎨</span>
              <div className="flex-1">
                <p className="font-semibold">
                  本品种图谱为早期风格,正在用 vintage paper 统一重做中
                </p>
                <p className="mt-1 text-xs text-amber-800/80">
                  重做完成后会自动替换为带暖棕画框 + 治愈水彩的统一风格,与英短、拉布拉多保持一致。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Full-bleed cover 9:16 */}
        {coverUrl && (
          <div className="relative w-full max-w-md mx-auto aspect-[9/16] rounded-2xl overflow-hidden shadow-sm bg-oat-deep">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={`${pet.name.zh} 封面`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Name + meta */}
        <header className="mt-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {pet.name.zh}
          </h1>
          <p className="mt-1 text-sm text-ink-soft italic">
            {pet.name.en}
          </p>
          {pet.name.alias?.zh && pet.name.alias.zh.length > 0 && (
            <p className="mt-2 text-xs text-ink-soft">
              别名 · {pet.name.alias.zh.join(" · ")}
            </p>
          )}
        </header>

        {/* Quick stats */}
        <section className="mt-8">
          <h2 className="sr-only">快速属性</h2>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {physical?.heightCm && (
              <Stat label="身高" value={`${physical.heightCm} cm`} />
            )}
            {physical?.weightKg && (
              <Stat label="体重" value={`${physical.weightKg} kg`} />
            )}
            {physical?.lifespanYears && (
              <Stat label="寿命" value={`${physical.lifespanYears} 年`} />
            )}
            {pet.origin?.country && (
              <Stat
                label="原产"
                value={`${pet.origin.country}${
                  pet.origin.region ? ` ${pet.origin.region}` : ""
                }`}
              />
            )}
          </dl>
        </section>

        {/* Personality summary */}
        {personality && (
          <section className="mt-8 rounded-2xl bg-white/60 p-5 shadow-sm border border-oat-deep/40">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-bold tracking-widest uppercase text-ink-soft">
                性格
              </h2>
              {personality.summary && (
                <span className="text-sm font-medium text-accent">
                  {personality.summary}
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <ScoreBar label="亲人" v={personality.affection} />
              <ScoreBar label="活跃" v={personality.activity} />
              <ScoreBar label="服从" v={personality.obedience} />
              <ScoreBar label="独立" v={personality.independence} />
              <ScoreBar label="吠叫" v={personality.vocalization} />
              <ScoreBar label="智商" v={personality.intelligence} />
            </div>
            {personality.tags && personality.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {personality.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-oat-deep/70 text-ink text-xs px-2.5 py-1"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Atlas thumbnails */}
        {atlas && (
          <section className="mt-8">
            <h2 className="text-sm font-bold tracking-widest uppercase text-ink-soft mb-3">
              6 张图谱
            </h2>
            <ol className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {atlas.gallery.map((url, i) => {
                const page = i + 1;
                const label = ATLAS_SLOTS[i] ?? `图 ${page}`;
                return (
                  <li key={url}>
                    <Link
                      href={`/pets/${pet.slug}/atlas?page=${page}`}
                      className="group block rounded-xl overflow-hidden bg-oat-deep shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="aspect-[9/16] relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`${label} · 第 ${page} 页`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1.5 left-1.5 rounded-full bg-ink/80 text-oat text-[10px] w-5 h-5 flex items-center justify-center">
                          {page}
                        </span>
                      </div>
                      <div className="px-1.5 py-1.5 text-center text-[11px] text-ink-soft">
                        {label}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* CTA */}
        {atlas ? (
          <div className="mt-10 flex justify-center">
            <Link
              href={`/pets/${pet.slug}/atlas?page=1`}
              className="inline-flex items-center gap-2 rounded-full bg-ink text-oat px-7 py-3.5 text-sm font-medium hover:bg-ink/85 transition-colors"
            >
              开始图鉴
              <span aria-hidden>→</span>
            </Link>
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-ink-soft">
            本品种的 6 页图谱正在制作中,敬请期待。
          </p>
        )}

        <footer className="mt-12 text-center">
          <Link
            href="/pets"
            className="text-sm text-ink-soft hover:text-ink"
          >
            ← 返回品种列表
          </Link>
        </footer>
      </div>
    </main>
  );
}

/** 内部小组件:属性块 */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/60 px-4 py-3 shadow-sm border border-oat-deep/40">
      <dt className="text-[11px] tracking-widest text-ink-soft uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-bold">{value}</dd>
    </div>
  );
}

/** 内部小组件:性格评分条 */
function ScoreBar({ label, v }: { label: string; v: number }) {
  const pct = Math.max(0, Math.min(10, v)) * 10;
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>{label}</span>
        <span className="font-mono text-ink">{v}/10</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-oat-deep overflow-hidden">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
