/**
 * web/lib/breedFeatures.ts · 50 个品种的 AI 立绘特征描述
 *
 * 用途:云宠物生成时,作为 prompt 的 `{breed_features}` 变量。
 * 关键约束:必须是显式的英文品种特征,不能空泛。
 * 维护:新增品种时,在这里加一条;删品种时,删一条(同时删 art/ 和 content/pets/ 对应文件)。
 *
 * 装饰关键词按品类区分:
 * - dog: "paw prints and bones and leaves"
 * - cat: "paw prints and fish bones and feathers"
 * - bird: "feathers and twigs"
 * - reptile: "scales and stones"
 * - small-mammal: "small leaves and seeds"
 */

export type BreedCategory = "dog" | "cat" | "small-mammal" | "bird" | "reptile";

export type BreedFeatures = {
  slug: string;
  breedEn: string;
  breedZh: string;
  category: BreedCategory;
  features: string;
  decoration: string;
};

export const DECORATION_BY_CATEGORY: Record<BreedCategory, string> = {
  dog: "paw prints and bones and leaves",
  cat: "paw prints and fish bones and feathers",
  bird: "feathers and twigs",
  reptile: "scales and stones",
  "small-mammal": "small leaves and seeds",
};

export const BREED_FEATURES: BreedFeatures[] = [
  // ===== 犬 (15) =====
  {
    slug: "labrador-retriever",
    breedEn: "Labrador Retriever",
    breedZh: "拉布拉多寻回犬",
    category: "dog",
    features:
      "Labrador Retriever: short dense yellow/black/chocolate coat, broad head, friendly expression, otter tail, athletic muscular build",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "golden-retriever",
    breedEn: "Golden Retriever",
    breedZh: "金毛寻回犬",
    category: "dog",
    features:
      "Golden Retriever: long flowing golden coat, friendly gentle expression, broad head with soft eyes, feathery tail, sturdy balanced build",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "siberian-husky",
    breedEn: "Siberian Husky",
    breedZh: "西伯利亚雪橇犬",
    category: "dog",
    features:
      "Siberian Husky: thick double coat in black/grey/white, striking blue or multi-colored eyes, erect triangular ears, wolf-like appearance, athletic build",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "samoyed",
    breedEn: "Samoyed",
    breedZh: "萨摩耶",
    category: "dog",
    features:
      "Samoyed: thick fluffy pure white double coat, famous upturned smile mouth, dark almond eyes, erect ears, plumed tail curling over back",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "alaskan-malamute",
    breedEn: "Alaskan Malamute",
    breedZh: "阿拉斯加雪橇犬",
    category: "dog",
    features:
      "Alaskan Malamute: thick grey/black/white double coat, broad powerful head, brown almond eyes, erect ears, heavy-boned muscular build, plumed tail",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "border-collie",
    breedEn: "Border Collie",
    breedZh: "边境牧羊犬",
    category: "dog",
    features:
      "Border Collie: medium-length black and white coat, intense intelligent eyes, alert expression, athletic agile medium build, feathered tail",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "shiba-inu",
    breedEn: "Shiba Inu",
    breedZh: "柴犬",
    category: "dog",
    features:
      "Shiba Inu: short double coat in sesame/red/cream, fox-like face with round dark eyes, erect triangular ears, compact muscular build, curled tail",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "pomeranian",
    breedEn: "Pomeranian",
    breedZh: "博美犬",
    category: "dog",
    features:
      "Pomeranian: thick fluffy double coat in orange/black/white, tiny fox-like face, small erect ears, compact toy size, plumed tail over back",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "chihuahua",
    breedEn: "Chihuahua",
    breedZh: "吉娃娃",
    category: "dog",
    features:
      "Chihuahua: tiny toy size, short or long coat in fawn/black/white, large round erect ears, apple-shaped head, big expressive eyes, delicate frame",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "french-bulldog",
    breedEn: "French Bulldog",
    breedZh: "法国斗牛犬",
    category: "dog",
    features:
      "French Bulldog: short smooth coat in fawn/brindle/cream, distinctive bat ears, flat wrinkled face, compact muscular build, short tail",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "pembroke-welsh-corgi",
    breedEn: "Pembroke Welsh Corgi",
    breedZh: "彭布罗克威尔士柯基犬",
    category: "dog",
    features:
      "Pembroke Welsh Corgi: short legs and long body, double coat in red/sable/tri-color, large erect pointed ears, foxy face, short docked tail",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "dachshund",
    breedEn: "Dachshund",
    breedZh: "腊肠犬",
    category: "dog",
    features:
      "Dachshund: very short legs and elongated body, smooth/long/wire coat in red/black/tan, long floppy ears, alert intelligent expression",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "bichon-frise",
    breedEn: "Bichon Frise",
    breedZh: "比熊犬",
    category: "dog",
    features:
      "Bichon Frise: fluffy white powder-puff coat, round black eyes, black button nose, drop ears, plumed tail curved over back, small cheerful build",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "toy-poodle",
    breedEn: "Toy Poodle",
    breedZh: "玩具贵宾犬",
    category: "dog",
    features:
      "Toy Poodle: curly dense coat in white/black/apricot, often with classic pom-pom grooming, long elegant muzzle, dark oval eyes, small refined build",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "miniature-schnauzer",
    breedEn: "Miniature Schnauzer",
    breedZh: "迷你雪纳瑞",
    category: "dog",
    features:
      "Miniature Schnauzer: wiry double coat in salt-and-pepper/black, distinctive bushy beard and eyebrows, V-shaped folded ears, rectangular head, docked tail",
    decoration: DECORATION_BY_CATEGORY.dog,
  },

  // ===== 猫 (12) =====
  {
    slug: "british-shorthair",
    breedEn: "British Shorthair",
    breedZh: "英国短毛猫",
    category: "cat",
    features:
      "British Shorthair: solid blue-grey (slate blue) plush dense coat, iconic cobby round body shape, broad chest, round face with chubby cheeks, large round copper eyes, short thick legs",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "american-shorthair",
    breedEn: "American Shorthair",
    breedZh: "美国短毛猫",
    category: "cat",
    features:
      "American Shorthair: classic silver tabby coat with bold markings, athletic medium build, round face with full cheeks, large round eyes, medium tail with rings",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "persian",
    breedEn: "Persian",
    breedZh: "波斯猫",
    category: "cat",
    features:
      "Persian: long flowing coat in white/cream/grey, extremely flat face with pushed-in nose, large round copper eyes, short sturdy legs, fluffy tail",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "persian-silver-chinchilla",
    breedEn: "Persian Silver Chinchilla",
    breedZh: "银渐层波斯猫",
    category: "cat",
    features:
      "Persian Silver Chinchilla: long white coat with silver-tipped tips creating shimmering effect, flat Persian face, large emerald green eyes with black rims, pink nose",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "maine-coon",
    breedEn: "Maine Coon",
    breedZh: "缅因猫",
    category: "cat",
    features:
      "Maine Coon: large size, long shaggy brown tabby coat, distinctive lynx-tipped ears with tufts, long bushy raccoon-like tail, rectangular muscular body",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "ragdoll",
    breedEn: "Ragdoll",
    breedZh: "布偶猫",
    category: "cat",
    features:
      "Ragdoll: semi-long silky coat in seal/blue/chocolate point, striking large blue eyes, large size, color-point pattern with lighter body, fluffy tail",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "siamese",
    breedEn: "Siamese",
    breedZh: "暹罗猫",
    category: "cat",
    features:
      "Siamese: short sleek cream coat with dark seal/blue/chocolate points on face ears paws tail, striking almond-shaped blue eyes, long slender elegant body, large triangular ears",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "abyssinian",
    breedEn: "Abyssinian",
    breedZh: "阿比西尼亚猫",
    category: "cat",
    features:
      "Abyssinian: short ticked reddish-brown (ruddy) agouti coat with banded hairs, lithe muscular body, alert wedge-shaped head, large pointed ears, expressive almond eyes",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "sphynx",
    breedEn: "Sphynx",
    breedZh: "斯芬克斯猫",
    category: "cat",
    features:
      "Sphynx: hairless with wrinkled peach-fuzz skin in pink/grey/black, large lemon-shaped eyes, very large bat-like ears, muscular medium body, prominent cheekbones",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "exotic-shorthair",
    breedEn: "Exotic Shorthair",
    breedZh: "异国短毛猫",
    category: "cat",
    features:
      "Exotic Shorthair: Persian-like flat face with short plush teddy-bear coat in many colors, round massive head, large round copper eyes, stocky cobby body",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "chinese-li-hua",
    breedEn: "Chinese Li Hua",
    breedZh: "中国狸花猫",
    category: "cat",
    features:
      "Chinese Li Hua: short brown mackerel tabby coat with distinct M marking, athletic muscular build, round face with green-yellow almond eyes, medium tail with rings",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "orange-tabby",
    breedEn: "Orange Tabby",
    breedZh: "橘猫",
    category: "cat",
    features:
      "Orange Tabby: short vibrant orange tabby coat with classic striped markings, round face often with chubby cheeks, gold/copper eyes, sturdy round body",
    decoration: DECORATION_BY_CATEGORY.cat,
  },

  // ===== 小型哺乳 (12) =====
  {
    slug: "syrian-hamster",
    breedEn: "Syrian Hamster",
    breedZh: "叙利亚仓鼠",
    category: "small-mammal",
    features:
      "Syrian hamster: golden honey-blonde fur with soft white belly, small rounded ears, plump chubby cheeks, tiny pink paws, short tail",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "winter-white-hamster",
    breedEn: "Winter White Hamster",
    breedZh: "加卡利亚仓鼠",
    category: "small-mammal",
    features:
      "Winter White Hamster: small grey-brown coat with darker dorsal stripe, white belly, tiny rounded ears, black bead eyes, plump rounded body",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "roborovski-hamster",
    breedEn: "Roborovski Hamster",
    breedZh: "罗伯罗夫斯基仓鼠",
    category: "small-mammal",
    features:
      "Roborovski Hamster: tiny size, sandy-brown agouti coat with white belly and distinctive white eyebrow spots, small rounded ears, short stubby tail",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "chinese-hamster",
    breedEn: "Chinese Hamster",
    breedZh: "中国仓鼠",
    category: "small-mammal",
    features:
      "Chinese Hamster: small grey-brown coat with dark dorsal stripe, longer mouse-like tail than other hamsters, pointed snout, dark beady eyes",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "guinea-pig",
    breedEn: "Guinea Pig",
    breedZh: "豚鼠",
    category: "small-mammal",
    features:
      "Guinea Pig: short tricolor or solid coat in many colors, plump rounded body with no visible tail, small petal-like ears, gentle round eyes, small sturdy legs",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "dutch-rabbit",
    breedEn: "Dutch Rabbit",
    breedZh: "荷兰兔",
    category: "small-mammal",
    features:
      "Dutch Rabbit: distinctive two-tone coat with white front half and colored back half, white blaze on face, compact medium build, erect ears, round dark eyes",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "holland-lop",
    breedEn: "Holland Lop",
    breedZh: "荷兰垂耳兔",
    category: "small-mammal",
    features:
      "Holland Lop: tiny size, floppy lop ears hanging beside face, compact muscular body, short dense coat in many colors, flat face with round cheeks",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "english-angora",
    breedEn: "English Angora",
    breedZh: "英国安哥拉兔",
    category: "small-mammal",
    features:
      "English Angora: very long fluffy wool coat covering entire body including face and ears, compact round body, button nose almost hidden in fur, small erect ears",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "mini-rex",
    breedEn: "Mini Rex",
    breedZh: "迷你雷克斯兔",
    category: "small-mammal",
    features:
      "Mini Rex: short plush velvety coat in many colors, compact rounded body, upright medium ears, gentle round eyes, very soft to the touch",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "long-tailed-chinchilla",
    breedEn: "Long-tailed Chinchilla",
    breedZh: "长尾毛丝鼠",
    category: "small-mammal",
    features:
      "Long-tailed Chinchilla: extremely dense soft grey-blue fur, large rounded ears, large black eyes, long bushy tail, compact round body, small delicate paws",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "ferret",
    breedEn: "Ferret",
    breedZh: "雪貂",
    category: "small-mammal",
    features:
      "Ferret: long slender body, sable/white/albino color patterns, mask markings on face, small rounded ears, bright curious eyes, short legs",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "african-pygmy-hedgehog",
    breedEn: "African Pygmy Hedgehog",
    breedZh: "非洲迷你刺猬",
    category: "small-mammal",
    features:
      "African Pygmy Hedgehog: small round body covered in short white-and-brown spines, pointed snout, tiny black eyes, small rounded ears, soft white belly fur",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },

  // ===== 鸟 (4) =====
  {
    slug: "budgerigar",
    breedEn: "Budgerigar",
    breedZh: "虎皮鹦鹉",
    category: "bird",
    features:
      "Budgerigar: small parrot with green-yellow-blue scalloped plumage, black wavy markings on wings and back, long tapered tail, small hooked beak, alert eyes",
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  {
    slug: "cockatiel",
    breedEn: "Cockatiel",
    breedZh: "鸡尾鹦鹉",
    category: "bird",
    features:
      "Cockatiel: medium parrot with grey body, distinctive yellow crest and yellow face with orange cheek patches, long pointed tail, white wing patches",
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  {
    slug: "lovebird",
    breedEn: "Lovebird",
    breedZh: "牡丹鹦鹉",
    category: "bird",
    features:
      "Lovebird: small chunky parrot in vibrant green/red/peach colors, short rounded tail, prominent white eye-ring, hooked red beak, stocky build",
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  {
    slug: "african-grey-parrot",
    breedEn: "African Grey Parrot",
    breedZh: "非洲灰鹦鹉",
    category: "bird",
    features:
      "African Grey Parrot: medium-sized parrot with distinctive grey plumage, bright scarlet tail, white face mask, pale yellow eyes, large black hooked beak",
    decoration: DECORATION_BY_CATEGORY.bird,
  },

  // ===== 爬宠 (7) =====
  {
    slug: "bearded-dragon",
    breedEn: "Bearded Dragon",
    breedZh: "鬃狮蜥",
    category: "reptile",
    features:
      "Bearded Dragon: warm sandy-tan base color with subtle darker patterns, spiky beard/throat pouch, triangular head shape, rough textured scales, fat round body",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "leopard-gecko",
    breedEn: "Leopard Gecko",
    breedZh: "豹纹守宫",
    category: "reptile",
    features:
      "Leopard Gecko: yellow base color with dark brown/black spotted leopard pattern, fat segmented tail, large lidless eyes with vertical pupils, small clawed feet",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "crested-gecko",
    breedEn: "Crested Gecko",
    breedZh: "睫角守宫",
    category: "reptile",
    features:
      "Crested Gecko: reddish-brown to tan coloration, distinctive eyelash-like crests above eyes running down to tail, large expressive eyes, sticky toe pads, triangular head",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "ball-python",
    breedEn: "Ball Python",
    breedZh: "球蟒",
    category: "reptile",
    features:
      "Ball Python: thick muscular body with dark brown and tan blotched pattern, small triangular head, heat-sensing pits along lips, smooth scales, stubby tail",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "red-eared-slider",
    breedEn: "Red-eared Slider",
    breedZh: "红耳巴西龟",
    category: "reptile",
    features:
      "Red-eared Slider: olive-green shell with yellow markings, distinctive red stripe behind each eye, yellow plastron, webbed feet, long claws, striped skin",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "greek-tortoise",
    breedEn: "Greek Tortoise",
    breedZh: "希腊陆龟",
    category: "reptile",
    features:
      "Greek Tortoise: domed shell with black and yellow scute pattern, scaly stumpy legs, small head with large dark eyes, hooked upper beak, short tail",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "russian-tortoise",
    breedEn: "Russian Tortoise",
    breedZh: "俄罗斯陆龟",
    category: "reptile",
    features:
      "Russian Tortoise: round flattened brown/tan shell with darker scute borders, four-clawed stumpy legs, small pointed head, yellowish-tan skin",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "sulcata-tortoise",
    breedEn: "Sulcata Tortoise",
    breedZh: "苏卡达陆龟",
    category: "reptile",
    features:
      "Sulcata Tortoise: large domed tan-brown shell with growth rings, thick scaly stumpy legs with spurs, large head, broad flat shape, wrinkled skin",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
];

/** 按 slug 查表,找不到时返回 null */
export function getBreedFeatures(slug: string): BreedFeatures | null {
  return BREED_FEATURES.find((b) => b.slug === slug) ?? null;
}

/** 所有品种按品类分组 */
export function getBreedsByCategory(): Record<BreedCategory, BreedFeatures[]> {
  const out: Record<BreedCategory, BreedFeatures[]> = {
    dog: [],
    cat: [],
    "small-mammal": [],
    bird: [],
    reptile: [],
  };
  for (const b of BREED_FEATURES) {
    out[b.category].push(b);
  }
  return out;
}
