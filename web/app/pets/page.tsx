/**
 * web/app/pets/page.tsx · 品种列表页
 *
 * 重设计 (2026-07-19):
 * - Header (sticky)
 * - Page title
 * - Category tabs (5 个,sticky)
 * - Breed Grid (按 category 分组,每行 1 个 category group)
 * - Footer
 */
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { Container } from "@/components/ui/Container";
import { BreedCard } from "@/components/brand/BreedCard";
import { CategoryFilter } from "@/components/pets/CategoryFilter";
import { getAllPets } from "@/lib/pets";
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

export default function PetsListPage() {
  const pets = getAllPets();

  const grouped = CATEGORY_LABELS.map((cat) => ({
    ...cat,
    pets: pets.filter((p) => p.category === cat.key),
  }));

  const filterOptions = grouped
    .filter((g) => g.pets.length > 0)
    .map((g) => ({ key: g.key, zh: g.zh, count: g.pets.length }));

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page title */}
        <section className="pt-12 md:pt-20 pb-6 md:pb-8">
          <Container size="xl">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brick mb-4 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-brick" />
              Index · 全部品种
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown-900 tracking-tight leading-[1.05] mb-4 max-w-[20ch]">
              {pets.length} 个标本
            </h1>
            <p className="text-lg text-brown-600 max-w-[60ch]">
              从拉布拉多到鬃狮蜥,按家族分类的完整图鉴。
            </p>
          </Container>
        </section>

        {/* Sticky 分类筛选 */}
        <CategoryFilter categories={filterOptions} />

        {/* Category groups */}
        <section>
          <Container size="xl" className="space-y-20 md:space-y-28 pt-10 md:pt-12 pb-20 md:pb-28">
            {grouped.map((group, i) =>
              group.pets.length === 0 ? null : (
                <div key={group.key} id={`cat-${group.key}`} className="scroll-mt-32">
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
                      {String(group.pets.length).padStart(2, "0")} 个品种
                    </div>
                  </div>

                  <BreedGroup breeds={group.pets} />
                </div>
              ),
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

function BreedGroup({ breeds }: { breeds: Pet[] }) {
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
