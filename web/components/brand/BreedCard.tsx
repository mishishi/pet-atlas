/**
 * BreedCard · 品种卡(图鉴)
 */
import Link from "next/link";
// 用 pets-data (client-safe) 而不是 lib/pets (有 fs)
import { getCoverUrl } from "@/lib/pets-data";
import { SafeImage } from "../ui/SafeImage";
import type { Pet } from "@/lib/types";

export interface BreedCardProps {
  pet: Pet;
  size?: "sm" | "md" | "lg";
  showMeta?: boolean;
}

const CATEGORY_ZH: Record<string, string> = {
  dog: "犬",
  cat: "猫",
  "small-mammal": "小型哺乳",
  bird: "鸟",
  reptile: "爬虫",
};

export function BreedCard({ pet, size = "md", showMeta = true }: BreedCardProps) {
  // 列表卡片用 thumb (512px, ~250KB) — 4 张卡同时加载不会卡
  // fallback: thumb 没生成时回落到 full (01-cover.png, 1-5MB 但保证能加载)
  const cover = getCoverUrl(pet.slug, "thumb") || "";
  const fallback = getCoverUrl(pet.slug, "full") || "";
  const cat = CATEGORY_ZH[pet.category] || pet.category;

  return (
    <Link
      href={`/pets/${pet.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-brown-500 focus-visible:outline-offset-4 rounded-[var(--radius)]"
    >
      <article className="bg-oat-100 border border-brown-200 rounded-[var(--radius)] overflow-hidden shadow-[var(--shadow-paper)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-paper-lg)] group-hover:border-brown-400">
        <div className="relative aspect-[9/16] w-full overflow-hidden bg-oat-200">
          <SafeImage
            src={cover}
            fallback={fallback}
            alt={`${pet.name.zh} vintage paper 标本卡`}
            fill
            sizes={
              size === "lg"
                ? "(max-width: 768px) 80vw, 40vw"
                : "(max-width: 768px) 50vw, 20vw"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.18em] text-brick bg-oat-50/85 backdrop-blur-sm px-2 py-1 rounded-sm">
            Vintage · 2026
          </div>
        </div>

        <div
          className={
            "p-4 " +
            (size === "lg" ? "md:p-6 " : "") +
            "border-t border-brown-200"
          }
        >
          {showMeta && (
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brown-500">
                {cat}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-brick/70">
                · 2026 ·
              </span>
            </div>
          )}
          <h3
            className={
              "font-serif font-bold text-brown-900 tracking-tight " +
              (size === "lg" ? "text-2xl md:text-3xl" : "text-lg md:text-xl")
            }
          >
            {pet.name.zh}
          </h3>
          <p
            className={
              "font-mono italic text-brown-500 mt-1 " +
              (size === "lg" ? "text-sm" : "text-xs")
            }
          >
            {pet.name.en}
          </p>
        </div>
      </article>
    </Link>
  );
}
