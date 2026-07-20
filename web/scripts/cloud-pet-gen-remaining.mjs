#!/usr/bin/env node
/**
 * web/scripts/cloud-pet-gen-remaining.mjs · 补全剩余 31 品种 × 3 = 93 张 prompt
 *
 * 用法:
 *   node scripts/cloud-pet-gen-remaining.mjs > /tmp/remaining.json
 *
 * 输出 JSON array 到 stdout(便于管道到 image_synthesize)
 */

import fs from "node:fs";
import path from "node:path";

const __dirname = import.meta.dirname;
const ROOT = path.resolve(__dirname, "..", "..");
const POOL_DIR = path.join(ROOT, "art", "cloud-pet", "pool");
const WEB_POOL_DIR = path.join(ROOT, "web", "public", "cloud-pets", "pool");

const BREEDS = [
  // cats remaining
  { slug: "ragdoll", category: "cat", en: "Ragdoll", zh: "布偶猫",
    features: "Ragdoll: semi-long silky coat in seal/blue/chocolate point, striking large blue eyes, large size, color-point pattern with lighter body, fluffy tail",
    deco: "paw prints and fish bones and feathers" },
  { slug: "siamese", category: "cat", en: "Siamese", zh: "暹罗猫",
    features: "Siamese: short sleek cream coat with dark seal/blue/chocolate points on face ears paws tail, striking almond-shaped blue eyes, long slender elegant body, large triangular ears",
    deco: "paw prints and fish bones and feathers" },
  { slug: "abyssinian", category: "cat", en: "Abyssinian", zh: "阿比西尼亚猫",
    features: "Abyssinian: short ticked reddish-brown (ruddy) agouti coat with banded hairs, lithe muscular body, alert wedge-shaped head, large pointed ears, expressive almond eyes",
    deco: "paw prints and fish bones and feathers" },
  { slug: "sphynx", category: "cat", en: "Sphynx", zh: "斯芬克斯猫",
    features: "Sphynx: hairless with wrinkled peach-fuzz skin in pink/grey/black, large lemon-shaped eyes, very large bat-like ears, muscular medium body, prominent cheekbones",
    deco: "paw prints and fish bones and feathers" },
  { slug: "exotic-shorthair", category: "cat", en: "Exotic Shorthair", zh: "异国短毛猫",
    features: "Exotic Shorthair: Persian-like flat face with short plush teddy-bear coat in many colors, round massive head, large round copper eyes, stocky cobby body",
    deco: "paw prints and fish bones and feathers" },
  { slug: "chinese-li-hua", category: "cat", en: "Chinese Li Hua", zh: "中国狸花猫",
    features: "Chinese Li Hua: short brown mackerel tabby coat with distinct M marking, athletic muscular build, round face with green-yellow almond eyes, medium tail with rings",
    deco: "paw prints and fish bones and feathers" },
  { slug: "orange-tabby", category: "cat", en: "Orange Tabby", zh: "橘猫",
    features: "Orange Tabby: short vibrant orange tabby coat with classic striped markings, round face often with chubby cheeks, gold/copper eyes, sturdy round body",
    deco: "paw prints and fish bones and feathers" },
  // small-mammal
  { slug: "syrian-hamster", category: "small-mammal", en: "Syrian Hamster", zh: "叙利亚仓鼠",
    features: "Syrian hamster: golden honey-blonde fur with soft white belly, small rounded ears, plump chubby cheeks, tiny pink paws, short tail",
    deco: "small leaves and seeds" },
  { slug: "winter-white-hamster", category: "small-mammal", en: "Winter White Hamster", zh: "加卡利亚仓鼠",
    features: "Winter White Hamster: small grey-brown coat with darker dorsal stripe, white belly, tiny rounded ears, black bead eyes, plump rounded body",
    deco: "small leaves and seeds" },
  { slug: "roborovski-hamster", category: "small-mammal", en: "Roborovski Hamster", zh: "罗伯罗夫斯基仓鼠",
    features: "Roborovski Hamster: tiny size, sandy-brown agouti coat with white belly and distinctive white eyebrow spots, small rounded ears, short stubby tail",
    deco: "small leaves and seeds" },
  { slug: "chinese-hamster", category: "small-mammal", en: "Chinese Hamster", zh: "中国仓鼠",
    features: "Chinese Hamster: small grey-brown coat with dark dorsal stripe, longer mouse-like tail than other hamsters, pointed snout, dark beady eyes",
    deco: "small leaves and seeds" },
  { slug: "guinea-pig", category: "small-mammal", en: "Guinea Pig", zh: "豚鼠",
    features: "Guinea Pig: short tricolor or solid coat in many colors, plump rounded body with no visible tail, small petal-like ears, gentle round eyes, small sturdy legs",
    deco: "small leaves and seeds" },
  { slug: "dutch-rabbit", category: "small-mammal", en: "Dutch Rabbit", zh: "荷兰兔",
    features: "Dutch Rabbit: distinctive two-tone coat with white front half and colored back half, white blaze on face, compact medium build, erect ears, round dark eyes",
    deco: "small leaves and seeds" },
  { slug: "holland-lop", category: "small-mammal", en: "Holland Lop", zh: "荷兰垂耳兔",
    features: "Holland Lop: tiny size, floppy lop ears hanging beside face, compact muscular body, short dense coat in many colors, flat face with round cheeks",
    deco: "small leaves and seeds" },
  { slug: "english-angora", category: "small-mammal", en: "English Angora", zh: "英国安哥拉兔",
    features: "English Angora: very long fluffy wool coat covering entire body including face and ears, compact round body, button nose almost hidden in fur, small erect ears",
    deco: "small leaves and seeds" },
  { slug: "mini-rex", category: "small-mammal", en: "Mini Rex", zh: "迷你雷克斯兔",
    features: "Mini Rex: short plush velvety coat in many colors, compact rounded body, upright medium ears, gentle round eyes, very soft to the touch",
    deco: "small leaves and seeds" },
  { slug: "long-tailed-chinchilla", category: "small-mammal", en: "Long-tailed Chinchilla", zh: "长尾毛丝鼠",
    features: "Long-tailed Chinchilla: extremely dense soft grey-blue fur, large rounded ears, large black eyes, long bushy tail, compact round body, small delicate paws",
    deco: "small leaves and seeds" },
  { slug: "ferret", category: "small-mammal", en: "Ferret", zh: "雪貂",
    features: "Ferret: long slender body, sable/white/albino color patterns, mask markings on face, small rounded ears, bright curious eyes, short legs",
    deco: "small leaves and seeds" },
  { slug: "african-pygmy-hedgehog", category: "small-mammal", en: "African Pygmy Hedgehog", zh: "非洲迷你刺猬",
    features: "African Pygmy Hedgehog: small round body covered in short white-and-brown spines, pointed snout, tiny black eyes, small rounded ears, soft white belly fur",
    deco: "small leaves and seeds" },
  // birds
  { slug: "budgerigar", category: "bird", en: "Budgerigar", zh: "虎皮鹦鹉",
    features: "Budgerigar: small parrot with green-yellow-blue scalloped plumage, black wavy markings on wings and back, long tapered tail, small hooked beak, alert eyes",
    deco: "feathers and twigs" },
  { slug: "cockatiel", category: "bird", en: "Cockatiel", zh: "鸡尾鹦鹉",
    features: "Cockatiel: medium parrot with grey body, distinctive yellow crest and yellow face with orange cheek patches, long pointed tail, white wing patches",
    deco: "feathers and twigs" },
  { slug: "lovebird", category: "bird", en: "Lovebird", zh: "牡丹鹦鹉",
    features: "Lovebird: small chunky parrot in vibrant green/red/peach colors, short rounded tail, prominent white eye-ring, hooked red beak, stocky build",
    deco: "feathers and twigs" },
  { slug: "african-grey-parrot", category: "bird", en: "African Grey Parrot", zh: "非洲灰鹦鹉",
    features: "African Grey Parrot: medium-sized parrot with distinctive grey plumage, bright scarlet tail, white face mask, pale yellow eyes, large black hooked beak",
    deco: "feathers and twigs" },
  // reptiles
  { slug: "bearded-dragon", category: "reptile", en: "Bearded Dragon", zh: "鬃狮蜥",
    features: "Bearded Dragon: warm sandy-tan base color with subtle darker patterns, spiky beard/throat pouch, triangular head shape, rough textured scales, fat round body",
    deco: "scales and stones" },
  { slug: "leopard-gecko", category: "reptile", en: "Leopard Gecko", zh: "豹纹守宫",
    features: "Leopard Gecko: yellow base color with dark brown/black spotted leopard pattern, fat segmented tail, large lidless eyes with vertical pupils, small clawed feet",
    deco: "scales and stones" },
  { slug: "crested-gecko", category: "reptile", en: "Crested Gecko", zh: "睫角守宫",
    features: "Crested Gecko: reddish-brown to tan coloration, distinctive eyelash-like crests above eyes running down to tail, large expressive eyes, sticky toe pads, triangular head",
    deco: "scales and stones" },
  { slug: "ball-python", category: "reptile", en: "Ball Python", zh: "球蟒",
    features: "Ball Python: thick muscular body with dark brown and tan blotched pattern, small triangular head, heat-sensing pits along lips, smooth scales, stubby tail",
    deco: "scales and stones" },
  { slug: "red-eared-slider", category: "reptile", en: "Red-eared Slider", zh: "红耳巴西龟",
    features: "Red-eared Slider: olive-green shell with yellow markings, distinctive red stripe behind each eye, yellow plastron, webbed feet, long claws, striped skin",
    deco: "scales and stones" },
  { slug: "greek-tortoise", category: "reptile", en: "Greek Tortoise", zh: "希腊陆龟",
    features: "Greek Tortoise: domed shell with black and yellow scute pattern, scaly stumpy legs, small head with large dark eyes, hooked upper beak, short tail",
    deco: "scales and stones" },
  { slug: "russian-tortoise", category: "reptile", en: "Russian Tortoise", zh: "俄罗斯陆龟",
    features: "Russian Tortoise: round flattened brown/tan shell with darker scute borders, four-clawed stumpy legs, small pointed head, yellowish-tan skin",
    deco: "scales and stones" },
  { slug: "sulcata-tortoise", category: "reptile", en: "Sulcata Tortoise", zh: "苏卡达陆龟",
    features: "Sulcata Tortoise: large domed tan-brown shell with growth rings, thick scaly stumpy legs with spurs, large head, broad flat shape, wrinkled skin",
    deco: "scales and stones" },
];

const NAME_POOLS = {
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
  // 实际目录:bird + reptile 共用 bird-reptile/
  const dir = category === "bird" || category === "reptile" ? "bird-reptile" : category;
  return `/Users/zhurenbao/Jason/codex-workspace/pet-receiver/art/${dir}/${slug}/01-cover.png`;
}

function outputPath(slug, v) {
  return `art/cloud-pet/pool/${slug}-v${v + 1}.png`;
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

console.error(`🆕 待生成 ${out.length} 张`);
console.log(JSON.stringify(out, null, 2));
