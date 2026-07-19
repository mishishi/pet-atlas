import Link from "next/link";
import { getBreedAtlas, getAllPets } from "@/lib/pets";

export default function HomePage() {
  const pets = getAllPets();
  // 提取已有图谱的品种(目前只 labrador + british-shorthair)
  const featured = pets
    .map((p) => {
      const atlas = getBreedAtlas(p.slug);
      if (!atlas) return null;
      return { pet: p, atlas };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <main className="flex-1 w-full">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* Hero */}
        <section className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="text-xs tracking-[0.4em] text-ink-soft uppercase">
            Pet Atlas Demo
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            宠物大百科
          </h1>
          <p className="max-w-xl text-base sm:text-lg text-ink-soft leading-relaxed">
            为爱宠收藏一整套图鉴 ——
            <br className="hidden sm:block" />
            精选品种的 6 页图谱,从封面到名场面一次看完。
          </p>
          <Link
            href="/pets"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink text-oat px-6 py-3 text-sm font-medium hover:bg-ink/85 transition-colors"
          >
            浏览全部品种
            <span aria-hidden>→</span>
          </Link>
        </section>

        {/* Featured cards */}
        <section>
          <h2 className="sr-only">已上线图鉴</h2>
          {featured.length === 0 ? (
            <p className="text-center text-ink-soft">暂无已上线图鉴</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featured.map(({ pet, atlas }) => (
                <Link
                  key={pet.slug}
                  href={`/pets/${pet.slug}`}
                  className="group block rounded-2xl bg-white/60 shadow-sm hover:shadow-md transition-all overflow-hidden border border-oat-deep/40"
                >
                  <div className="relative aspect-[9/16] bg-oat-deep overflow-hidden">
                    {/* 用普通 <img> 避免 next/image 优化对 demo 引入额外复杂度 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={atlas.gallery[0]}
                      alt={`${atlas.name.zh} 封面`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <span className="text-xs tracking-widest text-accent uppercase">
                      {pet.category}
                    </span>
                    <h3 className="text-xl font-bold">{atlas.name.zh}</h3>
                    <p className="text-sm text-ink-soft italic">
                      {atlas.name.en}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 text-sm text-ink group-hover:text-accent">
                      开始图鉴
                      <span aria-hidden>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
