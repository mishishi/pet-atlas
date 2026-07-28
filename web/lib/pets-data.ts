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
  // C 批 3 扩品种 10 个(2026-07-22,90→100)
  "birman",
  "chipmunk",
  "doberman-pinscher",
  "gopher-snake",
  "gouldian-finch",
  "indian-ringneck",
  "norwegian-forest-cat",
  "quaker-parrot",
  "rottweiler",
  "savannah-monitor",
  // D 批扩品种 50 个同步(2026-07-26, 跟 lib/pets.ts VINTAGE_PAPER_DONE 100→150 同步)
  // 减 4: tibetan-mastiff / emu / vasa-parrot / hawk-headed-parrot (不普及/罕见)
  // 加 4: devon-rex / siberian / manx / fennec-fox (网红 + 普及)
  // 跑超 24 个老 breed 也补图: basenji / borzoi / ...
  // D 批 5×10 严格均衡: dog 40, cat 33, small-mammal 29, bird 24, reptile 25
  // dog 跑超 (10)
  "basenji",
  "borzoi",
  "chinese-crested",
  "giant-schnauzer",
  "japanese-spitz",
  "keeshond",
  "norfolk-terrier",
  "plott",
  "scottish-terrier",
  "soft-coated-wheaten-terrier",
  // cat 跑超 (5)
  "asian-semi-longhair",
  "balinese",
  "european-shorthair",
  "korat",
  "nebelung",
  "snowshoe",
  "turkish-van",
  // D 批新加 cat 4 (网红/普及)
  "devon-rex",
  "siberian",
  "manx",
  // small-mammal 跑超 (8)
  "agouti",
  "common-chinchilla",
  "flying-squirrel",
  "jerboa",
  "kangaroo-rat",
  "meadow-vole",
  "naked-mole-rat",
  "patagonian-mara",
  "greater-glider",
  // D 批新加 small-mammal 1 (网红)
  "fennec-fox",
  // bird 跑超 (9)
  "alexandrine-parakeet",
  "blue-fronted-amazon",
  "common-myna",
  "eclectus-parrot",
  "goldfinch",
  "jandaya-parakeet",
  "majestic-rosella",
  "plum-headed-parakeet",
  "red-capped-parrot",
  "senegal-parrot",
  // reptile 跑超 (8)
  "chinese-water-dragon",
  "emerald-tree-skink",
  "frilled-lizard",
  "green-iguana",
  "indian-star-tortoise",
  "leopard-tortoise",
  "mata-mata",
  "panther-chameleon",
  "woma-python",
  "yellow-margined-box-turtle",
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
 *
 * 🚨 2026-07-26 fix: TCB 模式没有 thumb/medium 文件(upload-atlas-tcb.mjs 只传 01-cover.png),
 * thumb/medium 走本地 (commit 进 git,production 永远可用)
 * full 走 TCB (本地无,1-5MB 太大不进 git)
 */
export function getCoverUrl(
  slug: string,
  size: "thumb" | "medium" | "full" = "full"
): string | null {
  if (!VINTAGE_PAPER_DONE.has(slug)) return null;
  const pet = allPets.find((p) => p.slug === slug);
  if (!pet) return null;
  const dir = atlasDirName(pet.category);
  const base = `/${dir}/${pet.slug}`;

  // thumb/medium 走本地 (commit 进 git,首屏 LCP 优化)
  if (size === "thumb") return `${base}/01-cover-thumb.jpg`;
  if (size === "medium") return `${base}/01-cover-medium.jpg`;

  // full 走 TCB (本地无,1-5MB 太大)
  return ATLAS_BASE_URL
    ? `${ATLAS_BASE_URL}${base}/01-cover.png`
    : `${base}/01-cover.png`;
}

/* ------------------------------------------------------------------ */
/* 标本编号 (client-safe) — 跟 server 端 /lib/collection.ts 字典序一致 */
/* B-15 Top 3-1 修 N° 编号越界 bug: BreedCard 从 petNum (hash % 999)    */
/* 切到 getSpecimenNumberClient (字典序 1-150),跟 detail page 一致      */
/* ------------------------------------------------------------------ */

const _sortedSlugs: readonly string[] = allPets
  .map((p) => p.slug)
  .sort();

/** Client-safe: 1-based 标本编号 (0 表示未发布) */
export function getSpecimenNumberClient(slug: string): number {
  const idx = _sortedSlugs.indexOf(slug);
  return idx >= 0 ? idx + 1 : 0;
}

/** Client-safe: 总件数 (跟 server 端 TOTAL_SPECIMENS 一致) */
export const TOTAL_SPECIMENS_CLIENT: number = _sortedSlugs.length;
