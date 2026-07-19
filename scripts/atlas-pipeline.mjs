#!/usr/bin/env node
/**
 * scripts/atlas-pipeline.mjs
 *
 * 生成品种图谱的"准备步骤"——渲染 6 个 prompt 模板,输出结构化清单。
 * agent 据此顺序调 image_synthesize 6 次。
 *
 * 用法:
 *   node scripts/atlas-pipeline.mjs <slug> [<slug> ...]      # 跑指定品种
 *   node scripts/atlas-pipeline.mjs --remaining             # 跑 VINTAGE_PAPER_DONE 之外的所有
 *   node scripts/atlas-pipeline.mjs --all                   # 跑 50 品种
 *   node scripts/atlas-pipeline.mjs <slug> --skip-render    # 跳过 prompt 渲染(已写过 .md)
 *
 * 输出(写到 stdout):JSON
 *   {
 *     "total_breeds": N,
 *     "breeds": [
 *       {
 *         "slug": "...",
 *         "category": "...",
 *         "art_dir": "art/dog/...",
 *         "web_public_dir": "web/public/dog/...",
 *         "prompts": [
 *           { "slot": "01-cover", "key": "cover", "md_file": "...", "prompt": "...", "output_path": "...", "copy_to": "..." },
 *           ... (6 项)
 *         ]
 *       }
 *     ]
 *   }
 *
 * agent 拿到 JSON 后:
 *   1. 对每个 breed.prompts[i]:
 *      - 调 image_synthesize({ prompt, output_file_path: prompts[i].output_path })
 *      - 调 bash: cp prompts[i].output_path prompts[i].copy_to
 *   2. 全部 6 张做完,调 atlas-finalize.mjs <slug> 收尾(上传 + commit + push)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const SKIP_RENDER = args.includes("--skip-render");
const flags = args.filter((a) => a.startsWith("--"));
const positional = args.filter((a) => !a.startsWith("--"));

const PETS_DIR = path.join(ROOT, "content", "pets");
const PROMPTS_DIR = path.join(ROOT, "prompts");
const ART_DIR = path.join(ROOT, "art");
const WEB_PUBLIC_DIR = path.join(ROOT, "web", "public");

// 同步 lib/pets.ts 的白名单(用于 --remaining)
const VINTAGE_PAPER_DONE = new Set([
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

function categoryDirName(category) {
  if (category === "bird" || category === "reptile") return "bird-reptile";
  return category;
}

/**
 * 解析要跑的品种列表
 */
function resolveSlugs() {
  if (flags.includes("--all")) {
    return fs
      .readdirSync(PETS_DIR)
      .filter((f) => f.endsWith(".json") && f !== "README.md")
      .map((f) => f.replace(/\.json$/, ""));
  }
  if (flags.includes("--remaining")) {
    return fs
      .readdirSync(PETS_DIR)
      .filter((f) => f.endsWith(".json") && f !== "README.md")
      .map((f) => f.replace(/\.json$/, ""))
      .filter((slug) => !VINTAGE_PAPER_DONE.has(slug));
  }
  if (positional.length === 0) {
    console.error("用法: node scripts/atlas-pipeline.mjs <slug> [<slug> ...] | --remaining | --all");
    console.error("  flag --skip-render: 跳过 prompt 渲染(已写过 .md)");
    process.exit(1);
  }
  return positional;
}

/**
 * 对每个 slug 跑 render-prompts.mjs 写 .md,然后读回来输出 JSON
 */
function pipelineFor(slug) {
  const petPath = path.join(PETS_DIR, `${slug}.json`);
  if (!fs.existsSync(petPath)) {
    console.error(`✗ 找不到 ${petPath}`);
    process.exit(1);
  }
  const pet = JSON.parse(fs.readFileSync(petPath, "utf-8"));

  const categoryDir = categoryDirName(pet.category);
  const artDir = path.join(ART_DIR, categoryDir, slug);
  const webDir = path.join(WEB_PUBLIC_DIR, categoryDir, slug);

  if (!SKIP_RENDER) {
    // 调 render-prompts.mjs 写 .md + 复制到 web/public
    // stdio 改 'pipe' + inherit stderr,这样它的日志(✓ xx)走 stderr,stdout 留给我们的 JSON
    execSync(
      `node ${path.join(ROOT, "scripts", "render-prompts.mjs")} ${slug} --write --copy-web`,
      { stdio: ["inherit", "pipe", "inherit"] },
    );
  } else {
    console.error(`⏭️  ${slug} --skip-render,复用现有 .md`);
  }

  // 读 6 个 .md 里的 prompt(从 ```text ... ``` 块)
  const SLOT_KEYS = ["cover", "traits", "personality", "history", "care", "famous"];
  const prompts = [];
  for (let i = 0; i < 6; i++) {
    const slot = String(i + 1).padStart(2, "0");
    const key = SLOT_KEYS[i];
    const mdFile = path.join(artDir, `${slot}-${key}.md`);
    if (!fs.existsSync(mdFile)) {
      console.error(`✗ 缺 ${mdFile},跑全流程先去掉 --skip-render`);
      process.exit(1);
    }
    const md = fs.readFileSync(mdFile, "utf-8");
    const m = /```text\n([\s\S]*?)\n```/.exec(md);
    if (!m) {
      console.error(`✗ ${mdFile} 找不到 prompt 块`);
      process.exit(1);
    }
    prompts.push({
      slot: `${slot}-${key}`,
      key,
      md_file: path.relative(ROOT, mdFile),
      prompt: m[1].trim(),
      output_path: path.relative(ROOT, path.join(artDir, `${slot}-${key}.png`)),
      copy_to: path.relative(ROOT, path.join(webDir, `${slot}-${key}.png`)),
    });
  }

  return {
    slug,
    category: pet.category,
    category_dir: categoryDir,
    art_dir: path.relative(ROOT, artDir),
    web_public_dir: path.relative(ROOT, webDir),
    prompts,
  };
}

const slugs = resolveSlugs();
if (slugs.length === 0) {
  console.error("⚠️ 没有要跑的品种(--remaining 列表为空? 50 个全做完了?)");
  process.exit(0);
}

const breeds = slugs.map(pipelineFor);
// 最终 JSON 走 stdout,其他日志走 stderr(让 agent 抓 JSON 干净)
process.stdout.write(JSON.stringify({ total_breeds: breeds.length, breeds }, null, 2));
process.stdout.write("\n");
