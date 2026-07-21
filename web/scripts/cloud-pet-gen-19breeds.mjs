#!/usr/bin/env node
/**
 * web/scripts/cloud-pet-gen-19breeds.mjs
 *
 * 补全 19 个新品种(从 51 → 70)的云宠物立绘 prompt。
 *
 * 用法:
 *   node scripts/cloud-pet-gen-19breeds.mjs > /tmp/19breeds.json
 */

import fs from "node:fs";
import path from "node:path";

const __dirname = import.meta.dirname;
const ROOT = path.resolve(__dirname, "..", "..");
const POOL_DIR = path.join(ROOT, "art", "cloud-pet", "pool");
const WEB_POOL_DIR = path.join(ROOT, "web", "public", "cloud-pets", "pool");

// 这 19 个是 51 → 70 之间新加的(读 content/pets/*.json + breedFeatures.ts 校对)
const BREEDS = [
  // 犬 4
  { slug: "yorkshire-terrier", category: "dog", en: "Yorkshire Terrier", zh: "约克夏梗",
    features: "Yorkshire Terrier: tiny toy size, long silky straight steel-blue and tan coat, small V-shaped erect ears, confident terrier expression, compact sturdy build, dainty legs",
    deco: "paw prints and bones and leaves" },
  { slug: "maltese", category: "dog", en: "Maltese", zh: "马尔济斯",
    features: "Maltese: tiny toy size, long pure white silky straight flowing coat, round black eyes, black button nose, drop ears covered in long hair, compact body, plumed tail over back",
    deco: "paw prints and bones and leaves" },
  { slug: "shih-tzu", category: "dog", en: "Shih Tzu", zh: "西施犬",
    features: "Shih Tzu: small toy size, long flowing double coat in many colors, short muzzle with underbite, large round dark eyes, drop ears heavily feathered, sturdy compact body, curled tail over back",
    deco: "paw prints and bones and leaves" },
  { slug: "pug", category: "dog", en: "Pug", zh: "巴哥犬",
    features: "Pug: small compact square build, short fawn or black smooth coat, distinctive flat wrinkled face, large round dark prominent eyes, small folded ears, tightly curled double-curl tail",
    deco: "paw prints and bones and leaves" },
  { slug: "beagle", category: "dog", en: "Beagle", zh: "比格犬",
    features: "Beagle: medium size, tricolor (black/tan/white) or lemon/white short smooth coat, long soft drop ears, gentle pleading brown eyes, sturdy muscular build, white-tipped tail",
    deco: "paw prints and bones and leaves" },
  { slug: "boxer", category: "dog", en: "Boxer", zh: "拳师犬",
    features: "Boxer: medium-large athletic muscular build, short fawn or brindle smooth coat, distinctive short flat pushed-in muzzle with undershot jaw, dark mask on face, cropped or natural ears, docked tail",
    deco: "paw prints and bones and leaves" },

  // 猫 4
  { slug: "scottish-fold", category: "cat", en: "Scottish Fold", zh: "苏格兰折耳猫",
    features: "Scottish Fold: medium size, dense plush coat in many colors, distinctive folded flat ears lying forward against head, large round eyes, rounded compact body, short legs, thick tail",
    deco: "paw prints and fish bones and feathers" },
  { slug: "munchkin", category: "cat", en: "Munchkin", zh: "曼基康矮脚猫",
    features: "Munchkin: small size, short legs (noticeably shorter than normal), short or long coat in many colors, walnut-shaped eyes, triangular head with rounded contours, plumed tail carried high",
    deco: "paw prints and fish bones and feathers" },
  { slug: "russian-blue", category: "cat", en: "Russian Blue", zh: "俄罗斯蓝猫",
    features: "Russian Blue: medium size, distinctive solid blue-grey short dense plush double coat with silver-tipped guard hairs, vivid emerald green eyes, wedge-shaped head with flat skull, large pointed ears set vertically, long legs, slim elegant body",
    deco: "paw prints and fish bones and feathers" },
  { slug: "bengal", category: "cat", en: "Bengal", zh: "孟加拉豹猫",
    features: "Bengal: medium-large size, short dense soft pelt-like coat with distinctive rosette or marbled wild leopard/spotted markings on orange/golden background, muscular athletic build, small rounded ears, black-tipped tail",
    deco: "paw prints and fish bones and feathers" },

  // 小型哺乳 4
  { slug: "sugar-glider", category: "small-mammal", en: "Sugar Glider", zh: "蜜袋鼯",
    features: "Sugar Glider: tiny marsupial, soft grey coat with black dorsal stripe from nose to tail, large round black eyes, large thin patagium (gliding membrane) between front and back legs, long prehensile tail, small pink paws",
    deco: "small leaves and seeds" },
  { slug: "capybara", category: "small-mammal", en: "Capybara", zh: "水豚",
    features: "Capybara: largest rodent, coarse sparse brown fur, blunt rounded snout, small rounded ears set high on head, small dark eyes, barrel-shaped stocky body, no visible tail, slightly webbed feet",
    deco: "small leaves and seeds" },
  { slug: "prairie-dog", category: "small-mammal", en: "Prairie Dog", zh: "草原土拨鼠",
    features: "Prairie Dog: medium rodent, light brown to tan short fur, small rounded ears, large dark eyes, short black-tipped tail, strong short legs with sharp claws for digging, alert upright posture",
    deco: "small leaves and seeds" },
  { slug: "tenrec", category: "small-mammal", en: "Tenrec", zh: "马岛猬",
    features: "Tenrec: small mammal, long pointed mobile snout, small bright eyes, small rounded ears, spiny bristly fur in browns and creams, short legs, rat-like or hedgehog-like appearance depending on species",
    deco: "small leaves and seeds" },

  // 鸟 3
  { slug: "canary", category: "bird", en: "Canary", zh: "金丝雀",
    features: "Canary: small songbird, bright yellow (most common) or orange/white plumage, compact rounded body, short conical beak, small dark eyes, long tail feathers relative to body, perching feet",
    deco: "feathers and twigs" },
  { slug: "macaw", category: "bird", en: "Macaw", zh: "金刚鹦鹉",
    features: "Macaw: large parrot, brilliantly colored plumage in blue/yellow/scarlet/green with bare facial patch of white/white-and-black skin patterned with small feather lines, very large powerful hooked black beak, long graduated tail, strong zygodactyl feet",
    deco: "feathers and twigs" },
  { slug: "zebra-finch", category: "bird", en: "Zebra Finch", zh: "斑胸草雀",
    features: "Zebra Finch: tiny finch, grey body with distinctive black-and-white barred tail, chestnut cheek patches, white-spotted black breast band (in males), orange-red beak, small dark eyes, plump rounded body",
    deco: "feathers and twigs" },

  // 爬 2
  { slug: "corn-snake", category: "reptile", en: "Corn Snake", zh: "玉米蛇",
    features: "Corn Snake: slender medium-sized snake, distinctive orange/red/brown saddle-shaped blotches on lighter cream/grey background with black edging, smooth scales, round pupils, checkered black-and-white belly pattern, slender head",
    deco: "scales and stones" },
  { slug: "axolotl", category: "reptile", en: "Axolotl", zh: "墨西哥钝口螈",
    features: "Axolotl: aquatic salamander that retains larval features throughout life, smooth moist skin in pink/white/golden/dark grey, distinctive feathery external gills (3 pairs of frilly pink/red gill stalks) on sides of head, wide flat head, lidless eyes, smiling face, long flat tail fin for swimming",
    deco: "scales and stones" },
];

