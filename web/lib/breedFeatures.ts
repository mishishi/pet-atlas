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
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "golden-retriever",
    breedEn: "Golden Retriever",
    breedZh: "金毛寻回犬",
    category: "dog",
    features:
      "Golden Retriever: long flowing golden coat, friendly gentle expression, broad head with soft eyes, feathery tail, sturdy balanced build",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "siberian-husky",
    breedEn: "Siberian Husky",
    breedZh: "西伯利亚雪橇犬",
    category: "dog",
    features:
      "Siberian Husky: thick double coat in black/grey/white, striking blue or multi-colored eyes, erect triangular ears, wolf-like appearance, athletic build",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "samoyed",
    breedEn: "Samoyed",
    breedZh: "萨摩耶",
    category: "dog",
    features:
      "Samoyed: thick fluffy pure white double coat, famous upturned smile mouth, dark almond eyes, erect ears, plumed tail curling over back",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "alaskan-malamute",
    breedEn: "Alaskan Malamute",
    breedZh: "阿拉斯加雪橇犬",
    category: "dog",
    features:
      "Alaskan Malamute: thick grey/black/white double coat, broad powerful head, brown almond eyes, erect ears, heavy-boned muscular build, plumed tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "border-collie",
    breedEn: "Border Collie",
    breedZh: "边境牧羊犬",
    category: "dog",
    features:
      "Border Collie: medium-length black and white coat, intense intelligent eyes, alert expression, athletic agile medium build, feathered tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "shiba-inu",
    breedEn: "Shiba Inu",
    breedZh: "柴犬",
    category: "dog",
    features:
      "Shiba Inu: short double coat in sesame/red/cream, fox-like face with round dark eyes, erect triangular ears, compact muscular build, curled tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "pomeranian",
    breedEn: "Pomeranian",
    breedZh: "博美犬",
    category: "dog",
    features:
      "Pomeranian: thick fluffy double coat in orange/black/white, tiny fox-like face, small erect ears, compact toy size, plumed tail over back",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "chihuahua",
    breedEn: "Chihuahua",
    breedZh: "吉娃娃",
    category: "dog",
    features:
      "Chihuahua: tiny toy size, short or long coat in fawn/black/white, large round erect ears, apple-shaped head, big expressive eyes, delicate frame",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "french-bulldog",
    breedEn: "French Bulldog",
    breedZh: "法国斗牛犬",
    category: "dog",
    features:
      "French Bulldog: short smooth coat in fawn/brindle/cream, distinctive bat ears, flat wrinkled face, compact muscular build, short tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "pembroke-welsh-corgi",
    breedEn: "Pembroke Welsh Corgi",
    breedZh: "彭布罗克威尔士柯基犬",
    category: "dog",
    features:
      "Pembroke Welsh Corgi: short legs and long body, double coat in red/sable/tri-color, large erect pointed ears, foxy face, short docked tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "dachshund",
    breedEn: "Dachshund",
    breedZh: "腊肠犬",
    category: "dog",
    features:
      "Dachshund: very short legs and elongated body, smooth/long/wire coat in red/black/tan, long floppy ears, alert intelligent expression",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "bichon-frise",
    breedEn: "Bichon Frise",
    breedZh: "比熊犬",
    category: "dog",
    features:
      "Bichon Frise: fluffy white powder-puff coat, round black eyes, black button nose, drop ears, plumed tail curved over back, small cheerful build",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "toy-poodle",
    breedEn: "Toy Poodle",
    breedZh: "玩具贵宾犬",
    category: "dog",
    features:
      "Toy Poodle: curly dense coat in white/black/apricot, often with classic pom-pom grooming, long elegant muzzle, dark oval eyes, small refined build",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "miniature-schnauzer",
    breedEn: "Miniature Schnauzer",
    breedZh: "迷你雪纳瑞",
    category: "dog",
    features:
      "Miniature Schnauzer: wiry double coat in salt-and-pepper/black, distinctive bushy beard and eyebrows, V-shaped folded ears, rectangular head, docked tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },

  // ===== 猫 (12) =====
  {
    slug: "british-shorthair",
    breedEn: "British Shorthair",
    breedZh: "英国短毛猫",
    category: "cat",
    features:
      "British Shorthair: solid blue-grey (slate blue) plush dense coat, iconic cobby round body shape, broad chest, round face with chubby cheeks, large round copper eyes, short thick legs",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "american-shorthair",
    breedEn: "American Shorthair",
    breedZh: "美国短毛猫",
    category: "cat",
    features:
      "American Shorthair: classic silver tabby coat with bold markings, athletic medium build, round face with full cheeks, large round eyes, medium tail with rings",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "persian",
    breedEn: "Persian",
    breedZh: "波斯猫",
    category: "cat",
    features:
      "Persian: long flowing coat in white/cream/grey, extremely flat face with pushed-in nose, large round copper eyes, short sturdy legs, fluffy tail",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "persian-silver-chinchilla",
    breedEn: "Persian Silver Chinchilla",
    breedZh: "银渐层波斯猫",
    category: "cat",
    features:
      "Persian Silver Chinchilla: long white coat with silver-tipped tips creating shimmering effect, flat Persian face, large emerald green eyes with black rims, pink nose",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "maine-coon",
    breedEn: "Maine Coon",
    breedZh: "缅因猫",
    category: "cat",
    features:
      "Maine Coon: large size, long shaggy brown tabby coat, distinctive lynx-tipped ears with tufts, long bushy raccoon-like tail, rectangular muscular body",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "ragdoll",
    breedEn: "Ragdoll",
    breedZh: "布偶猫",
    category: "cat",
    features:
      "Ragdoll: semi-long silky coat in seal/blue/chocolate point, striking large blue eyes, large size, color-point pattern with lighter body, fluffy tail",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "siamese",
    breedEn: "Siamese",
    breedZh: "暹罗猫",
    category: "cat",
    features:
      "Siamese: short sleek cream coat with dark seal/blue/chocolate points on face ears paws tail, striking almond-shaped blue eyes, long slender elegant body, large triangular ears",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "abyssinian",
    breedEn: "Abyssinian",
    breedZh: "阿比西尼亚猫",
    category: "cat",
    features:
      "Abyssinian: short ticked reddish-brown (ruddy) agouti coat with banded hairs, lithe muscular body, alert wedge-shaped head, large pointed ears, expressive almond eyes",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "sphynx",
    breedEn: "Sphynx",
    breedZh: "斯芬克斯猫",
    category: "cat",
    features:
      "Sphynx: hairless with wrinkled peach-fuzz skin in pink/grey/black, large lemon-shaped eyes, very large bat-like ears, muscular medium body, prominent cheekbones",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "exotic-shorthair",
    breedEn: "Exotic Shorthair",
    breedZh: "异国短毛猫",
    category: "cat",
    features:
      "Exotic Shorthair: Persian-like flat face with short plush teddy-bear coat in many colors, round massive head, large round copper eyes, stocky cobby body",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "chinese-li-hua",
    breedEn: "Chinese Li Hua",
    breedZh: "中国狸花猫",
    category: "cat",
    features:
      "Chinese Li Hua: short brown mackerel tabby coat with distinct M marking, athletic muscular build, round face with green-yellow almond eyes, medium tail with rings",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "orange-tabby",
    breedEn: "Orange Tabby",
    breedZh: "橘猫",
    category: "cat",
    features:
      "Orange Tabby: short vibrant orange tabby coat with classic striped markings, round face often with chubby cheeks, gold/copper eyes, sturdy round body",
    decoration: DECORATION_BY_CATEGORY["cat"],
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
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "cockatiel",
    breedEn: "Cockatiel",
    breedZh: "鸡尾鹦鹉",
    category: "bird",
    features:
      "Cockatiel: medium parrot with grey body, distinctive yellow crest and yellow face with orange cheek patches, long pointed tail, white wing patches",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "lovebird",
    breedEn: "Lovebird",
    breedZh: "牡丹鹦鹉",
    category: "bird",
    features:
      "Lovebird: small chunky parrot in vibrant green/red/peach colors, short rounded tail, prominent white eye-ring, hooked red beak, stocky build",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "african-grey-parrot",
    breedEn: "African Grey Parrot",
    breedZh: "非洲灰鹦鹉",
    category: "bird",
    features:
      "African Grey Parrot: medium-sized parrot with distinctive grey plumage, bright scarlet tail, white face mask, pale yellow eyes, large black hooked beak",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },

  // ===== 爬宠 (7) =====
  {
    slug: "bearded-dragon",
    breedEn: "Bearded Dragon",
    breedZh: "鬃狮蜥",
    category: "reptile",
    features:
      "Bearded Dragon: warm sandy-tan base color with subtle darker patterns, spiky beard/throat pouch, triangular head shape, rough textured scales, fat round body",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "leopard-gecko",
    breedEn: "Leopard Gecko",
    breedZh: "豹纹守宫",
    category: "reptile",
    features:
      "Leopard Gecko: yellow base color with dark brown/black spotted leopard pattern, fat segmented tail, large lidless eyes with vertical pupils, small clawed feet",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "crested-gecko",
    breedEn: "Crested Gecko",
    breedZh: "睫角守宫",
    category: "reptile",
    features:
      "Crested Gecko: reddish-brown to tan coloration, distinctive eyelash-like crests above eyes running down to tail, large expressive eyes, sticky toe pads, triangular head",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "ball-python",
    breedEn: "Ball Python",
    breedZh: "球蟒",
    category: "reptile",
    features:
      "Ball Python: thick muscular body with dark brown and tan blotched pattern, small triangular head, heat-sensing pits along lips, smooth scales, stubby tail",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "red-eared-slider",
    breedEn: "Red-eared Slider",
    breedZh: "红耳巴西龟",
    category: "reptile",
    features:
      "Red-eared Slider: olive-green shell with yellow markings, distinctive red stripe behind each eye, yellow plastron, webbed feet, long claws, striped skin",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "greek-tortoise",
    breedEn: "Greek Tortoise",
    breedZh: "希腊陆龟",
    category: "reptile",
    features:
      "Greek Tortoise: domed shell with black and yellow scute pattern, scaly stumpy legs, small head with large dark eyes, hooked upper beak, short tail",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "russian-tortoise",
    breedEn: "Russian Tortoise",
    breedZh: "俄罗斯陆龟",
    category: "reptile",
    features:
      "Russian Tortoise: round flattened brown/tan shell with darker scute borders, four-clawed stumpy legs, small pointed head, yellowish-tan skin",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "sulcata-tortoise",
    breedEn: "Sulcata Tortoise",
    breedZh: "苏卡达陆龟",
    category: "reptile",
    features:
      "Sulcata Tortoise: large domed tan-brown shell with growth rings, thick scaly stumpy legs with spurs, large head, broad flat shape, wrinkled skin",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },

  // ===== 新增 49 品种 · 第一批 10 =====

  // 犬 (3)
  {
    slug: "yorkshire-terrier",
    breedEn: "Yorkshire Terrier",
    breedZh: "约克夏梗",
    category: "dog",
    features:
      "Yorkshire Terrier: long silky straight steel-blue and tan coat parting down the back, small toy build, erect V-shaped ears, bright dark eyes, confident terrier expression",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "maltese",
    breedEn: "Maltese",
    breedZh: "马尔济斯犬",
    category: "dog",
    features:
      "Maltese: pure white long silky single-layer coat reaching the ground, small compact toy build, round dark eyes, drop ears covered in long hair, gentle expression",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "shih-tzu",
    breedEn: "Shih Tzu",
    breedZh: "西施犬",
    category: "dog",
    features:
      "Shih Tzu: long flowing double coat in many colors, flat pushed-in face with short muzzle, large round dark eyes, drop ears heavily feathered, sturdy toy build, chrysanthemum face",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },

  // 猫 (2)
  {
    slug: "scottish-fold",
    breedEn: "Scottish Fold",
    breedZh: "苏格兰折耳猫",
    category: "cat",
    features:
      "Scottish Fold: distinctively folded forward and down ears, round head with big round eyes, dense plush coat in many colors, medium cobby build, owl-like expression",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "munchkin",
    breedEn: "Munchkin",
    breedZh: "曼基康矮脚猫",
    category: "cat",
    features:
      "Munchkin: distinctly short legs due to genetic dwarfism, normal-sized body, all coat colors and patterns, walnut-shaped eyes, medium triangular ears, low-to-ground stance",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },

  // 小型哺乳 (2)
  {
    slug: "sugar-glider",
    breedEn: "Sugar Glider",
    breedZh: "蜜袋鼯",
    category: "small-mammal",
    features:
      "Sugar Glider: small marsupial with patagium (gliding membrane) from wrists to ankles, large dark eyes for nocturnal life, soft grey-brown fur with cream belly, long prehensile tail, pointed snout",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "capybara",
    breedEn: "Capybara",
    breedZh: "水豚",
    category: "small-mammal",
    features:
      "Capybara: world's largest rodent, barrel-shaped body with sparse coarse brown fur, blunt rounded snout, small round ears, webbed feet, semi-aquatic build, calm expression",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },

  // 鸟 (2)
  {
    slug: "canary",
    breedEn: "Canary",
    breedZh: "金丝雀",
    category: "bird",
    features:
      "Canary: small songbird with smooth compact body, short conical beak, predominantly yellow or orange plumage in wild type, multiple domesticated color varieties, melodious song in males",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "macaw",
    breedEn: "Macaw",
    breedZh: "金刚鹦鹉",
    category: "bird",
    features:
      "Macaw: large parrot with long tapered tail, massive hooked beak, bare facial patch with fine feather lines, brilliant multi-color plumage in red/blue/yellow/green, powerful zygodactyl feet",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },

  // 爬虫 (1)
  {
    slug: "corn-snake",
    breedEn: "Corn Snake",
    breedZh: "玉米蛇",
    category: "reptile",
    features:
      "Corn Snake: slender non-venomous colubrid with orange-red base color and dark red saddle markings bordered in black, checkered belly pattern resembling corn kernels, smooth scales, alert round pupils",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },

  // ===== 新增第二批 9 品种(到 70) =====

  // 犬 (3)
  {
    slug: "pug",
    breedEn: "Pug",
    breedZh: "八哥犬",
    category: "dog",
    features:
      "Pug: short smooth fawn or black coat, very flat pushed-in face with deep wrinkles, large round prominent dark eyes, small drop ears, compact square muscular toy build, curled tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "beagle",
    breedEn: "Beagle",
    breedZh: "比格犬",
    category: "dog",
    features:
      "Beagle: short dense tri-color (black/tan/white) or lemon coat, medium compact hound build, long soft drop ears, expressive hazel eyes, merry alert expression, white-tipped tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "boxer",
    breedEn: "Boxer",
    breedZh: "拳师犬",
    category: "dog",
    features:
      "Boxer: short smooth fawn or brindle coat, square muscular medium build, flat pushed-in face with undershot jaw, dark brown eyes, natural or cropped ears, docked tail historically, athletic powerful build",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },

  // 猫 (2)
  {
    slug: "russian-blue",
    breedEn: "Russian Blue",
    breedZh: "俄罗斯蓝猫",
    category: "cat",
    features:
      "Russian Blue: short dense plush double coat in uniform blue-grey, slender elegant foreign build, wedge-shaped head, large wide-set vivid green eyes, large pointed ears, long tapering tail",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "bengal",
    breedEn: "Bengal",
    breedZh: "孟加拉豹猫",
    category: "cat",
    features:
      "Bengal: short dense pelt-like coat with distinctive leopard rosette or marble markings in brown/silver/snow, muscular wild-looking medium build, small rounded ears, dark-rimmed eyes in green or gold, long muscular body",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },

  // 小型哺乳 (2)
  {
    slug: "prairie-dog",
    breedEn: "Black-tailed Prairie Dog",
    breedZh: "黑尾土拨鼠",
    category: "small-mammal",
    features:
      "Prairie Dog: small ground squirrel with short tan-brown fur, distinctive black-tipped tail, alert small rounded ears, black eyes, sharp claws for digging, chubby compact body",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "tenrec",
    breedEn: "Lesser Hedgehog Tenrec",
    breedZh: "马岛猬",
    category: "small-mammal",
    features:
      "Tenrec: small Madagascar mammal resembling a tiny hedgehog, sharp spines on back and head, soft fur on belly, pointed snout with small black eyes, small rounded ears, can curl into a ball defensively",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },

  // 鸟 (1)
  {
    slug: "zebra-finch",
    breedEn: "Zebra Finch",
    breedZh: "斑胸草雀",
    category: "bird",
    features:
      "Zebra Finch: tiny songbird with grey plumage, distinctive black-and-white zebra-striped throat pattern in males, bright orange-red beak, orange cheeks, white-spotted black flanks, plump rounded body",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },

  // 爬虫 (1) - axolotl 严格说属于两栖,但归到 reptile template 4
  {
    slug: "axolotl",
    breedEn: "Axolotl",
    breedZh: "墨西哥钝口螈",
    category: "reptile",
    features:
      "Axolotl: aquatic salamander with smooth skin, six feathery external gills on each side of head, four short legs, long flat tail, pale pink/white albino or wild-type dark coloration, permanent larval features (neoteny)",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },

  // ===== 30 new breeds (C 批 1+2+3, 2026-07-23) =====
  // 犬 (8)
  {
    slug: "basset-hound",
    breedEn: "Basset Hound",
    breedZh: "巴吉度",
    category: "dog",
    features:
      "Basset Hound: short smooth tri-color or red-white coat, very short legs, extremely long droopy ears reaching past muzzle, sad droopy face with loose wrinkled skin, large heavy bone structure for short stature",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "jack-russell-terrier",
    breedEn: "Jack Russell Terrier",
    breedZh: "杰克罗素梗",
    category: "dog",
    features:
      "Jack Russell Terrier: predominantly white smooth or broken coat with black/tan markings, compact athletic small build, V-shaped drop ears, dark almond eyes, alert intense expression, docked or natural tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "english-springer-spaniel",
    breedEn: "English Springer Spaniel",
    breedZh: "英国史宾格猎犬",
    category: "dog",
    features:
      "English Springer Spaniel: medium-length liver and white or black and white coat with feathering, medium sturdy build, long drop ears, gentle soft expression, kind eyes, deep chest",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "old-english-sheepdog",
    breedEn: "Old English Sheepdog",
    breedZh: "古代英国牧羊犬",
    category: "dog",
    features:
      "Old English Sheepdog: profuse shaggy grey and white double coat covering the entire body and eyes, large square muscular build, bobbed or natural short tail, deep bark, bear-like shambling gait",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "havanese",
    breedEn: "Havanese",
    breedZh: "哈瓦那犬",
    category: "dog",
    features:
      "Havanese: long silky wavy double coat in many colors, small compact toy build, dark almond eyes, drop ears covered in long hair, plumed tail carried over back, friendly bouncy gait",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "dalmatian",
    breedEn: "Dalmatian",
    breedZh: "大麦町犬",
    category: "dog",
    features:
      "Dalmatian: short glossy white coat with distinctive black or liver spots, athletic medium build, drop ears, alert intelligent expression, deep chest, tapered tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "doberman-pinscher",
    breedEn: "Doberman Pinscher",
    breedZh: "杜宾犬",
    category: "dog",
    features:
      "Doberman Pinscher: short smooth black/red/blue coat with rust markings, sleek athletic muscular medium-large build, long wedge-shaped head, cropped or natural pointed ears, docked tail, alert regal stance",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "rottweiler",
    breedEn: "Rottweiler",
    breedZh: "罗威纳犬",
    category: "dog",
    features:
      "Rottweiler: short coarse black coat with distinctive rust-tan markings on cheeks/chest/legs, powerful muscular large build, broad blocky head, drop ears, powerful jaw, calm confident demeanor",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  // 猫 (7)
  {
    slug: "burmese",
    breedEn: "Burmese",
    breedZh: "缅甸猫",
    category: "cat",
    features:
      "Burmese: short satiny dark brown sable coat with golden eyes, compact muscular medium build, round head with short muzzle, large round expressive eyes, silky close-lying coat, friendly dog-like personality",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "bombay",
    breedEn: "Bombay",
    breedZh: "孟买猫",
    category: "cat",
    features:
      "Bombay: short jet-black glossy patent-leather coat, copper-gold round eyes, sleek muscular medium build, rounded head with short muzzle, panther-like miniature appearance",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "american-curl",
    breedEn: "American Curl",
    breedZh: "美国卷耳猫",
    category: "cat",
    features:
      "American Curl: distinctively curled-back ears (90-180 degrees), silky semi-long or short coat in many colors, medium wedge-shaped head, large walnut-shaped eyes, gentle alert expression",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "turkish-angora",
    breedEn: "Turkish Angora",
    breedZh: "土耳其安哥拉猫",
    category: "cat",
    features:
      "Turkish Angora: long silky single-layer flowing coat without undercoat, slender elegant medium build, wedge-shaped head, large pointed ears, almond-shaped blue/green/gold eyes, plumed tail",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "somali",
    breedEn: "Somali",
    breedZh: "索马里猫",
    category: "cat",
    features:
      "Somali: long fox-like ticked ruddy/red coat, bushy fox-like tail, almond-shaped gold/green eyes, large pointed ears, agile muscular medium build, mischievous playful expression",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "norwegian-forest-cat",
    breedEn: "Norwegian Forest Cat",
    breedZh: "挪威森林猫",
    category: "cat",
    features:
      "Norwegian Forest Cat: long thick waterproof double coat with mane-like collar, large sturdy muscular build, triangular head, large tufted ears, long bushy tail, almond-shaped green/gold eyes, lynx-like appearance",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "birman",
    breedEn: "Birman",
    breedZh: "伯曼猫",
    category: "cat",
    features:
      "Birman: semi-long silky color-point coat in seal/blue/chocolate, distinctive white symmetrical gloves on all four paws, deep blue round eyes, sturdy medium build, roman nose, gentle expression",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  // 小型哺乳 (3)
  {
    slug: "gerbil",
    breedEn: "Mongolian Gerbil",
    breedZh: "蒙古沙鼠",
    category: "small-mammal",
    features:
      "Mongolian Gerbil: small sandy-brown agouti coat with white belly, long tufted tail, large dark eyes, small rounded ears, long hind legs for jumping, plump body",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "degu",
    breedEn: "Degu",
    breedZh: "八齿鼠",
    category: "small-mammal",
    features:
      "Degu: small rodent with brownish-grey coat and lighter belly, distinctive eight-shaped molars, large dark eyes, rounded ears, long thin tail with tufted tip, chunky compact build",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "chipmunk",
    breedEn: "Chipmunk",
    breedZh: "花栗鼠",
    category: "small-mammal",
    features:
      "Chipmunk: tiny squirrel-like rodent with reddish-brown back and 5 distinctive black-and-white stripes, white belly, large cheek pouches for food storage, bushy tail, bright alert eyes",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  // 鸟 (7)
  {
    slug: "sun-conure",
    breedEn: "Sun Conure",
    breedZh: "太阳锥尾鹦鹉",
    category: "bird",
    features:
      "Sun Conure: small to medium parrot with brilliant orange-yellow plumage, green-blue flight feathers, white eye-rings, black hooked beak, long tapered tail, lively social personality",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "society-finch",
    breedEn: "Society Finch",
    breedZh: "禾雀",
    category: "bird",
    features:
      "Society Finch: small songbird with grey-brown back and distinctive white belly, black mask, conical pink/silver beak, plump rounded body, social flocking nature",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "java-sparrow",
    breedEn: "Java Sparrow",
    breedZh: "爪哇禾雀",
    category: "bird",
    features:
      "Java Sparrow: medium songbird with plump grey body, distinctive red-pink ring around eye, large thick pink-red beak, white cheek patches, black head, short tail",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "parrotlet",
    breedEn: "Parrotlet",
    breedZh: "小鹦鹉",
    category: "bird",
    features:
      "Parrotlet: tiny chunky parrot with stocky build, predominantly green plumage with blue markings, short rounded tail, large dark eyes, hooked beak, miniature Amazon-like appearance",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "indian-ringneck",
    breedEn: "Indian Ringneck Parakeet",
    breedZh: "红领绿鹦鹉",
    category: "bird",
    features:
      "Indian Ringneck Parakeet: medium parrot with vibrant green plumage, distinctive black and pink neck ring in males, long tapered tail, hooked red beak, slender elegant build, intelligent eyes",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "gouldian-finch",
    breedEn: "Gouldian Finch",
    breedZh: "七彩文鸟",
    category: "bird",
    features:
      "Gouldian Finch: small songbird with multi-colored rainbow plumage, red/black/yellow head variants, purple chest, yellow belly, turquoise blue nape, considered world's most colorful finch",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "quaker-parrot",
    breedEn: "Quaker Parrot",
    breedZh: "和尚鹦鹉",
    category: "bird",
    features:
      "Quaker Parrot: medium small parrot with grey-green plumage, grey forehead and chest, blue-tinted flight feathers, long tapered tail, distinctive quaker hood appearance, stocky build",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  // 爬虫 (5)
  {
    slug: "red-footed-tortoise",
    breedEn: "Red-footed Tortoise",
    breedZh: "红腿陆龟",
    category: "reptile",
    features:
      "Red-footed Tortoise: domed black shell with yellow center on each scute, distinctive red-orange patches on legs and head, medium compact build, slight plastron concave in males, calm expression",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "blue-tongued-skink",
    breedEn: "Blue-tongued Skink",
    breedZh: "蓝舌石龙子",
    category: "reptile",
    features:
      "Blue-tongued Skink: large robust lizard with smooth banded silver-grey and tan scales, distinctive cobalt-blue tongue, short stumpy legs, triangular head, fat segmented tail, calm demeanor",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "hermann-tortoise",
    breedEn: "Hermann's Tortoise",
    breedZh: "赫曼陆龟",
    category: "reptile",
    features:
      "Hermann's Tortoise: domed yellow and black shell with distinctive divided supracaudal scute, scaly stumpy yellow-tan legs, hooked upper beak, small head with dark eyes, short keratinous tail tip",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "savannah-monitor",
    breedEn: "Savannah Monitor",
    breedZh: "草原巨蜥",
    category: "reptile",
    features:
      "Savannah Monitor: large robust lizard with grey-brown base color and yellowish circular spots, muscular stocky build, powerful limbs with strong claws, broad triangular head, long muscular tail, active intelligent demeanor",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "gopher-snake",
    breedEn: "Gopher Snake",
    breedZh: "牛蛇",
    category: "reptile",
    features:
      "Gopher Snake: medium non-venomous colubrid with yellow-tan base color and distinctive dark brown saddle markings, slender muscular build, small triangular head, round pupils, mimics rattlesnake behavior when threatened",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "basenji",
    breedEn: "Basenji",
    breedZh: "巴辛吉犬",
    category: "dog",
    features:
      "Basenji: small athletic build, tightly curled tail, short fine coat in red/chestnut/black/tricolor, wrinkled forehead, alert upright ears",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "borzoi",
    breedEn: "Borzoi",
    breedZh: "波索犬",
    category: "dog",
    features:
      "Borzoi: tall elegant slender build, long silky wavy coat, narrow head, long curved tail, deep chest, sighthound grace",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "chinese-crested",
    breedEn: "Chinese Crested",
    breedZh: "中国冠毛犬",
    category: "dog",
    features:
      "Chinese Crested: hairless slender body with silky hair only on head crest, feet tail and ears, soft spotted skin, delicate bone structure",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "japanese-spitz",
    breedEn: "Japanese Spitz",
    breedZh: "日本尖嘴犬",
    category: "dog",
    features:
      "Japanese Spitz: small fluffy pure white double coat, pointed muzzle, dark eyes, plumed tail curled over back, fox-like face",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "keeshond",
    breedEn: "Keeshond",
    breedZh: "荷兰毛狮犬",
    category: "dog",
    features:
      "Keeshond: medium thick double coat in wolf-grey with cream, fox-like expression, distinctive spectacle markings around eyes, plumed tail",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "giant-schnauzer",
    breedEn: "Giant Schnauzer",
    breedZh: "巨型雪纳瑞",
    category: "dog",
    features:
      "Giant Schnauzer: large powerful rectangular build, harsh wiry black pepper-and-salt coat, bushy beard eyebrows, docked tail, commanding presence",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "norfolk-terrier",
    breedEn: "Norfolk Terrier",
    breedZh: "诺福克梗",
    category: "dog",
    features:
      "Norfolk Terrier: small sturdy low build, wiry weather-resistant red wheaten black coat, drop ears folded forward, fearless expression",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "plott",
    breedEn: "Plott Hound",
    breedZh: "普罗特猎犬",
    category: "dog",
    features:
      "Plott Hound: medium muscular athletic hound, short brindle coat with tiger stripes, long hanging ears, deep chest, strong legs",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "scottish-terrier",
    breedEn: "Scottish Terrier",
    breedZh: "苏格兰梗",
    category: "dog",
    features:
      "Scottish Terrier: short sturdy compact build, harsh wiry black wheaten coat, distinctive long beard, erect pointed ears and tail, dignified stance",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "soft-coated-wheaten-terrier",
    breedEn: "Soft Coated Wheaten Terrier",
    breedZh: "爱尔兰软毛麦色梗",
    category: "dog",
    features:
      "Soft Coated Wheaten Terrier: medium soft silky flowing wheaten-colored coat, square build, friendly expression, profuse wavy hair",
    decoration: DECORATION_BY_CATEGORY["dog"],
  },
  {
    slug: "asian-semi-longhair",
    breedEn: "Asian Semi-longhair",
    breedZh: "亚洲长毛猫",
    category: "cat",
    features:
      "Asian Semi-longhair: medium semi-longhair elegant build, varied coat patterns and colors, almond eyes, plumed tail, silky fur",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "balinese",
    breedEn: "Balinese",
    breedZh: "巴厘岛猫",
    category: "cat",
    features:
      "Balinese: slender long elegant build, silky long coat in seal/chocolate/blue/lilac point, sapphire eyes, plumed tail, colorpoint pattern",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "european-shorthair",
    breedEn: "European Shorthair",
    breedZh: "欧洲短毛猫",
    category: "cat",
    features:
      "European Shorthair: medium athletic balanced build, dense short coat in many colors, round eyes, strong body, natural look",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "korat",
    breedEn: "Korat",
    breedZh: "科拉特猫",
    category: "cat",
    features:
      "Korat: medium compact muscular build, single blue-silver coat, luminous green eyes, heart-shaped face, Thai origin",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "nebelung",
    breedEn: "Nebelung",
    breedZh: "尼伯龙根猫",
    category: "cat",
    features:
      "Nebelung: medium long elegant build, long dense blue-silver coat, bright green eyes, sweet expression, mystical appearance",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "snowshoe",
    breedEn: "Snowshoe",
    breedZh: "雪鞋猫",
    category: "cat",
    features:
      "Snowshoe: medium balanced build, cream body with seal/blue point markings, white feet, sapphire eyes, distinctive mask",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "turkish-van",
    breedEn: "Turkish Van",
    breedZh: "土耳其梵猫",
    category: "cat",
    features:
      "Turkish Van: large long athletic build, chalk-white semi-longhaired coat with colored markings on head and tail, odd eyes common",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "meadow-vole",
    breedEn: "Meadow Vole",
    breedZh: "草甸田鼠",
    category: "small-mammal",
    features:
      "Meadow Vole: small compact rounded body, dense brown-grey fur, short tail, small rounded ears, tiny paws",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "agouti",
    breedEn: "Agouti",
    breedZh: "刺豚鼠",
    category: "small-mammal",
    features:
      "Agouti: medium slender deer-like build, brown coarse fur with banded hairs, long thin legs, small tail, large dark eyes",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "common-chinchilla",
    breedEn: "Common Chinchilla",
    breedZh: "绒鼠",
    category: "small-mammal",
    features:
      "Common Chinchilla: small plump soft body, incredibly dense soft blue-grey fur, large rounded ears, long whiskers, bushy tail",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "flying-squirrel",
    breedEn: "Flying Squirrel",
    breedZh: "飞鼠",
    category: "small-mammal",
    features:
      "Flying Squirrel: small soft body, patagium membrane between limbs for gliding, large dark eyes, flat bushy tail, soft grey-brown fur",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "jerboa",
    breedEn: "Jerboa",
    breedZh: "跳鼠",
    category: "small-mammal",
    features:
      "Jerboa: tiny delicate body, very long powerful hind legs, long thin tail with tuft, large rounded ears, kangaroo-like hopping",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "kangaroo-rat",
    breedEn: "Kangaroo Rat",
    breedZh: "袋鼠鼠",
    category: "small-mammal",
    features:
      "Kangaroo Rat: tiny compact body, large powerful hind legs, long thin tail, large rounded ears, sand-colored soft fur",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "naked-mole-rat",
    breedEn: "Naked Mole Rat",
    breedZh: "裸鼹鼠",
    category: "small-mammal",
    features:
      "Naked Mole Rat: small nearly hairless pink wrinkled body, prominent teeth, small eyes, loose skin, long whiskers, unique appearance",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "patagonian-mara",
    breedEn: "Patagonian Mara",
    breedZh: "巴塔哥尼亚豚鼠",
    category: "small-mammal",
    features:
      "Patagonian Mara: medium-large rabbit-like body with long deer-like legs, grey-brown coarse fur, long ears, long face",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "greater-glider",
    breedEn: "Greater Glider",
    breedZh: "大袋鼯",
    category: "small-mammal",
    features:
      "Greater Glider: small soft body, patagium gliding membrane, large dark eyes, long fluffy tail, soft grey fur",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
  },
  {
    slug: "alexandrine-parakeet",
    breedEn: "Alexandrine Parakeet",
    breedZh: "亚历山大鹦鹉",
    category: "bird",
    features:
      "Alexandrine Parakeet: medium large parakeet, green plumage with red beak, pink-red neck ring in males, long tail, yellow-green body",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "blue-fronted-amazon",
    breedEn: "Blue-fronted Amazon",
    breedZh: "蓝额亚马逊鹦鹉",
    category: "bird",
    features:
      "Blue-fronted Amazon: medium stocky green parrot with blue forehead, yellow face patches, red around eyes, powerful beak",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "goldfinch",
    breedEn: "European Goldfinch",
    breedZh: "金翅雀",
    category: "bird",
    features:
      "European Goldfinch: small delicate finch, striking red face mask, black-white-red-yellow wing pattern, ivory beak, agile flyer",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "common-myna",
    breedEn: "Common Myna",
    breedZh: "普通八哥",
    category: "bird",
    features:
      "Common Myna: medium sturdy black-brown bird, yellow beak and legs, distinctive white wing patches in flight, intelligent eyes",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "eclectus-parrot",
    breedEn: "Eclectus Parrot",
    breedZh: "折衷鹦鹉",
    category: "bird",
    features:
      "Eclectus Parrot: medium large parrot with extreme sexual dimorphism, males bright green females red-purple, powerful beak",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "jandaya-parakeet",
    breedEn: "Jandaya Parakeet",
    breedZh: "金黄鹦哥",
    category: "bird",
    features:
      "Jandaya Parakeet: small medium parakeet, golden-yellow head and body, green wings, orange cheeks, long tail",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "majestic-rosella",
    breedEn: "Crimson Rosella",
    breedZh: "华丽玫瑰鹦鹉",
    category: "bird",
    features:
      "Crimson Rosella: medium large parakeet, brilliant crimson plumage with blue cheek patches and white beak, long tail",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "plum-headed-parakeet",
    breedEn: "Plum-headed Parakeet",
    breedZh: "梅花头鹦鹉",
    category: "bird",
    features:
      "Plum-headed Parakeet: small elegant parakeet, males have plum-purple head red wings, females grey-blue head yellow neck",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "red-capped-parrot",
    breedEn: "Red-capped Parrot",
    breedZh: "红头鹦鹉",
    category: "bird",
    features:
      "Red-capped Parrot: small slender parrot, males brilliant red cap blue-purple body, females duller green-grey",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "senegal-parrot",
    breedEn: "Senegal Parrot",
    breedZh: "塞内加尔鹦鹉",
    category: "bird",
    features:
      "Senegal Parrot: small stocky parrot, green back, yellow-orange chest, grey head, short tail, gentle temperament",
    decoration: DECORATION_BY_CATEGORY["bird"],
  },
  {
    slug: "chinese-water-dragon",
    breedEn: "Chinese Water Dragon",
    breedZh: "中国水龙",
    category: "reptile",
    features:
      "Chinese Water Dragon: medium large lizard, bright green body, long whip tail, dewlap under chin, crest along back, semi-aquatic",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "emerald-tree-skink",
    breedEn: "Emerald Tree Skink",
    breedZh: "翡翠树石龙子",
    category: "reptile",
    features:
      "Emerald Tree Skink: small slender bright green skink, long prehensile tail, large eyes, smooth glossy scales, arboreal",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "frilled-lizard",
    breedEn: "Frilled Lizard",
    breedZh: "褶伞蜥",
    category: "reptile",
    features:
      "Frilled Lizard: medium large lizard, brown-grey body, distinctive large neck frill that expands when threatened, bipedal running",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "green-iguana",
    breedEn: "Green Iguana",
    breedZh: "绿鬣蜥",
    category: "reptile",
    features:
      "Green Iguana: large powerful lizard, vivid green with darker bands, long whip tail, dewlap, dorsal spines, leaf-shaped scale below ear",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "indian-star-tortoise",
    breedEn: "Indian Star Tortoise",
    breedZh: "印度星龟",
    category: "reptile",
    features:
      "Indian Star Tortoise: small domed tortoise, distinctive star-pattern radiating on shell in yellow-black, yellow head, five toes",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "leopard-tortoise",
    breedEn: "Leopard Tortoise",
    breedZh: "豹纹陆龟",
    category: "reptile",
    features:
      "Leopard Tortoise: medium domed tortoise, yellow-tan shell with striking black leopard-like pattern, large scales on legs",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "mata-mata",
    breedEn: "Mata Mata",
    breedZh: "玛塔龟",
    category: "reptile",
    features:
      "Mata Mata: large distinctive turtle, extremely flattened brown shell, long snorkel-like nose, rough textured skin, camouflaged",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "panther-chameleon",
    breedEn: "Panther Chameleon",
    breedZh: "豹变色龙",
    category: "reptile",
    features:
      "Panther Chameleon: medium large chameleon, vivid green with red and blue markings, independently rotating eyes, prehensile tail, zygodactyl feet",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "woma-python",
    breedEn: "Woma Python",
    breedZh: "沃玛蟒",
    category: "reptile",
    features:
      "Woma Python: medium slender python, smooth glossy scales in tan-red-brown, distinctive head, non-venomous constrictor",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "yellow-margined-box-turtle",
    breedEn: "Yellow-margined Box Turtle",
    breedZh: "黄缘闭壳龟",
    category: "reptile",
    features:
      "Yellow-margined Box Turtle: small domed turtle, dark brown carapace with yellow marginal stripes, hinged plastron, yellow head",
    decoration: DECORATION_BY_CATEGORY["reptile"],
  },
  {
    slug: "devon-rex",
    breedEn: "Devon Rex",
    breedZh: "德文卷毛猫",
    category: "cat",
    features:
      "Devon Rex: small slender pixie-like build, very short soft wavy curly coat in many colors, oversized low-set bat-like ears, large oval eyes, short muzzle, prominent cheekbones, elfin face",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "siberian",
    breedEn: "Siberian",
    breedZh: "西伯利亚森林猫",
    category: "cat",
    features:
      "Siberian: large powerful semi-cobby build, dense triple-layer semi-long fur in tabby solid colors, waterproof coat, tufted toes, large round eyes, lynx-tipped ears, full ruff",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "manx",
    breedEn: "Manx",
    breedZh: "曼岛猫",
    category: "cat",
    features:
      "Manx: medium round compact tailless or stub-tailed cat, short dense double coat, rounded body shape, broad chest, large round eyes, small round-tipped ears, longer hind legs",
    decoration: DECORATION_BY_CATEGORY["cat"],
  },
  {
    slug: "fennec-fox",
    breedEn: "Fennec Fox",
    breedZh: "耳廓狐",
    category: "small-mammal",
    features:
      "Fennec Fox: tiny desert fox with huge bat-like ears for heat dissipation, soft cream-sandy fur, small delicate pointed muzzle, dark eyes, bushy black-tipped tail, long whiskers, smallest fox species",
    decoration: DECORATION_BY_CATEGORY["small-mammal"],
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
