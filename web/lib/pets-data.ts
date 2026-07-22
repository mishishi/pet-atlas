/**
 * web/lib/pets-data.ts · 客户端安全的 pets 数据层 (no fs / no path)
 *
 * 与 lib/pets.ts 的区别:
 * - lib/pets.ts 含 fs / path,只能被 server component / server action 引
 *   (或被 client 引但会触发 Vercel build 失败)
 * - pets-data.ts 用 build-time 生成的 JSON,client component 可安全 import
 *
 * 保持 VINTAGE_PAPER_DONE 与 lib/pets.ts 同步(改了 list 同步两处)
 *
 * 用法:
 *   import { allPets, getCoverUrl } from "@/lib/pets-data";
 */

import type { Pet } from "./types";
// pets-data.json 由 scripts/build-pets-data.mjs 在 prebuild 时生成
// 用 unknown 强转避开 JSON 推断的 number/any 与 Pet 的 literal union 不匹配
// (template 在 JSON 是 number 1-4,在 Pet 是 "1" | "2" | "3" | "4" string)
import petsJson from "./pets-data.json";

/** 全部已发布品种(去重 status==='published') */
export const allPets: Pet[] = (petsJson as unknown as Pet[]).filter(
  (p) => p && p.status === "published"
);

/** 已经有完整图谱(走 TCB)的品种白名单(2026-07-18 11:15 后跑的都算) */
export const VINTAGE_PAPER_DONE: ReadonlySet<string> = new Set([
  "abyssinian",
  "african-grey-parrot",
  "african-pygmy-hedgehog",
  "alaskan-malamute",
  "american-shorthair",
  "ball-python",
  "bearded-dragon",
  "bichon-frise",
  "border-collie",
  "british-shorthair",
  "budgerigar",
  "chihuahua",
  "chinese-hamster",
  "chinese-li-hua",
  "cockatiel",
  "crested-gecko",
  "dachshund",
  "dutch-rabbit",
  "english-angora",
  "exotic-shorthair",
  "ferret",
  "french-bulldog",
  "golden-retriever",
  "greek-tortoise",
  "guinea-pig",
  "holland-lop",
  "labrador-retriever",
  "leopard-gecko",
  "long-tailed-chinchilla",
  "lovebird",
  "maine-coon",
  "mini-rex",
  "miniature-schnauzer",
  "orange-tabby",
  "pembroke-welsh-corgi",
  "persian",
  "persian-silver-chinchilla",
  "pomeranian",
  "ragdoll",
  "red-eared-slider",
  "roborovski-hamster",
  "russian-tortoise",
  "samoyed",
  "shiba-inu",
  "siamese",
  "siberian-husky",
  "sphynx",
  "sulcata-tortoise",
  "syrian-hamster",
  "toy-poodle",
  "winter-white-hamster",
  // M2 扩品种补图 19 个(2026-07-21)
  "axolotl",
  "beagle",
  "bengal",
  "boxer",
  "canary",
  "capybara",
  "corn-snake",
  "macaw",
  "maltese",
  "munchkin",
  "prairie-dog",
  "pug",
  "russian-blue",
  "scottish-fold",
  "shih-tzu",
  "sugar-glider",
  "tenrec",
  "yorkshire-terrier",
  "zebra-finch",
  // C 批扩品种 10 个(2026-07-22)
  "american-curl",
  "basset-hound",
  "bombay",
  "burmese",
  "degu",
  "english-springer-spaniel",
  "gerbil",
  "jack-russell-terrier",
  "old-english-sheepdog",
  "sun-conure",
  // C 批 2 扩品种 10 个(2026-07-22,80→90)
  "blue-tongued-skink",
  "dalmatian",
  "havanese",
  "hermann-tortoise",
  "java-sparrow",
  "parrotlet",
  "red-footed-tortoise",
  "society-finch",
  "somali",
  "turkish-angora",
]);

/** category → 目录名映射 */
function atlasDirName(category: string): string {
  if (category === "dog") return "dog";
  if (category === "cat") return "cat";
  if (category === "small-mammal") return "small-mammal";
  return "bird-reptile";
}

const ATLAS_BASE_URL = (process.env.NEXT_PUBLIC_ATLAS_BASE_URL || "").replace(
  /\/$/,
  ""
);

/**
 * 封面 URL (client-safe 版本,无 fs 扫描)
 * - 有 ATLAS_BASE_URL (走 TCB):走云端 URL
 * - 无 (走本地):返回 /<cat>/<slug>/01-cover.png
 * - 缩略图只在 TCB 模式下有 (本地没 thumb)
 */
export function getCoverUrl(
  slug: string,
  size: "thumb" | "medium" | "full" = "full"
): string | null {
  if (!VINTAGE_PAPER_DONE.has(slug)) return null;
  const pet = allPets.find((p) => p.slug === slug);
  if (!pet) return null;
  if (!ATLAS_BASE_URL || size === "full") {
    return `${ATLAS_BASE_URL || ""}/${atlasDirName(pet.category)}/${pet.slug}/01-cover.png`;
  }
  const fileName = `01-cover-${size}.png`;
  return `${ATLAS_BASE_URL}/${atlasDirName(pet.category)}/${pet.slug}/${fileName}`;
}
