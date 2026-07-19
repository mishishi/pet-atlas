import Link from "next/link";
import { getAllPets, getCoverUrl } from "@/lib/pets";
import type { SizeGroup } from "@/lib/types";

/** 体型 chip 标签文案 */
const SIZE_LABEL: Record<SizeGroup, string> = {
  toy: "迷你",
  small: "小型",
  medium: "中型",
  large: "大型",
  giant: "巨型",
};

export default function PetsListPage() {
  const pets = getAllPets();

  return (
    <main className="flex-1 w-full">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="text-sm text-ink-soft hover:text-ink"
            >
              ← 返回首页
            </Link>
            <span className="text-xs tracking-widest text-ink-soft uppercase">
              全部品种
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">宠物图鉴列表</h1>
          <p className="text-sm text-ink-soft">
            共 {pets.length} 个已发布品种 ·
            标有图鉴角标的品种可进入 6 页图谱翻页模式
          </p>
        </header>

        {/* Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pets.map((pet) => {
            const cover = getCoverUrl(pet.slug);
            const hasAtlas = cover !== null;
            const size = pet.physical?.sizeGroup;
            return (
              <li key={pet.slug}>
                <Link
                  href={`/pets/${pet.slug}`}
                  className="group block h-full rounded-2xl bg-white/60 shadow-sm hover:shadow-md transition-all overflow-hidden border border-oat-deep/40"
                >
                  <div className="relative aspect-[4/3] bg-oat-deep overflow-hidden">
                    {hasAtlas ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover!}
                        alt={`${pet.name.zh} 封面`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-soft text-sm">
                        图谱待上线
                      </div>
                    )}
                    {hasAtlas && (
                      <span className="absolute top-3 right-3 rounded-full bg-ink/85 text-oat text-[10px] tracking-widest px-2.5 py-1 uppercase">
                        6-page atlas
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold leading-snug">
                        {pet.name.zh}
                      </h3>
                      {size && (
                        <span className="shrink-0 rounded-full bg-oat-deep/70 text-ink text-[11px] px-2.5 py-1">
                          {SIZE_LABEL[size]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-soft italic leading-relaxed">
                      {pet.name.en}
                    </p>
                    {pet.origin?.country && (
                      <p className="text-xs text-ink-soft">
                        原产 · {pet.origin.country}
                        {pet.origin.region ? ` ${pet.origin.region}` : ""}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
