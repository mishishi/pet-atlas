/**
 * BreedCard · 品种卡(图鉴) — vintage 标本卡升级 (v1.2)
 *
 * 升级:
 *  - 角标: "Vintage · 2026" → "N° 001 · VINTAGE PAPER" (标本卡编号)
 *  - 副标题: 拉丁学名用 font-display italic (18 世纪印刷机)
 *  - 类别 + 编号 双排布局
 *  - hover 浮起 + 暖棕边加粗
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

/** 1-N 转罗马数字 (用于 Tabula I, II, III...) */
function toRoman(n: number): string {
  if (n <= 0 || n > 100) return String(n);
  const numerals: Array<[number, string]> = [
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let remaining = n;
  for (const [value, sym] of numerals) {
    while (remaining >= value) {
      result += sym;
      remaining -= value;
    }
  }
  return result;
}

/** 从 slug 算稳定编号 (跟 detail page 的 petNum 逻辑一致) */
function petNum(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return String(Math.abs(h) % 999).padStart(3, "0");
}

export function BreedCard({ pet, size = "md", showMeta = true }: BreedCardProps) {
  // 列表卡片用 thumb (512px, ~250KB) — 4 张卡同时加载不会卡
  // fallback: thumb 没生成时回落到 full (01-cover.png, 1-5MB 但保证能加载)
  const cover = getCoverUrl(pet.slug, "thumb") || "";
  const fallback = getCoverUrl(pet.slug, "full") || "";
  const cat = CATEGORY_ZH[pet.category] || pet.category;
  const num = petNum(pet.slug);
  const roman = toRoman(((parseInt(num, 10) % 6) + 1));

  return (
    <Link
      href={`/pets/${pet.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-brown-500 focus-visible:outline-offset-4 rounded-[var(--radius)]"
    >
      <article
        className="bg-oat-100 border-2 border-brown-200 rounded-[var(--radius)] overflow-hidden shadow-[var(--shadow-paper)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-paper-lg)] group-hover:border-brown-500"
      >
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
          {/* 顶部角标:N° 编号 + VINTAGE 标签 */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-brick bg-oat-50/90 backdrop-blur-sm px-2 py-1 rounded-sm">
              N° {num}
            </span>
            <span className="font-display italic text-[9px] uppercase tracking-[0.2em] text-warm-brown bg-oat-50/85 backdrop-blur-sm px-1.5 py-1 rounded-sm">
              Tab. {roman}
            </span>
          </div>
          {/* 右下角:VINTAGE 标签 */}
          <div className="absolute bottom-3 right-3 font-display italic text-[9px] uppercase tracking-[0.2em] text-warm-brown/80 bg-oat-50/70 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
            Vintage · 2026
          </div>
        </div>

        <div
          className={
            "p-4 " +
            (size === "lg" ? "md:p-6 " : "") +
            "border-t-2 border-brown-200 group-hover:border-warm-brown transition-colors"
          }
        >
          {showMeta && (
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-brown">
                {cat}
              </span>
              <span className="font-display italic text-[10px] tracking-wider text-brown-500">
                {pet.physical?.sizeGroup ?? ""} · {pet.physical?.lifespanYears ?? ""}
              </span>
            </div>
          )}
          <h3
            className={
              "font-serif font-bold text-brown-900 tracking-tight leading-tight " +
              (size === "lg" ? "text-2xl md:text-3xl" : "text-lg md:text-xl")
            }
          >
            {pet.name.zh}
          </h3>
          <p
            className={
              "font-display italic text-brown-500 mt-0.5 tracking-wide " +
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