const NAME_POOLS = {
  dog: ["豆豆", "布丁", "可乐"],
  cat: ["圆圆", "墨墨", "糯米"],
  "small-mammal": ["糖糖", "麦麦", "果冻"],
  bird: ["啾啾", "飞飞", "翠翠"],
  reptile: ["龙龙", "小岩", "沙沙"],
};

const PERSONALITIES = [
  { key: "curious", text: "playful and curious expression, bright alert eyes" },
  { key: "social", text: "gentle affectionate expression, soft loving eyes" },
  { key: "independent", text: "calm dignified expression, wise peaceful eyes" },
];

function buildPrompt(b, variantIndex) {
  const name = NAME_POOLS[b.category][variantIndex % NAME_POOLS[b.category].length];
  const personality = PERSONALITIES[variantIndex];
  return `A vintage museum specimen card aesthetic portrait of a young cute ${b.en}. Healing hand-drawn watercolor illustration with a single pet as the hero subject, occupying center 70% of the frame, looking at camera with ${personality.text}, soft natural light. **Distinctive ${b.en} features: ${b.features}.** Subtle paper texture background (oat #F5EFE0), decorative simplified frame border in warm brown #8B6F47 with hand-drawn ${b.deco} at four corners, **no extra sketch lines, clean thin border**. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Bottom-right small text "${name}" in rounded Chinese font (PingFang Rounded). Bottom-left small chip "${b.zh}" in handwritten style. Mood: warm, healing, professional yet friendly. Style: high-end museum pet portrait + healing watercolor, square 1:1 aspect, no info graphic, no charts, just one beloved pet, exactly one pet, no other animals in frame, plain paper texture background, no scenery.`;
}

