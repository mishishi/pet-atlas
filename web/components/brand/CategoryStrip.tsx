/**
 * CategoryStrip · 5 个分类入口
 */
import Link from "next/link";
import { Container } from "../ui/Container";
import { getAllPets } from "@/lib/pets";

const CATEGORIES = [
  { key: "dog", zh: "犬", en: "Canis", desc: "最古老的伙伴" },
  { key: "cat", zh: "猫", en: "Felis", desc: "独立的优雅" },
  { key: "small-mammal", zh: "小型哺乳", en: "Mammalia", desc: "口袋里的温顺" },
  { key: "bird", zh: "鸟", en: "Aves", desc: "天空的羽毛" },
  { key: "reptile", zh: "爬虫", en: "Reptilia", desc: "鳞甲的温度" },
] as const;

export function CategoryStrip() {
  const pets = getAllPets();
  const counts = CATEGORIES.map((c) => ({
    ...c,
    count: pets.filter((p) => p.category === c.key).length,
  }));

  return (
    <section id="categories" className="py-20 md:py-28">
      <Container size="xl">
        <div className="mb-12">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-brick mb-3 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-brick" />
            五大分类
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brown-900 tracking-tight max-w-[20ch]">
            按家族浏览
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {counts.map((c, i) => (
            <Link
              key={c.key}
              href={`/pets?category=${c.key}`}
              className="group block focus-visible:outline-2 focus-visible:outline-brown-500 focus-visible:outline-offset-4 rounded-[var(--radius)]"
            >
              <article className="relative h-full bg-oat-100 border border-brown-200 rounded-[var(--radius)] p-5 md:p-6 transition-all duration-500 ease-out group-hover:bg-oat-50 group-hover:border-brown-400 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-paper-md)]">
                <div className="flex items-start justify-between mb-6">
                  <span className="font-mono text-3xl text-brown-300 group-hover:text-brick transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brown-500 group-hover:text-brown-700 transition-colors">
                    {c.en}
                  </span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-bold text-brown-900 mb-2">
                  {c.zh}
                </h3>
                <p className="text-sm text-brown-500 mb-4">{c.desc}</p>

                <div className="flex items-end justify-between">
                  <span className="font-mono text-xs text-brown-500">
                    <span className="text-brown-900 font-medium">
                      {String(c.count).padStart(2, "0")}
                    </span>{" "}
                    个品种
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-brown-500 group-hover:text-brick group-hover:translate-x-1 transition-all"
                  >
                    →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
