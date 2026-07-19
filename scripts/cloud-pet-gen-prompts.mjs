#!/usr/bin/env node
/**
 * scripts/cloud-pet-gen-prompts.mjs
 *
 * 给 50 个品种 × 3 变体 = 150 条云宠物生成 prompt 输出到 JSON。
 * agent 读这个 JSON,顺序调 image_synthesize 跑 150 张图,落到指定路径。
 *
 * 用法:
 *   node scripts/cloud-pet-gen-prompts.mjs                  # 全部 150 条
 *   node scripts/cloud-pet-gen-prompts.mjs --remaining      # 跳过 art/cloud-pet/samples/ 已存在的(用作增量)
 *   node scripts/cloud-pet-gen-prompts.mjs --category dog   # 只跑一个品类
 *
 * 输出:scripts/cloud-pet-pool.json(每条含 prompt / output / ref / 名字 / 性格)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ===== 配置:从 web/lib/breedFeatures.ts 导入(避免重复维护) =====
// 这里内联一份简化版(M1 demo 用),生产建议直接 import { BREED_FEATURES }
const BREEDS = [
  // dog
  { slug: "labrador-retriever", category: "dog", en: "Labrador Retriever", zh: "拉布拉多寻回犬",
    features: "Labrador Retriever: short dense yellow/black/chocolate coat, broad head, friendly expression, otter tail, athletic muscular build",
    deco: "paw prints and bones and leaves" },
  { slug: "golden-retriever", category: "dog", en: "Golden Retriever", zh: "金毛寻回犬",
    features: "Golden Retriever: long flowing golden coat, friendly gentle expression, broad head with soft eyes, feathery tail, sturdy balanced build",
    deco: "paw prints and bones and leaves" },
  { slug: "siberian-husky", category: "dog", en: "Siberian Husky", zh: "西伯利亚雪橇犬",
    features: "Siberian Husky: thick double coat in black/grey/white, striking blue or multi-colored eyes, erect triangular ears, wolf-like appearance, athletic build",
    deco: "paw prints and bones and leaves" },
  { slug: "samoyed", category: "dog", en: "Samoyed", zh: "萨摩耶",
    features: "Samoyed: thick fluffy pure white double coat, famous upturned smile mouth, dark almond eyes, erect ears, plumed tail curling over back",
    deco: "paw prints and bones and leaves" },
  { slug: "alaskan-malamute", category: "dog", en: "Alaskan Malamute", zh: "阿拉斯加雪橇犬",
    features: "Alaskan Malamute: thick grey/black/white double coat, broad powerful head, brown almond eyes, erect ears, heavy-boned muscular build, plumed tail",
    deco: "paw prints and bones and leaves" },
  { slug: "border-collie", category: "dog", en: "Border Collie", zh: "边境牧羊犬",
    features: "Border Collie: medium-length black and white coat, intense intelligent eyes, alert expression, athletic agile medium build, feathered tail",
    deco: "paw prints and bones and leaves" },
  { slug: "shiba-inu", category: "dog", en: "Shiba Inu", zh: "柴犬",
    features: "Shiba Inu: short double coat in sesame/red/cream, fox-like face with round dark eyes, erect triangular ears, compact muscular build, curled tail",
    deco: "paw prints and bones and leaves" },
  { slug: "pomeranian", category: "dog", en: "Pomeranian", zh: "博美犬",
    features: "Pomeranian: thick fluffy double coat in orange/black/white, tiny fox-like face, small erect ears, compact toy size, plumed tail over back",
    deco: "paw prints and bones and leaves" },
  { slug: "chihuahua", category: "dog", en: "Chihuahua", zh: "吉娃娃",
    features: "Chihuahua: tiny toy size, short or long coat in fawn/black/white, large round erect ears, apple-shaped head, big expressive eyes, delicate frame",
    deco: "paw prints and bones and leaves" },
  { slug: "french-bulldog", category: "dog", en: "French Bulldog", zh: "法国斗牛犬",
    features: "French Bulldog: short smooth coat in fawn/brindle/cream, distinctive bat ears, flat wrinkled face, compact muscular build, short tail",
    deco: "paw prints and bones and leaves" },
  { slug: "pembroke-welsh-corgi", category: "dog", en: "Pembroke Welsh Corgi", zh: "彭布罗克威尔士柯基犬",
    features: "Pembroke Welsh Corgi: short legs and long body, double coat in red/sable/tri-color, large erect pointed ears, foxy face, short docked tail",
    deco: "paw prints and bones and leaves" },
  { slug: "dachshund", category: "dog", en: "Dachshund", zh: "腊肠犬",
    features: "Dachshund: very short legs and elongated body, smooth/long/wire coat in red/black/tan, long floppy ears, alert intelligent expression",
    deco: "paw prints and bones and leaves" },
  { slug: "bichon-frise", category: "dog", en: "Bichon Frise", zh: "比熊犬",
    features: "Bichon Frise: fluffy white powder-puff coat, round black eyes, black button nose, drop ears, plumed tail curved over back, small cheerful build",
    deco: "paw prints and bones and leaves" },
  { slug: "toy-poodle", category: "dog", en: "Toy Poodle", zh: "玩具贵宾犬",
    features: "Toy Poodle: curly dense coat in white/black/apricot, often with classic pom-pom grooming, long elegant muzzle, dark oval eyes, small refined build",
    deco: "paw prints and bones and leaves" },
  { slug: "miniature-schnauzer", category: "dog", en: "Miniature Schnauzer", zh: "迷你雪纳瑞",
    features: "Miniature Schnauzer: wiry double coat in salt-and-pepper/black, distinctive bushy beard and eyebrows, V-shaped folded ears, rectangular head, docked tail",
    deco: "paw prints and bones and leaves" },
  // cat
  { slug: "british-shorthair", category: "cat", en: "British Shorthair", zh: "英国短毛猫",
    features: "British Shorthair: solid blue-grey (slate blue) plush dense coat, iconic cobby round body shape, broad chest, round face with chubby cheeks, large round copper eyes, short thick legs",
    deco: "paw prints and fish bones and feathers" },
  { slug: "american-shorthair", category: "cat", en: "American Shorthair", zh: "美国短毛猫",
    features: "American Shorthair: classic silver tabby coat with bold markings, athletic medium build, round face with full cheeks, large round eyes, medium tail with rings",
    deco: "paw prints and fish bones and feathers" },
  { slug: "persian", category: "cat", en: "Persian", zh: "波斯猫",
    features: "Persian: long flowing coat in white/cream/grey, extremely flat face with pushed-in nose, large round copper eyes, short sturdy legs, fluffy tail",
    deco: "paw prints and fish bones and feathers" },
  { slug: "persian-silver-chinchilla", category: "cat", en: "Persian Silver Chinchilla", zh: "银渐层波斯猫",
    features: "Persian Silver Chinchilla: long white coat with silver-tipped tips creating shimmering effect, flat Persian face, large emerald green eyes with black rims, pink nose",
    deco: "paw prints and fish bones and feathers" },
  { slug: "maine-coon", category: "cat", en: "Maine Coon", zh: "缅因猫",
    features: "Maine Coon: large size, long shaggy brown tabby coat, distinctive lynx-tipped ears with tufts, long bushy raccoon-like tail, rectangular muscular body",
    deco: "paw prints and fish bones and feathers" },
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
  // bird
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
  // reptile
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

const CATEGORY_DIR = (c) => c === "small-mammal" ? "small-mammal" : c;

// 3 个变体的轮换名字库(每品种 3 个名字,保证"看上去不同人养的")
// 这里按 50 品种顺序循环,实际生成时图片只是参考底,真正名字由用户在 /adopt 填
const NAME_POOLS = {
  dog: ["豆豆", "布丁", "可乐", "糖糖", "小白", "小黑", "麦兜", "奶糖", "薯条", "奶茶", "毛球", "雪球", "巧克力", "柚子", "苹果"],
  cat: ["圆圆", "墨墨", "糯米", "咪咪", "雪糕", "咖啡", "柚子", "小七", "悠悠", "橘宝", "芋圆", "豆花", "团子", "小爱", "奶盖"],
  "small-mammal": ["糖糖", "麦麦", "果冻", "糯米", "小汤", "奶茶", "棉花", "椰子", "豆豆", "玉米", "小米", "球球", "毛球", "奶团", "小七"],
  bird: ["啾啾", "飞飞", "翠翠", "小羽", "蓝蓝", "豆豆", "皮皮", "闪闪", "花花", "小七", "麦麦", "跳跳", "小米", "悠悠", "豆芽"],
  reptile: ["龙龙", "小岩", "沙沙", "石石", "铁甲", "火山", "琥珀", "小岩", "龙井", "芝麻", "阿龙", "糖糖", "岩石", "麦芽", "小帅"],
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

function buildRef(category, slug) {
  // 优先用主仓库的 art(避免 worktree 没 PNG)
  // 注意:production 跑时应该在主仓库跑,worktree 的 art/ 是 gitignored
  return `/Users/zhurenbao/Jason/codex-workspace/pet-receiver/art/${CATEGORY_DIR(category)}/${slug}/01-cover.png`;
}

function buildOutput(slug, variantIndex) {
  return `art/cloud-pet/pool/${slug}-v${variantIndex + 1}.png`;
}

// ===== Main =====
const args = process.argv.slice(2);
const CATEGORY_FILTER = args.includes("--category") ? args[args.indexOf("--category") + 1] : null;
const ONLY_REMAINING = args.includes("--remaining");

const SAMPLE_DIR = path.join(ROOT, "art", "cloud-pet", "pool");
const EXISTING = new Set(
  fs.existsSync(SAMPLE_DIR) ? fs.readdirSync(SAMPLE_DIR) : []
);

const out = [];
for (const b of BREEDS) {
  if (CATEGORY_FILTER && b.category !== CATEGORY_FILTER) continue;
  for (let v = 0; v < 3; v++) {
    const fileName = `${b.slug}-v${v + 1}.png`;
    if (ONLY_REMAINING && EXISTING.has(fileName)) continue;
    out.push({
      slug: b.slug,
      category: b.category,
      variant: v + 1,
      petName: NAME_POOLS[b.category][v % NAME_POOLS[b.category].length],
      personality: PERSONALITIES[v].key,
      breedZh: b.zh,
      breedEn: b.en,
      prompt: buildPrompt(b, v),
      refImage: buildRef(b.category, b.slug),
      output: buildOutput(b.slug, v),
    });
  }
}

const outPath = path.join(__dirname, "cloud-pet-pool.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf-8");
console.log(`✅ ${out.length} 条 prompt 写入 ${outPath}`);
console.log(`   完整统计: 50 品种 × 3 变体 = 150 条`);
console.log(`   跑满 batches: ${Math.ceil(out.length / 10)} 个 (每 batch 10 条)`);