function refPath(category, slug) {
  // 新 19 品种没自己的 atlas 封面图(只有 prompt .md),用相似老品种的 cover 当 reference
  // 保证风格锚定(暖棕边框 + 纸感水彩)
  const SIMILAR = {
    // 犬(maltese 和 shih-tzu 自己也没封面,用 bichon 或 samoyed 代替)
    "yorkshire-terrier": "bichon-frise",       // 玩具长毛
    "maltese": "bichon-frise",                 // 玩具纯白长毛
    "shih-tzu": "bichon-frise",                // 玩具长毛
    "pug": "french-bulldog",                   // 短毛扁脸
    "beagle": "dachshund",                     // 中型短毛
    "boxer": "labrador-retriever",             // 中大型短毛
    // 猫
    "scottish-fold": "british-shorthair",
    "munchkin": "british-shorthair",
    "russian-blue": "british-shorthair",       // solid blue-grey
    "bengal": "abyssinian",                    // wild pattern
    // 小型
    "sugar-glider": "syrian-hamster",
    "capybara": "guinea-pig",
    "prairie-dog": "syrian-hamster",
    "tenrec": "african-pygmy-hedgehog",
    // 鸟
    "canary": "budgerigar",
    "macaw": "african-grey-parrot",
    "zebra-finch": "budgerigar",
    // 爬
    "corn-snake": "ball-python",
    "axolotl": "leopard-gecko",
  };
  const effective = SIMILAR[slug] || slug;
  const dir = category === "bird" || category === "reptile" ? "bird-reptile" : category;
  return `/Users/zhurenbao/Jason/codex-workspace/pet-receiver/art/${dir}/${effective}/01-cover.png`;
}

function outputPath(slug, v) {
  // 必须用绝对路径(image_synthesize 不解析 cwd)
  return path.join(POOL_DIR, `${slug}-v${v + 1}.png`);
}

const LOCAL_EXISTING = new Set();
if (fs.existsSync(POOL_DIR)) {
  for (const f of fs.readdirSync(POOL_DIR)) LOCAL_EXISTING.add(f);
}
if (fs.existsSync(WEB_POOL_DIR)) {
  for (const f of fs.readdirSync(WEB_POOL_DIR)) LOCAL_EXISTING.add(f);
}

const out = [];
for (const b of BREEDS) {
  for (let v = 0; v < 3; v++) {
    const fname = `${b.slug}-v${v + 1}.png`;
    if (LOCAL_EXISTING.has(fname)) continue;
    out.push({
      slug: b.slug,
      category: b.category,
      variant: v + 1,
      petName: NAME_POOLS[b.category][v % NAME_POOLS[b.category].length],
      personality: PERSONALITIES[v].key,
      breedZh: b.zh,
      breedEn: b.en,
      prompt: buildPrompt(b, v),
      refImage: refPath(b.category, b.slug),
      output: outputPath(b.slug, v),
    });
  }
}

console.error(`🆕 待生成 ${out.length} 张(19 品种 × 3 变体)`);
console.log(JSON.stringify(out, null, 2));
