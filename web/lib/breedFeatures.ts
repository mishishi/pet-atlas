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

  // ===== 新增 49 品种 · 第一批 10 =====

  // 犬 (3)
  {
    slug: "yorkshire-terrier",
    breedEn: "Yorkshire Terrier",
    breedZh: "约克夏梗",
    category: "dog",
    features:
      "Yorkshire Terrier: long silky straight steel-blue and tan coat parting down the back, small toy build, erect V-shaped ears, bright dark eyes, confident terrier expression",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "maltese",
    breedEn: "Maltese",
    breedZh: "马尔济斯犬",
    category: "dog",
    features:
      "Maltese: pure white long silky single-layer coat reaching the ground, small compact toy build, round dark eyes, drop ears covered in long hair, gentle expression",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "shih-tzu",
    breedEn: "Shih Tzu",
    breedZh: "西施犬",
    category: "dog",
    features:
      "Shih Tzu: long flowing double coat in many colors, flat pushed-in face with short muzzle, large round dark eyes, drop ears heavily feathered, sturdy toy build, chrysanthemum face",
    decoration: DECORATION_BY_CATEGORY.dog,
  },

  // 猫 (2)
  {
    slug: "scottish-fold",
    breedEn: "Scottish Fold",
    breedZh: "苏格兰折耳猫",
    category: "cat",
    features:
      "Scottish Fold: distinctively folded forward and down ears, round head with big round eyes, dense plush coat in many colors, medium cobby build, owl-like expression",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "munchkin",
    breedEn: "Munchkin",
    breedZh: "曼基康矮脚猫",
    category: "cat",
    features:
      "Munchkin: distinctly short legs due to genetic dwarfism, normal-sized body, all coat colors and patterns, walnut-shaped eyes, medium triangular ears, low-to-ground stance",
    decoration: DECORATION_BY_CATEGORY.cat,
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
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  {
    slug: "macaw",
    breedEn: "Macaw",
    breedZh: "金刚鹦鹉",
    category: "bird",
    features:
      "Macaw: large parrot with long tapered tail, massive hooked beak, bare facial patch with fine feather lines, brilliant multi-color plumage in red/blue/yellow/green, powerful zygodactyl feet",
    decoration: DECORATION_BY_CATEGORY.bird,
  },

  // 爬虫 (1)
  {
    slug: "corn-snake",
    breedEn: "Corn Snake",
    breedZh: "玉米蛇",
    category: "reptile",
    features:
      "Corn Snake: slender non-venomous colubrid with orange-red base color and dark red saddle markings bordered in black, checkered belly pattern resembling corn kernels, smooth scales, alert round pupils",
    decoration: DECORATION_BY_CATEGORY.reptile,
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
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "beagle",
    breedEn: "Beagle",
    breedZh: "比格犬",
    category: "dog",
    features:
      "Beagle: short dense tri-color (black/tan/white) or lemon coat, medium compact hound build, long soft drop ears, expressive hazel eyes, merry alert expression, white-tipped tail",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "boxer",
    breedEn: "Boxer",
    breedZh: "拳师犬",
    category: "dog",
    features:
      "Boxer: short smooth fawn or brindle coat, square muscular medium build, flat pushed-in face with undershot jaw, dark brown eyes, natural or cropped ears, docked tail historically, athletic powerful build",
    decoration: DECORATION_BY_CATEGORY.dog,
  },

  // 猫 (2)
  {
    slug: "russian-blue",
    breedEn: "Russian Blue",
    breedZh: "俄罗斯蓝猫",
    category: "cat",
    features:
      "Russian Blue: short dense plush double coat in uniform blue-grey, slender elegant foreign build, wedge-shaped head, large wide-set vivid green eyes, large pointed ears, long tapering tail",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "bengal",
    breedEn: "Bengal",
    breedZh: "孟加拉豹猫",
    category: "cat",
    features:
      "Bengal: short dense pelt-like coat with distinctive leopard rosette or marble markings in brown/silver/snow, muscular wild-looking medium build, small rounded ears, dark-rimmed eyes in green or gold, long muscular body",
    decoration: DECORATION_BY_CATEGORY.cat,
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
    decoration: DECORATION_BY_CATEGORY.bird,
  },

  // 爬虫 (1) - axolotl 严格说属于两栖,但归到 reptile template 4
  {
    slug: "axolotl",
    breedEn: "Axolotl",
    breedZh: "墨西哥钝口螈",
    category: "reptile",
    features:
      "Axolotl: aquatic salamander with smooth skin, six feathery external gills on each side of head, four short legs, long flat tail, pale pink/white albino or wild-type dark coloration, permanent larval features (neoteny)",
    decoration: DECORATION_BY_CATEGORY.reptile,
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
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "jack-russell-terrier",
    breedEn: "Jack Russell Terrier",
    breedZh: "杰克罗素梗",
    category: "dog",
    features:
      "Jack Russell Terrier: predominantly white smooth or broken coat with black/tan markings, compact athletic small build, V-shaped drop ears, dark almond eyes, alert intense expression, docked or natural tail",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "english-springer-spaniel",
    breedEn: "English Springer Spaniel",
    breedZh: "英国史宾格猎犬",
    category: "dog",
    features:
      "English Springer Spaniel: medium-length liver and white or black and white coat with feathering, medium sturdy build, long drop ears, gentle soft expression, kind eyes, deep chest",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "old-english-sheepdog",
    breedEn: "Old English Sheepdog",
    breedZh: "古代英国牧羊犬",
    category: "dog",
    features:
      "Old English Sheepdog: profuse shaggy grey and white double coat covering the entire body and eyes, large square muscular build, bobbed or natural short tail, deep bark, bear-like shambling gait",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "havanese",
    breedEn: "Havanese",
    breedZh: "哈瓦那犬",
    category: "dog",
    features:
      "Havanese: long silky wavy double coat in many colors, small compact toy build, dark almond eyes, drop ears covered in long hair, plumed tail carried over back, friendly bouncy gait",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "dalmatian",
    breedEn: "Dalmatian",
    breedZh: "大麦町犬",
    category: "dog",
    features:
      "Dalmatian: short glossy white coat with distinctive black or liver spots, athletic medium build, drop ears, alert intelligent expression, deep chest, tapered tail",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "doberman-pinscher",
    breedEn: "Doberman Pinscher",
    breedZh: "杜宾犬",
    category: "dog",
    features:
      "Doberman Pinscher: short smooth black/red/blue coat with rust markings, sleek athletic muscular medium-large build, long wedge-shaped head, cropped or natural pointed ears, docked tail, alert regal stance",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  {
    slug: "rottweiler",
    breedEn: "Rottweiler",
    breedZh: "罗威纳犬",
    category: "dog",
    features:
      "Rottweiler: short coarse black coat with distinctive rust-tan markings on cheeks/chest/legs, powerful muscular large build, broad blocky head, drop ears, powerful jaw, calm confident demeanor",
    decoration: DECORATION_BY_CATEGORY.dog,
  },
  // 猫 (7)
  {
    slug: "burmese",
    breedEn: "Burmese",
    breedZh: "缅甸猫",
    category: "cat",
    features:
      "Burmese: short satiny dark brown sable coat with golden eyes, compact muscular medium build, round head with short muzzle, large round expressive eyes, silky close-lying coat, friendly dog-like personality",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "bombay",
    breedEn: "Bombay",
    breedZh: "孟买猫",
    category: "cat",
    features:
      "Bombay: short jet-black glossy patent-leather coat, copper-gold round eyes, sleek muscular medium build, rounded head with short muzzle, panther-like miniature appearance",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "american-curl",
    breedEn: "American Curl",
    breedZh: "美国卷耳猫",
    category: "cat",
    features:
      "American Curl: distinctively curled-back ears (90-180 degrees), silky semi-long or short coat in many colors, medium wedge-shaped head, large walnut-shaped eyes, gentle alert expression",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "turkish-angora",
    breedEn: "Turkish Angora",
    breedZh: "土耳其安哥拉猫",
    category: "cat",
    features:
      "Turkish Angora: long silky single-layer flowing coat without undercoat, slender elegant medium build, wedge-shaped head, large pointed ears, almond-shaped blue/green/gold eyes, plumed tail",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "somali",
    breedEn: "Somali",
    breedZh: "索马里猫",
    category: "cat",
    features:
      "Somali: long fox-like ticked ruddy/red coat, bushy fox-like tail, almond-shaped gold/green eyes, large pointed ears, agile muscular medium build, mischievous playful expression",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "norwegian-forest-cat",
    breedEn: "Norwegian Forest Cat",
    breedZh: "挪威森林猫",
    category: "cat",
    features:
      "Norwegian Forest Cat: long thick waterproof double coat with mane-like collar, large sturdy muscular build, triangular head, large tufted ears, long bushy tail, almond-shaped green/gold eyes, lynx-like appearance",
    decoration: DECORATION_BY_CATEGORY.cat,
  },
  {
    slug: "birman",
    breedEn: "Birman",
    breedZh: "伯曼猫",
    category: "cat",
    features:
      "Birman: semi-long silky color-point coat in seal/blue/chocolate, distinctive white symmetrical gloves on all four paws, deep blue round eyes, sturdy medium build, roman nose, gentle expression",
    decoration: DECORATION_BY_CATEGORY.cat,
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
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  {
    slug: "society-finch",
    breedEn: "Society Finch",
    breedZh: "禾雀",
    category: "bird",
    features:
      "Society Finch: small songbird with grey-brown back and distinctive white belly, black mask, conical pink/silver beak, plump rounded body, social flocking nature",
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  {
    slug: "java-sparrow",
    breedEn: "Java Sparrow",
    breedZh: "爪哇禾雀",
    category: "bird",
    features:
      "Java Sparrow: medium songbird with plump grey body, distinctive red-pink ring around eye, large thick pink-red beak, white cheek patches, black head, short tail",
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  {
    slug: "parrotlet",
    breedEn: "Parrotlet",
    breedZh: "小鹦鹉",
    category: "bird",
    features:
      "Parrotlet: tiny chunky parrot with stocky build, predominantly green plumage with blue markings, short rounded tail, large dark eyes, hooked beak, miniature Amazon-like appearance",
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  {
    slug: "indian-ringneck",
    breedEn: "Indian Ringneck Parakeet",
    breedZh: "红领绿鹦鹉",
    category: "bird",
    features:
      "Indian Ringneck Parakeet: medium parrot with vibrant green plumage, distinctive black and pink neck ring in males, long tapered tail, hooked red beak, slender elegant build, intelligent eyes",
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  {
    slug: "gouldian-finch",
    breedEn: "Gouldian Finch",
    breedZh: "七彩文鸟",
    category: "bird",
    features:
      "Gouldian Finch: small songbird with multi-colored rainbow plumage, red/black/yellow head variants, purple chest, yellow belly, turquoise blue nape, considered world's most colorful finch",
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  {
    slug: "quaker-parrot",
    breedEn: "Quaker Parrot",
    breedZh: "和尚鹦鹉",
    category: "bird",
    features:
      "Quaker Parrot: medium small parrot with grey-green plumage, grey forehead and chest, blue-tinted flight feathers, long tapered tail, distinctive quaker hood appearance, stocky build",
    decoration: DECORATION_BY_CATEGORY.bird,
  },
  // 爬虫 (5)
  {
    slug: "red-footed-tortoise",
    breedEn: "Red-footed Tortoise",
    breedZh: "红腿陆龟",
    category: "reptile",
    features:
      "Red-footed Tortoise: domed black shell with yellow center on each scute, distinctive red-orange patches on legs and head, medium compact build, slight plastron concave in males, calm expression",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "blue-tongued-skink",
    breedEn: "Blue-tongued Skink",
    breedZh: "蓝舌石龙子",
    category: "reptile",
    features:
      "Blue-tongued Skink: large robust lizard with smooth banded silver-grey and tan scales, distinctive cobalt-blue tongue, short stumpy legs, triangular head, fat segmented tail, calm demeanor",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "hermann-tortoise",
    breedEn: "Hermann's Tortoise",
    breedZh: "赫曼陆龟",
    category: "reptile",
    features:
      "Hermann's Tortoise: domed yellow and black shell with distinctive divided supracaudal scute, scaly stumpy yellow-tan legs, hooked upper beak, small head with dark eyes, short keratinous tail tip",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "savannah-monitor",
    breedEn: "Savannah Monitor",
    breedZh: "草原巨蜥",
    category: "reptile",
    features:
      "Savannah Monitor: large robust lizard with grey-brown base color and yellowish circular spots, muscular stocky build, powerful limbs with strong claws, broad triangular head, long muscular tail, active intelligent demeanor",
    decoration: DECORATION_BY_CATEGORY.reptile,
  },
  {
    slug: "gopher-snake",
    breedEn: "Gopher Snake",
    breedZh: "牛蛇",
    category: "reptile",
    features:
      "Gopher Snake: medium non-venomous colubrid with yellow-tan base color and distinctive dark brown saddle markings, slender muscular build, small triangular head, round pupils, mimics rattlesnake behavior when threatened",
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
