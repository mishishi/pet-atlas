#!/usr/bin/env node
/**
 * scripts/build-thumbs.mjs
 *
 * 给 150 张 atlas 01-cover.png 生成 thumb/medium 缩略图,大幅减小首屏体积
 *
 * 输入: TCB CDN (https://...tcb.qcloud.la/pet-atlas/atlas/{cat}/{slug}/01-cover.png)
 * 输出: web/public/{cat}/{slug}/01-cover-{thumb,medium}.jpg (commit 进 git)
 *
 * thumb (384px 宽): 列表页 / PetCard 用,~30-50KB/张
 * medium (768px 宽): 详情页 spec 用,~80-120KB/张
 *
 * 用法(web/ 目录):
 *   node scripts/build-thumbs.mjs              # 跑全部 150 张
 *   node scripts/build-thumbs.mjs --dry-run   # 干跑
 *   FORCE_THUMB_REBUILD=1 node scripts/build-thumbs.mjs  # 强制覆盖
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config({ path: path.join(import.meta.dirname, "..", ".env.local") });

// TCB 域名优先从 TCB_DOMAIN 读(本地 .env.local),其次从 NEXT_PUBLIC_ATLAS_BASE_URL 解析
// (Vercel build 环境没 .env.local,但有 NEXT_PUBLIC_* env 注入)
function resolveTcbDomain() {
  if (process.env.TCB_DOMAIN) return process.env.TCB_DOMAIN;
  const base = process.env.NEXT_PUBLIC_ATLAS_BASE_URL;
  if (base) {
    try {
      const u = new URL(base);
      return u.host;
    } catch {
      // 兜底
    }
  }
  return null;
}

const TCB_DOMAIN = resolveTcbDomain();
if (!TCB_DOMAIN) {
  console.error("❌ 缺少 TCB_DOMAIN 配置(.env.local 或 NEXT_PUBLIC_ATLAS_BASE_URL)");
  process.exit(1);
}

const PUBLIC_DIR = path.join(process.cwd(), "public");
const CATEGORIES = ["dog", "cat", "small-mammal", "bird-reptile"];
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE_THUMB_REBUILD === "1";

const THUMB_W = 384;
const MEDIUM_W = 768;
const CONCURRENCY = 6;

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { timeout: 30000 }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function processOne(slug, catDirName) {
  const tcbUrl = `https://${TCB_DOMAIN}/pet-atlas/atlas/${catDirName}/${slug}/01-cover.png`;
  const dstThumb = path.join(PUBLIC_DIR, catDirName, slug, "01-cover-thumb.jpg");
  const dstMedium = path.join(PUBLIC_DIR, catDirName, slug, "01-cover-medium.jpg");

  const needsThumb = FORCE || !fs.existsSync(dstThumb);
  const needsMedium = FORCE || !fs.existsSync(dstMedium);
  if (!needsThumb && !needsMedium) {
    return { status: "skip", reason: "exists" };
  }

  if (DRY_RUN) {
    return { status: "dryrun" };
  }

  let buffer;
  try {
    buffer = await fetchBuffer(tcbUrl);
  } catch (e) {
    return { status: "fail", reason: e.message };
  }

  if (needsThumb) {
    await sharp(buffer)
      .resize(THUMB_W, null, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(dstThumb);
  }

  if (needsMedium) {
    const mediumBuffer = await fetchBuffer(tcbUrl);
    await sharp(mediumBuffer)
      .resize(MEDIUM_W, null, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(dstMedium);
  }

  return { status: "ok" };
}

async function main() {
  // 读 150 个 breed — 从 import.meta.dirname (web/scripts/) 往上找 content/pets
  // Vercel build 时 cwd = web/, import.meta.dirname 路径是 /vercel/path0/web/scripts/
  // 走两层 .. 应该是 /vercel/path0 (repo root), 但保险起见也用 process.cwd() 探测
  let REPO_ROOT = path.join(import.meta.dirname, "..", "..");
  if (!fs.existsSync(path.join(REPO_ROOT, "content", "pets"))) {
    // 备选: 从 cwd 探测
    if (fs.existsSync(path.join(process.cwd(), "content", "pets"))) {
      REPO_ROOT = process.cwd();
    } else if (fs.existsSync(path.join(process.cwd(), "..", "content", "pets"))) {
      REPO_ROOT = path.join(process.cwd(), "..");
    } else {
      throw new Error(`找不到 content/pets 目录 (cwd=${process.cwd()}, dirname=${import.meta.dirname})`);
    }
  }
  const petFiles = fs
    .readdirSync(path.join(REPO_ROOT, "content", "pets"))
    .filter((f) => f.endsWith(".json"));

  const pets = petFiles.map((f) => {
    const d = JSON.parse(
      fs.readFileSync(path.join(REPO_ROOT, "content", "pets", f), "utf-8")
    );
    return { slug: d.slug, cat: d.category };
  });

  const counts = { ok: 0, skip: 0, dryrun: 0, fail: 0 };
  const queue = [...pets];
  const start = Date.now();

  async function worker() {
    while (queue.length) {
      const pet = queue.shift();
      const catDirName =
        pet.cat === "bird" || pet.cat === "reptile"
          ? "bird-reptile"
          : pet.cat;
      try {
        const r = await processOne(pet.slug, catDirName);
        if (r.status === "ok") counts.ok++;
        else if (r.status === "skip") counts.skip++;
        else if (r.status === "dryrun") counts.dryrun++;
        else if (r.status === "fail") {
          counts.fail++;
          console.error(`  ✗ ${pet.slug}: ${r.reason}`);
        }
      } catch (e) {
        counts.fail++;
        console.error(`  ✗ ${pet.slug}: ${e.message}`);
      }
      const total = counts.ok + counts.skip + counts.dryrun + counts.fail;
      if (total % 10 === 0) {
        process.stdout.write(
          `  ${total}/${pets.length} ok=${counts.ok} skip=${counts.skip} fail=${counts.fail}\r`
        );
      }
    }
  }

  await Promise.all(
    Array.from({ length: CONCURRENCY }, () => worker())
  );

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `\n✅ 完成: ok=${counts.ok} skip=${counts.skip} fail=${counts.fail} 用时 ${elapsed}s`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
