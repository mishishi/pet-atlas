import fs from "fs";
import path from "path";
import type { AtlasSlot, BreedAtlas, Pet } from "./types";
import { ATLAS_SLOTS } from "./atlas-constants";
export { ATLAS_PAGE_COUNT, ATLAS_SLOTS, ATLAS_SLOT_KEYS } from "./atlas-constants";

/**
 * 宠物 JSON 目录
 * 路径:web/ 的 process.cwd() 是 web/,所以 ../content/pets 指向仓库根的 content/pets
 */
const PETS_DIR = path.join(process.cwd(), "..", "content", "pets");

/**
 * 读取所有已发布品种
 * 容错:任一 JSON 解析失败时跳过该文件,不抛错阻断整体读取
 */
export function getAllPets(): Pet[] {
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(PETS_DIR);
  } catch (err) {
    console.error(`[pets] 读取目录失败: ${PETS_DIR}`, err);
    return [];
  }

  const pets: Pet[] = [];
  for (const file of entries) {
    if (!file.endsWith(".json")) continue;
    const full = path.join(PETS_DIR, file);
    try {
      const raw = fs.readFileSync(full, "utf-8");
      const data = JSON.parse(raw) as Pet;
      if (!data || typeof data.slug !== "string" || !data.name) continue;
      pets.push(data);
    } catch (err) {
      console.warn(`[pets] 跳过无效 JSON: ${file}`, err);
    }
  }

  return pets.filter((p) => p.status === "published");
}

/** 按 slug 读取品种 */
export function getPetBySlug(slug: string): Pet | null {
  if (!slug || typeof slug !== "string") return null;
  const safe = slug.replace(/[^a-z0-9-]/gi, "");
  if (safe !== slug) return null;
  const full = path.join(PETS_DIR, `${slug}.json`);
  if (!fs.existsSync(full)) return null;
  try {
    const raw = fs.readFileSync(full, "utf-8");
    return JSON.parse(raw) as Pet;
  } catch (err) {
    console.error(`[pets] 读取失败: ${slug}`, err);
    return null;
  }
}

/**
 * category → 目录名映射
 * bird 和 reptile 共用 bird-reptile/
 */
function atlasDirName(category: string): string {
  if (category === "dog") return "dog";
  if (category === "cat") return "cat";
  if (category === "small-mammal") return "small-mammal";
  return "bird-reptile";
}

/** 6 个图谱槽位的英文 key(用于文件名) */
const SLOT_KEYS = ["cover", "traits", "personality", "history", "care", "famous"] as const;

/** 单张图谱文件名(不带路径,例:`01-cover.png`) */
function atlasFileName(slotIndex: number): string {
  const slot = String(slotIndex).padStart(2, "0");
  const key = SLOT_KEYS[slotIndex - 1] ?? "cover";
  return `${slot}-${key}.png`;
}

/** 单张图谱的公开 URL(例:`/dog/labrador-retriever/01-cover.png`) */
function atlasPublicUrl(pet: Pet, slotIndex: number): string {
  return `/${atlasDirName(pet.category)}/${pet.slug}/${atlasFileName(slotIndex)}`;
}

/**
 * 已有图谱的品种集合(动态从 public/ 目录扫描)
 * 这样新增品种自动支持,不需要手动维护
 */
function findSupportedBreeds(): Set<string> {
  const supported = new Set<string>();
  const PUBLIC_ROOT = path.join(process.cwd(), "public");
  const CATEGORIES = ["dog", "cat", "small-mammal", "bird-reptile"] as const;

  for (const cat of CATEGORIES) {
    const catDir = path.join(PUBLIC_ROOT, cat);
    if (!fs.existsSync(catDir)) continue;
    for (const slug of fs.readdirSync(catDir)) {
      const slugDir = path.join(catDir, slug);
      if (!fs.statSync(slugDir).isDirectory()) continue;
      // 必须有 01-cover.png 才算支持
      if (fs.existsSync(path.join(slugDir, "01-cover.png"))) {
        supported.add(slug);
      }
    }
  }
  return supported;
}

/**
 * 取得品种的图谱(6 张图 URL + 名称 + 槽位标签)
 */
export function getBreedAtlas(slug: string): BreedAtlas | null {
  const SUPPORTED = findSupportedBreeds();
  if (!SUPPORTED.has(slug)) return null;

  const pet = getPetBySlug(slug);
  if (!pet) return null;

  const gallery: string[] = [];
  const slots: AtlasSlot[] = [];
  for (let i = 1; i <= 6; i++) {
    const url = atlasPublicUrl(pet, i);
    gallery.push(url);
    slots.push({
      index: i,
      label: ATLAS_SLOTS[i - 1] ?? `图 ${i}`,
      filename: url,
    });
  }

  return {
    name: { zh: pet.name.zh, en: pet.name.en },
    gallery,
    slots,
  };
}

/** 品种是否已经有完整图谱(扫描 public/ 动态判断) */
export function hasBreedAtlas(slug: string): boolean {
  return findSupportedBreeds().has(slug);
}

/**
 * 已经是 vintage paper 统一风格的品种白名单
 * (2026-07-18 11:15 后跑的图,都带 vintage paper museum specimen card + decorative frame border)
 *
 * 决定哪些品种页不加 "vintage paper 重做中" banner
 * 初始 4 个:british-shorthair, labrador-retriever, golden-retriever, pembroke-welsh-corgi
 * Token Plan 限额恢复后,跑完的品种从这里追加
 */
export const VINTAGE_PAPER_DONE: ReadonlySet<string> = new Set([
  "abyssinian",
  "african-grey-parrot",
  "african-pygmy-hedgehog",
  "alaskan-malamute",
  "american-shorthair",
  "ball-python",
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
]);

/**
 * 旧版风格的品种(2026-07-18 11:15 之前跑的,无 vintage paper 关键字)
 * 2026-07-18 完成全部 50 品种的 vintage paper 统一重做,此 set 永远清空
 */
export const LEGACY_ATLAS_BREEDS: ReadonlySet<string> = new Set([]);

/**
 * 品种是否已经是统一 vintage paper 风格
 * 返回 true:不显示 banner
 * 返回 false:有完整图谱但是旧版风格,显示 banner
 */
export function isVintagePaperBreed(slug: string): boolean {
  return VINTAGE_PAPER_DONE.has(slug);
}

/** 取得第一张可用的封面 URL */
export function getCoverUrl(slug: string): string | null {
  if (!hasBreedAtlas(slug)) return null;
  const pet = getPetBySlug(slug);
  if (!pet) return null;
  return atlasPublicUrl(pet, 1);
}
