#!/usr/bin/env node
/**
 * render-prompts.mjs
 * 从 _template-N-*.md 读 prompt 模板,根据 content/pets/{slug}.json 替换占位
 * 输出 6 个 prompt 字符串(供 image_synthesize 用)+ 写入 .md 存档
 *
 * 用法:
 *   node scripts/render-prompts.mjs <slug>            # 渲染并打印 6 个 prompt
 *   node scripts/render-prompts.mjs <slug> --write    # 渲染 + 写 .md 到 art/{cat}/{slug}/XX-{key}.md
 *   node scripts/render-prompts.mjs <slug> --write --copy-web   # 上面 + 复制到 web/public
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const slug = process.argv[2];
if (!slug) {
  console.error("用法: node scripts/render-prompts.mjs <slug> [--write] [--copy-web]");
  process.exit(1);
}
const WRITE = process.argv.includes("--write");
const COPY_WEB = process.argv.includes("--copy-web");

const PETS_DIR = path.join(ROOT, "content", "pets");
const PROMPTS_DIR = path.join(ROOT, "prompts");
const ART_DIR = path.join(ROOT, "art");
const WEB_PUBLIC_DIR = path.join(ROOT, "web", "public");

// 加载品种 JSON
const petPath = path.join(PETS_DIR, `${slug}.json`);
if (!fs.existsSync(petPath)) {
  console.error(`✗ 找不到 ${petPath}`);
  process.exit(1);
}
const pet = JSON.parse(fs.readFileSync(petPath, "utf-8"));

// 加载对应模板
const templateMap = {
  1: "_template-1-dog.md",
  2: "_template-2-cat.md",
  3: "_template-3-small-mammal.md",
  4: "_template-4-bird-reptile.md",
};
const templateFile = templateMap[Number(pet.template)] ?? templateMap[String(pet.template)];
if (!templateFile) {
  console.error(`✗ 未知 template: ${pet.template}`);
  process.exit(1);
}
const templatePath = path.join(PROMPTS_DIR, templateFile);
const template = fs.readFileSync(templatePath, "utf-8");

// 抽 6 个 ```text ... ``` 块(按顺序对应 6 张图)
const textBlocks = [];
const re = /```text\n([\s\S]*?)\n```/g;
let m;
while ((m = re.exec(template)) !== null) {
  textBlocks.push(m[1].trim());
}
if (textBlocks.length < 6) {
  console.error(`✗ 模板 ${templateFile} 只找到 ${textBlocks.length} 个 prompt 块,期望 ≥ 6`);
  process.exit(1);
}

// 6 张图对应的 slot key
const SLOT_KEYS = ["cover", "traits", "personality", "history", "care", "famous"];

// 替换占位
function fillPlaceholders(template, pet) {
  const p = pet;
  const origin = p.origin
    ? `${p.origin.country ?? ""}${p.origin.region ? " · " + p.origin.region : ""}`.trim()
    : "未知";

  // history 节点(2-5 个,按数量填)
  const timeline = p.history?.timeline ?? [];
  const yearKeys = ["year_1", "year_2", "year_3", "year_4", "year_5"];
  const eventKeys = ["event_1", "event_2", "event_3", "event_4", "event_5"];

  // personality
  const personality = p.personality ?? {};

  // physical
  const phys = p.physical ?? {};

  // care
  const care = p.care ?? {};

  // famous(4 个)
  const famous = p.famous ?? [];

  // 计算 personality radar 综合评分(6 维平均)
  const personalityKeys = ["affection", "activity", "obedience", "independence", "vocalization", "intelligence"];
  const validScores = personalityKeys.map((k) => personality[k]).filter((v) => typeof v === "number");
  const avgScore = validScores.length
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    : "?";

  let result = template;

  // 基础占位
  result = result
    .replaceAll("{breed_name_zh}", p.name.zh)
    .replaceAll("{breed_name_en}", p.name.en)
    .replaceAll("{origin}", origin);

  // physical
  result = result
    .replaceAll("{height_range}", phys.heightCm ?? "未知")
    .replaceAll("{weight_range}", phys.weightKg ?? "未知")
    .replaceAll("{lifespan_range}", phys.lifespanYears ?? "未知")
    .replaceAll("{coat_desc}", phys.coat ?? "未知")
    .replaceAll("{eye_colors}", (phys.eyeColors ?? []).join("、") || "未知");

  // personality
  result = result
    .replaceAll("{affection}", String(personality.affection ?? "?"))
    .replaceAll("{activity}", String(personality.activity ?? "?"))
    .replaceAll("{obedience}", String(personality.obedience ?? "?"))
    .replaceAll("{independence}", String(personality.independence ?? "?"))
    .replaceAll("{vocalization}", String(personality.vocalization ?? "?"))
    .replaceAll("{intelligence}", String(personality.intelligence ?? "?"))
    .replaceAll("{avg_score}", avgScore)
    .replaceAll("{summary}", personality.summary ?? "");

  // history 节点(只替换存在的 1-5)
  for (let i = 0; i < yearKeys.length; i++) {
    const node = timeline[i];
    const yk = yearKeys[i];
    const ek = eventKeys[i];
    result = result
      .replaceAll(`{${yk}}`, node ? node.year : "")
      .replaceAll(`{${ek}}`, node ? node.event : "");
  }

  // care
  result = result
    .replaceAll("{diet}", care.diet ?? "")
    .replaceAll("{exercise}", care.exercise ?? "")
    .replaceAll("{health}", care.health ?? "")
    .replaceAll("{training}", care.training ?? "")
    .replaceAll("{grooming}", care.grooming ?? care.training ?? "")
    .replaceAll("{environment}", care.environment ?? care.training ?? "");

  // famous(4 个)
  for (let i = 1; i <= 4; i++) {
    result = result.replaceAll(`{famous_${i}}`, famous[i - 1] ?? "");
  }

  // species_branch(template 4)
  if (Number(pet.template) === 4) {
    const branch = pet.category === "bird" ? "bird" : pet.category === "reptile" ? "reptile" : "bird";
    result = result.replaceAll("{species_branch}", branch);
    // (template 4 logic continues below)

    // 雷达 6 维
    const birdAxes = [
      ["axis_1_label", "亲人度"],
      ["axis_2_label", "活跃度"],
      ["axis_3_label", "独立性"],
      ["axis_4_label", "智商"],
      ["axis_5_label", "鸣叫度"],
      ["axis_6_label", "社交性"],
    ];
    const reptileAxes = [
      ["axis_1_label", "亲人度"],
      ["axis_2_label", "活跃度"],
      ["axis_3_label", "独立性"],
      ["axis_4_label", "智商"],
      ["axis_5_label", "夜行性"],
      ["axis_6_label", "紧张度"],
    ];
    const axes = branch === "bird" ? birdAxes : reptileAxes;
    axes.forEach(([k, v], i) => {
      result = result.replaceAll(`{${k}}`, v);
    });
    // axis_1..6_value 暂时占位(实际值后面填)
    for (let i = 1; i <= 6; i++) {
      const fallback = personalityKeys.map((k) => personality[k])[i - 1];
      result = result.replaceAll(`{axis_${i}_value}`, String(fallback ?? "?"));
    }

    // 养护第 4 卡片
    const care4 = branch === "bird"
      ? { label: "笼舍 Cage", text: care.cage ?? care.environment ?? care.training ?? "需要大型笼舍" }
      : { label: "温湿度 Temp&Humidity", text: care.tempHumidity ?? care.environment ?? care.training ?? "需 UVB 灯 + 加热垫" };
    result = result
      .replaceAll("{care_4th_label}", care4.label)
      .replaceAll("{care_4th_text}", care4.text);

    // species_themed 装饰(template 4 cover 专用)
    const themes = {
      "african-grey-parrot": "tropical feathers, rainforest leaves, branch with berries",
      "budgerigar": "colorful feathers, eucalyptus branches, wild grass seeds",
      "cockatiel": "soft yellow-grey feathers, dried grass, wheat ears",
      "lovebird": "lovebird plumage in pairs, acacia branches, small fruits",
      "ball-python": "reptile scales, dark burrow stones, dry leaves",
      "crested-gecko": "gecko crests, rainforest leaves, small branches",
      "greek-tortoise": "tortoise shell pattern, Mediterranean herbs, dry stones",
      "leopard-gecko": "gecko spots, desert stones, succulents, sand grains",
      "red-eared-slider": "water ripples, turtle shell, aquatic plants",
      "russian-tortoise": "steppe grass, tortoise shell, dry flowers",
      "sulcata-tortoise": "desert sand, tortoise shell, dry cacti, sun-baked stones",
    };
    result = result.replaceAll("{species_themed}", themes[slug] ?? "natural habitat elements");

    // coat_or_scales(template 4 traits 专用)
    result = result.replaceAll("{coat_or_scales}", branch === "bird" ? "羽毛" : "鳞甲");
  }

  // template 3 small_mammal_themed
  if (Number(pet.template) === 3) {
    const themes = {
      "syrian-hamster": "carrots, sunflower seeds, hay, small wood shavings",
      "chinese-hamster": "carrots, sunflower seeds, hay, small wood shavings",
      "roborovski-hamster": "tiny millet seeds, sand, desert grass",
      "winter-white-hamster": "tiny millet seeds, white sand, dried herbs",
      "dutch-rabbit": "carrots, fresh greens, dandelion flowers, hay",
      "english-angora": "soft wool tufts, fresh greens, daisies",
      "holland-lop": "carrots, daisies, soft hay, mushrooms",
      "mini-rex": "velvety fur textures, fresh greens, dandelion flowers",
      "guinea-pig": "carrots, fresh greens, bell peppers, timothy hay",
      "long-tailed-chinchilla": "dried herbs, pumice stone, juniper branches",
      "ferret": "ferret toys, fish bones (small), feathers",
      "african-pygmy-hedgehog": "acorns, fallen leaves, mushrooms, tiny paw prints",
    };
    result = result.replaceAll("{small_mammal_themed}", themes[slug] ?? "natural habitat elements");

    // template 3 personality 6 维:nocturnal + social
    // 缺字段时从 obedience / vocalization 兜底
    result = result
      .replaceAll("{nocturnal}", String(personality.nocturnal ?? personality.activity ?? "?"))
      .replaceAll("{social}", String(personality.social ?? personality.affection ?? "?"));
  }

  return result;
}

// 渲染
const categoryDir = pet.category === "bird" || pet.category === "reptile" ? "bird-reptile" : pet.category;
const outputDir = path.join(ART_DIR, categoryDir, slug);

const rendered = textBlocks.slice(0, 6).map((t, i) => ({
  slot: String(i + 1).padStart(2, "0"),
  key: SLOT_KEYS[i],
  prompt: fillPlaceholders(t, pet),
}));

if (WRITE) {
  fs.mkdirSync(outputDir, { recursive: true });
  for (const r of rendered) {
    const mdPath = path.join(outputDir, `${r.slot}-${r.key}.md`);
    const content = `# ${r.slot} ${r.key} · ${pet.name.zh} (${pet.name.en})

- slot: ${r.slot}-${r.key}
- template: ${pet.template}
- category: ${pet.category}
- generated: ${new Date().toISOString()}

## Prompt

\`\`\`text
${r.prompt}
\`\`\`
`;
    fs.writeFileSync(mdPath, content);
    console.log(`✓ ${path.relative(ROOT, mdPath)}`);
  }
  if (COPY_WEB) {
    const webDir = path.join(WEB_PUBLIC_DIR, categoryDir, slug);
    fs.mkdirSync(webDir, { recursive: true });
    for (const r of rendered) {
      const srcMd = path.join(outputDir, `${r.slot}-${r.key}.md`);
      const dstMd = path.join(webDir, `${r.slot}-${r.key}.md`);
      fs.copyFileSync(srcMd, dstMd);
    }
    console.log(`✓ 复制 ${rendered.length} 个 .md 到 web/public/${categoryDir}/${slug}/`);
  }
} else {
  // 纯打印(供 image_synthesize 复制用)
  for (const r of rendered) {
    console.log(`\n=== ${r.slot}-${r.key} ===`);
    console.log(r.prompt);
  }
}
