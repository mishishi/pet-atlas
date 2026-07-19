#!/usr/bin/env node
/**
 * vintage-paper-batch.mjs
 * 扫描 content/pets/*.json,生成 46 个待跑品种的 batch 清单
 * - 12 个旧版风格(LEGACY) → 标 action: "rerun"
 * - 34 个完全没图 → 标 action: "new"
 * - 4 个已完成的(vintage paper) → 标 action: "skip"
 *
 * 输出:
 *   - scripts/vintage-paper-batch.json: 结构化清单(可读)
 *   - stdout: 分组统计(供肉眼检查)
 *
 * 跑法:
 *   node scripts/vintage-paper-batch.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PETS_DIR = path.join(ROOT, "content", "pets");
const ART_DIR = path.join(ROOT, "art");

// 同步 lib/pets.ts 的白名单
const VINTAGE_PAPER_DONE = new Set([
  "british-shorthair",
  "labrador-retriever",
  "golden-retriever",
  "pembroke-welsh-corgi",
]);

// 同步 lib/pets.ts 的旧版 list (兜底,运行时再扫文件 mtime 二次确认)
const LEGACY_ATLAS_BREEDS = new Set([
  "shiba-inu",
  "border-collie",
  "french-bulldog",
  "bichon-frise",
  "toy-poodle",
  "siberian-husky",
  "pomeranian",
  "miniature-schnauzer",
  "dachshund",
  "alaskan-malamute",
  "samoyed",
  "abyssinian",
]);

/**
 * 判定每张图文件路径
 * 命名规范:art/{category}/{slug}/01-cover.png
 */
function coverPath(category, slug) {
  const dirName = category === "bird" || category === "reptile" ? "bird-reptile" : category;
  return path.join(ART_DIR, dirName, slug, "01-cover.png");
}

function speciesBranch(category) {
  return category === "bird" || category === "reptile" ? category : null;
}

function categoryDir(category) {
  return category === "bird" || category === "reptile" ? "bird-reptile" : category;
}

const entries = fs
  .readdirSync(PETS_DIR)
  .filter((f) => f.endsWith(".json") && f !== "README.md")
  .map((f) => JSON.parse(fs.readFileSync(path.join(PETS_DIR, f), "utf-8")));

const result = [];
const stats = { skip: 0, rerun: 0, new: 0 };

for (const pet of entries) {
  const { slug, category, template, status } = pet;
  if (status !== "published") continue;

  const cover = coverPath(category, slug);
  const hasImage = fs.existsSync(cover);
  let action;
  if (VINTAGE_PAPER_DONE.has(slug)) {
    action = "skip";
  } else if (hasImage && LEGACY_ATLAS_BREEDS.has(slug)) {
    action = "rerun";
  } else if (!hasImage) {
    action = "new";
  } else {
    // hasImage && !LEGACY && !VINTAGE_PAPER_DONE — 边缘 case
    action = "rerun";
  }
  stats[action]++;

  result.push({
    slug,
    category,
    categoryDir: categoryDir(category),
    template,
    speciesBranch: speciesBranch(category),
    name: pet.name.zh,
    nameEn: pet.name.en,
    action,
    outputDir: path.relative(
      ROOT,
      path.join(ART_DIR, categoryDir(category), slug),
    ),
  });
}

// 排序:action (rerun > new > skip) → category → slug
const actionOrder = { rerun: 0, new: 1, skip: 2 };
const categoryOrder = { dog: 0, cat: 1, "small-mammal": 2, bird: 3, reptile: 4 };
result.sort((a, b) => {
  if (actionOrder[a.action] !== actionOrder[b.action]) {
    return actionOrder[a.action] - actionOrder[b.action];
  }
  if (categoryOrder[a.category] !== categoryOrder[b.category]) {
    return categoryOrder[a.category] - categoryOrder[b.category];
  }
  return a.slug.localeCompare(b.slug);
});

const out = {
  generatedAt: new Date().toISOString(),
  stats: {
    total: result.length,
    skip: stats.skip,
    rerun: stats.rerun,
    new: stats.new,
    imagesToGenerate: (stats.rerun + stats.new) * 6,
  },
  entries: result,
};

const outPath = path.join(__dirname, "vintage-paper-batch.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

// stdout 摘要
console.log("=== vintage paper 批量跑图清单 ===");
console.log(`生成时间: ${out.generatedAt}`);
console.log(`总品种: ${out.stats.total}`);
console.log(`  ✓ 已完成 (skip): ${out.stats.skip}`);
console.log(`  ↻ 重跑  (rerun): ${out.stats.rerun}`);
console.log(`  + 新跑  (new):   ${out.stats.new}`);
console.log(`待生成图片: ${out.stats.imagesToGenerate} 张`);

console.log("\n--- 按 category 分组 ---");
const byCat = {};
for (const e of result) {
  if (e.action === "skip") continue;
  if (!byCat[e.category]) byCat[e.category] = [];
  byCat[e.category].push(e);
}
for (const [cat, list] of Object.entries(byCat)) {
  console.log(`\n[${cat}] (${list.length})`);
  for (const e of list) {
    const tag = e.action === "rerun" ? "↻" : "+";
    console.log(`  ${tag} ${e.slug.padEnd(30)} ${e.name} (template ${e.template})`);
  }
}

console.log(`\n详细清单: ${path.relative(ROOT, outPath)}`);
