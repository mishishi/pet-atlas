/**
 * web/app/not-found.tsx · "Specimen Not Found" 标本失踪卡
 *
 * 风格:博物馆标本失踪告示 + 推荐 3 只 random breeds 引导用户回主页
 * 跟整体 vintage 体系一致 (warm brown + paper texture + IM Fell English)
 */

import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { getAllPets } from "@/lib/pets";

export const metadata = {
  title: "标本未找到 · Pet Atlas",
  description: "您寻找的标本不在馆藏中。试试看其他 150 件收藏。",
};

/** 用路径 hash 选 3 个推荐 (稳定,跟 daily pick 同思路) */
function pickRecommendations(slugs: string[], exclude: string, count: number): string[] {
  const candidates = slugs.filter((s) => s !== exclude);
  if (candidates.length <= count) return candidates;
  // 混合:用 path hash + 时间
  const pathHash =
    typeof window !== "undefined"
      ? window.location.pathname
      : "404";
  let h = 0;
  for (let i = 0; i < pathHash.length; i++) {
    h = (h * 31 + pathHash.charCodeAt(i)) | 0;
  }
  const offset = Math.abs(h) % candidates.length;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(candidates[(offset + i) % candidates.length]);
  }
  return result;
}

export default function NotFound() {
  const allPets = getAllPets().filter((p) => p.status === "published");
  const allSlugs = allPets.map((p) => p.slug).sort();
  const recSlugs = pickRecommendations(allSlugs, "", 3);
  const recPets = recSlugs
    .map((slug) => allPets.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <Header />
      <main
        className="relative w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
          minHeight: "calc(100vh - 200px)",
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

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-20 text-center">
          {/* 顶部:丢失告示 */}
          <div
            className="inline-block mb-6"
            style={{
              padding: "6px 20px",
              border: "2px solid var(--brick)",
              borderRadius: 2,
              transform: "rotate(-2deg)",
              filter: "url(#wax-ink-bleed)",
              background: "rgba(164, 74, 63, 0.04)",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 13,
                letterSpacing: "0.3em",
                color: "var(--brick)",
                fontWeight: 600,
              }}
            >
              N° 404 · NOT IN COLLECTION
            </span>
          </div>

          {/* 大字标题 */}
          <h1
            className="font-serif font-bold text-brown-900 mb-3"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1.05 }}
          >
            标本未找到
          </h1>
          <p
            className="font-display italic mb-2"
            style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "var(--warm-brown)" }}
          >
            Specimen Not Found
          </p>
          <p
            className="font-serif mb-8 mx-auto max-w-xl"
            style={{ fontSize: 16, color: "var(--brown-700)" }}
          >
            您寻找的标本不在我们的 150 件馆藏中。可能遗失、可能编号错误,也可能从未被记录过。
          </p>

          {/* 装饰双横线 + 拉丁小语 */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <span
              className="inline-block h-px w-12"
              style={{ background: "var(--brown-500)", opacity: 0.4 }}
            />
            <span
              className="font-display italic text-sm"
              style={{ color: "var(--brown-500)", opacity: 0.7 }}
            >
              — Tryvolvimur in collectione —
            </span>
            <span
              className="inline-block h-px w-12"
              style={{ background: "var(--brown-500)", opacity: 0.4 }}
            />
          </div>

          {/* 推荐 3 个 breeds */}
          <div className="mb-10">
            <h2
              className="font-mono uppercase tracking-[0.3em] text-sm mb-4"
              style={{ color: "var(--brown-500)" }}
            >
              — Or try one of these —
            </h2>
            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
              {recPets.map((pet) => (
                <Link
                  key={pet.slug}
                  href={`/pets/${pet.slug}`}
                  className="group block"
                >
                  <div
                    className="relative p-1.5 transition-transform group-hover:scale-[1.03]"
                    style={{
                      background:
                        "linear-gradient(135deg, #B8956A 0%, #8B6F47 50%, #6E5635 100%)",
                      boxShadow: "var(--shadow-paper)",
                    }}
                  >
                    <div className="relative aspect-square overflow-hidden bg-oat-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/${categoryDir(pet.category)}/${pet.slug}/01-cover-thumb.jpg`}
                        alt={pet.name.zh}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-2 font-serif text-sm text-brown-900 group-hover:text-brick transition-colors">
                    {pet.name.zh}
                  </div>
                  <div
                    className="font-display italic text-[11px]"
                    style={{ color: "var(--brown-500)" }}
                  >
                    {pet.name.en}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 大 CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono uppercase tracking-[0.2em] border-2 transition-all"
              style={{
                background: "var(--brown-700)",
                color: "var(--oat-100)",
                borderColor: "var(--brown-700)",
              }}
            >
              ← 返回主馆
            </Link>
            <Link
              href="/pets"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono uppercase tracking-[0.2em] border-2 transition-colors"
              style={{
                color: "var(--brown-700)",
                borderColor: "var(--brown-700)",
                background: "rgba(245, 233, 208, 0.4)",
              }}
            >
              翻 150 件馆藏
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function categoryDir(cat: string): string {
  if (cat === "bird" || cat === "reptile") return "bird-reptile";
  return cat;
}
