#!/usr/bin/env node
/**
 * scripts/atlas-finalize.mjs
 *
 * 单品种图谱生成完后的"收尾"——同步镜像 + 上传 TCB + git commit + push。
 *
 * 用法:
 *   node scripts/atlas-finalize.mjs <slug> [<slug> ...]    # 跑指定品种
 *   node scripts/atlas-finalize.mjs <slug> --no-upload    # 跳过上传
 *   node scripts/atlas-finalize.mjs <slug> --no-commit    # 跳过 commit/push
 *
 * 行为(对每个 slug):
 *   1. cp art/{cat}/{slug}/*.png → web/public/{cat}/{slug}/*.png(镜像)
 *   2. node web/scripts/upload-atlas-tcb.mjs <category>  (跑该 category,自动 skip 已存在的)
 *   3. git add <改动文件>
 *   4. git commit -m "feat(atlas): 生成 {slug} vintage paper 图谱"
 *   5. git push origin main
 *
 * 失败处理:
 *   - cp 失败 → 中止
 *   - upload 部分失败 → 继续(脚本会列失败),但 commit 时不强求
 *   - commit 失败(没东西改)→ 跳过
 *   - push 失败 → 中止,留 commit 等手动 push
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const NO_UPLOAD = args.includes("--no-upload");
const NO_COMMIT = args.includes("--no-commit");
const flags = args.filter((a) => a.startsWith("--"));
const slugs = args.filter((a) => !a.startsWith("--"));

if (slugs.length === 0) {
  console.error("用法: node scripts/atlas-finalize.mjs <slug> [<slug> ...]");
  console.error("  --no-upload  跳过 TCB 上传");
  console.error("  --no-commit  跳过 git commit / push");
  process.exit(1);
}

const PETS_DIR = path.join(ROOT, "content", "pets");
const ART_DIR = path.join(ROOT, "art");
const WEB_PUBLIC_DIR = path.join(ROOT, "web", "public");

function categoryDirName(category) {
  if (category === "bird" || category === "reptile") return "bird-reptile";
  return category;
}

function safeExec(cmd, opts = {}) {
  try {
    return execSync(cmd, { stdio: "inherit", cwd: ROOT, ...opts });
  } catch (err) {
    return null;
  }
}

function cpSync(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

const catsToUpload = new Set();
const summary = [];

for (const slug of slugs) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🐾 ${slug}`);
  console.log("=".repeat(60));

  const petPath = path.join(PETS_DIR, `${slug}.json`);
  if (!fs.existsSync(petPath)) {
    console.error(`✗ 找不到 ${petPath}`);
    continue;
  }
  const pet = JSON.parse(fs.readFileSync(petPath, "utf-8"));
  const catDir = categoryDirName(pet.category);
  const artDir = path.join(ART_DIR, catDir, slug);
  const webDir = path.join(WEB_PUBLIC_DIR, catDir, slug);

  // Step 1: 同步 PNG 到 web/public
  if (!fs.existsSync(artDir)) {
    console.error(`✗ ${artDir} 不存在,先生成`);
    continue;
  }
  const pngs = fs.readdirSync(artDir).filter((f) => f.endsWith(".png"));
  if (pngs.length < 6) {
    console.error(`✗ ${artDir} 只有 ${pngs.length} 张 PNG(< 6)`);
    continue;
  }
  console.log(`\n[1/3] 同步 ${pngs.length} 张 PNG 到 web/public/`);
  for (const f of pngs) {
    cpSync(path.join(artDir, f), path.join(webDir, f));
    console.log(`  ✓ ${f}`);
  }
  catsToUpload.add(catDir);

  summary.push({ slug, category: catDir, art_dir: artDir, web_dir: webDir, png_count: pngs.length });
}

// Step 2: 上传
if (!NO_UPLOAD) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`[2/3] 上传 ${catsToUpload.size} 个 category 到 TCB`);
  console.log("=".repeat(60));
  for (const cat of catsToUpload) {
    console.log(`\n📤 ${cat}/`);
    // upload-atlas-tcb.mjs 读 web/.env.local,所以要 cd web
    const ok = safeExec(`node scripts/upload-atlas-tcb.mjs ${cat}`, { cwd: path.join(ROOT, "web") });
    if (ok === null) {
      console.error(`✗ ${cat} 上传失败,继续`);
    }
  }
} else {
  console.log("\n⏭️ --no-upload,跳过 TCB 上传");
}

// Step 3: git commit + push
if (!NO_COMMIT) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`[3/3] git add + commit + push`);
  console.log("=".repeat(60));

  // 只 add 改过的 art/ + content/ 文件
  for (const s of summary) {
    safeExec(`git add "${s.art_dir}"`);
    safeExec(`git add "${s.web_dir}"`);
  }

  // 检查有没有 staged
  const staged = safeExec("git diff --cached --name-only", { stdio: "pipe" });
  if (!staged || !staged.toString().trim()) {
    console.log("⚠️ 没有 staged 改动,跳过 commit");
  } else {
    const slugList = slugs.join(", ");
    const msg = `feat(atlas): 生成 ${slugList} vintage paper 图谱`;
    const commitOk = safeExec(`git commit -m "${msg}"`);
    if (commitOk === null) {
      console.error("✗ commit 失败");
    } else {
      const pushOk = safeExec("git push origin main");
      if (pushOk === null) {
        console.error("✗ push 失败,commit 已留在本地");
      } else {
        console.log("✅ commit + push 完成");
      }
    }
  }
} else {
  console.log("\n⏭️ --no-commit,跳过 git");
}

console.log(`\n${"=".repeat(60)}`);
console.log("🎉 全部完成");
console.log("=".repeat(60));
for (const s of summary) {
  console.log(`  ✓ ${s.slug} (${s.category}) - ${s.png_count} 张图`);
}
