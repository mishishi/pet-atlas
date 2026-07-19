#!/usr/bin/env node
/**
 * scripts/build-hero-thumbs.mjs
 *
 * 给 HeroPoster 的 2 张侧图(左 + 右)生成低清版,大幅减小首屏体积
 *
 * 流程:
 * 1. 从 TCB 下载 3 张 01-cover.png 到临时目录
 * 2. sharp 缩放 2 张侧图到 512px 宽(中间那张保留原图)
 * 3. 上传缩放后的图到 TCB,key 改为 `01-cover-thumb.png`
 * 4. 保留中间图(原 01-cover.png)不动
 *
 * 用法(web/ 目录跑):
 *   node scripts/build-hero-thumbs.mjs           # 走默认 3 品种
 *   node scripts/build-hero-thumbs.mjs --all     # 跑全部 51 品种(给 PetCard 也用)
 *
 * 预期效果:首屏 hero 11MB → 4MB (-64%)
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import dotenv from 'dotenv';
import sharp from 'sharp';
import COS from 'cos-nodejs-sdk-v5';

dotenv.config({ path: path.join(import.meta.dirname || path.dirname(new URL(import.meta.url).pathname), '..', 'web', '.env.local') });

const BUCKET = process.env.TCB_BUCKET;
const REGION = process.env.TCB_REGION || 'ap-shanghai';
const SECRET_ID = process.env.TCB_SECRET_ID;
const SECRET_KEY = process.env.TCB_SECRET_KEY;
const TCB_DOMAIN = process.env.TCB_DOMAIN;

if (!SECRET_ID || !SECRET_KEY || !BUCKET || !TCB_DOMAIN) {
  console.error('❌ 缺少 TCB 配置(web/.env.local)');
  process.exit(1);
}

const client = new COS({ SecretId: SECRET_ID, SecretKey: SECRET_KEY });

// 默认 hero 用的 3 个品种(中间那张保留原图,2 张侧图生成缩略图)
const HERO_3 = [
  { slug: 'golden-retriever', cat: 'dog', side: 'left' },
  { slug: 'persian-silver-chinchilla', cat: 'cat', side: 'center' }, // 中间保留原图
  { slug: 'bearded-dragon', cat: 'bird-reptile', side: 'right' },
];

// 全量品种(给 PetCard 用)
const ALL_BREEDS = [
  // 犬
  ['dog', 'alaskan-malamute'], ['dog', 'bichon-frise'], ['dog', 'border-collie'],
  ['dog', 'chihuahua'], ['dog', 'dachshund'], ['dog', 'french-bulldog'],
  ['dog', 'golden-retriever'], ['dog', 'labrador-retriever'], ['dog', 'miniature-schnauzer'],
  ['dog', 'pembroke-welsh-corgi'], ['dog', 'pomeranian'], ['dog', 'samoyed'],
  ['dog', 'shiba-inu'], ['dog', 'siberian-husky'], ['dog', 'toy-poodle'],
  // 猫
  ['cat', 'abyssinian'], ['cat', 'american-shorthair'], ['cat', 'british-shorthair'],
  ['cat', 'chinese-li-hua'], ['cat', 'exotic-shorthair'], ['cat', 'maine-coon'],
  ['cat', 'orange-tabby'], ['cat', 'persian'], ['cat', 'persian-silver-chinchilla'],
  ['cat', 'ragdoll'], ['cat', 'siamese'], ['cat', 'sphynx'],
  // 小型哺乳
  ['small-mammal', 'african-pygmy-hedgehog'], ['small-mammal', 'chinese-hamster'],
  ['small-mammal', 'dutch-rabbit'], ['small-mammal', 'english-angora'],
  ['small-mammal', 'ferret'], ['small-mammal', 'guinea-pig'], ['small-mammal', 'holland-lop'],
  ['small-mammal', 'long-tailed-chinchilla'], ['small-mammal', 'mini-rex'],
  ['small-mammal', 'roborovski-hamster'], ['small-mammal', 'syrian-hamster'],
  ['small-mammal', 'winter-white-hamster'],
  // 鸟
  ['bird-reptile', 'african-grey-parrot'], ['bird-reptile', 'budgerigar'],
  ['bird-reptile', 'cockatiel'], ['bird-reptile', 'lovebird'],
  // 爬虫
  ['bird-reptile', 'ball-python'], ['bird-reptile', 'bearded-dragon'],
  ['bird-reptile', 'crested-gecko'], ['bird-reptile', 'greek-tortoise'],
  ['bird-reptile', 'leopard-gecko'], ['bird-reptile', 'red-eared-slider'],
  ['bird-reptile', 'russian-tortoise'], ['bird-reptile', 'sulcata-tortoise'],
];

const SRC_KEY = (cat, slug) => `pet-atlas/atlas/${cat}/${slug}/01-cover.png`;
const THUMB_KEY = (cat, slug) => `pet-atlas/atlas/${cat}/${slug}/01-cover-thumb.png`;  // 512px 侧图
const MEDIUM_KEY = (cat, slug) => `pet-atlas/atlas/${cat}/${slug}/01-cover-medium.png`; // 1024px 中间图
const SRC_URL = (cat, slug) => `https://${TCB_DOMAIN}/${SRC_KEY(cat, slug)}`;
const THUMB_URL = (cat, slug) => `https://${TCB_DOMAIN}/${THUMB_KEY(cat, slug)}`;
const MEDIUM_URL = (cat, slug) => `https://${TCB_DOMAIN}/${MEDIUM_KEY(cat, slug)}`;
const THUMB_WIDTH = 512;
const MEDIUM_WIDTH = 1024;
const TMP = path.join(os.tmpdir(), `hero-thumbs-${Date.now()}`);

fs.mkdirSync(TMP, { recursive: true });

function progress(msg) {
  process.stdout.write(`\r${msg}`);
}

async function downloadOne(cat, slug) {
  const localPath = path.join(TMP, `${cat}-${slug}.png`);
  if (fs.existsSync(localPath)) return localPath;
  // shell 用 curl 走代理
  const url = SRC_URL(cat, slug);
  execSync(`curl -m 60 -sS -o "${localPath}" "${url}"`, { stdio: 'pipe' });
  return localPath;
}

async function makeThumb(localPath, outPath, width) {
  await sharp(localPath)
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 80 })
    .toFile(outPath);
}

async function uploadOne(localPath, key) {
  const localSize = fs.statSync(localPath).size;
  // 检查 remote 是否已存在且 size 相同
  try {
    const head = await client.headObject({ Bucket: BUCKET, Region: REGION, Key: key });
    const remoteSize = Number(head.headers?.['content-length'] || 0);
    if (remoteSize === localSize) {
      return { status: 'skipped', size: localSize };
    }
  } catch (err) {
    if (err.code !== 'NoSuchKey' && err.statusCode !== 404) throw err;
  }
  await client.putObject({
    Bucket: BUCKET,
    Region: REGION,
    Key: key,
    Body: fs.createReadStream(localPath),
    ContentType: 'image/png',
    CacheControl: 'public, max-age=31536000, immutable',
  });
  return { status: 'uploaded', size: localSize };
}

async function processOne(cat, slug, sizes) {
  // 1. 下载原图
  const srcPath = await downloadOne(cat, slug);
  const srcSize = fs.statSync(srcPath).size;

  const outs = [];
  let totalOut = 0;

  for (const { width, key, url } of sizes) {
    const outPath = path.join(TMP, `${cat}-${slug}-${width}.png`);
    await makeThumb(srcPath, outPath, width);
    const outSize = fs.statSync(outPath).size;
    const r = await uploadOne(outPath, key);
    outs.push({ width, key, url, size: outSize, status: r.status });
    totalOut += outSize;
  }

  return {
    cat, slug,
    srcSize,
    outs,
    saved: srcSize - totalOut,
    pct: ((1 - totalOut / srcSize) * 100).toFixed(0),
  };
}

async function main() {
  const isAll = process.argv.includes('--all');
  // 决定每个品种要生成哪些尺寸
  const jobs = (isAll ? ALL_BREEDS : HERO_3.map((b) => [b.cat, b.slug])).map(([cat, slug]) => {
    // 默认:thumb 512 (给侧图/小卡) + medium 1024 (给中间大图)
    const sizes = [
      { width: THUMB_WIDTH, key: THUMB_KEY(cat, slug), url: THUMB_URL(cat, slug) },
      { width: MEDIUM_WIDTH, key: MEDIUM_KEY(cat, slug), url: MEDIUM_URL(cat, slug) },
    ];
    return { cat, slug, sizes };
  });

  console.log(`🚀 生成 hero 缩略图 → ${BUCKET}`);
  console.log(`   ${jobs.length} 个品种,目标宽度 ${THUMB_WIDTH}px (侧图) + ${MEDIUM_WIDTH}px (中间图)`);
  console.log(`   TCB Domain: ${TCB_DOMAIN}`);
  console.log(`   临时目录: ${TMP}`);

  const start = Date.now();
  const results = [];
  for (let i = 0; i < jobs.length; i++) {
    const { cat, slug } = jobs[i];
    progress(`  ${i + 1}/${jobs.length}  ${cat}/${slug} ... `);
    try {
      const r = await processOne(cat, slug, jobs[i].sizes);
      results.push(r);
      const totalOut = r.outs.reduce((s, o) => s + o.size, 0);
      const sizeKB = (totalOut / 1024).toFixed(0);
      const savedKB = (r.saved / 1024).toFixed(0);
      console.log(`${r.outs.map((o) => o.status).join('+')}  ${sizeKB}KB (-${savedKB}KB / -${r.pct}%)`);
    } catch (err) {
      console.log(`❌ ${err.message}`);
      results.push({ cat, slug, status: 'failed', error: err.message });
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const okCount = results.filter((r) => r.outs).length;
  const failCount = results.filter((r) => !r.outs).length;
  const totalSaved = results.reduce((s, r) => s + (r.saved || 0), 0);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ 完成 ${okCount}/${jobs.length} 失败 ${failCount}  耗时 ${elapsed}s`);
  console.log(`   总共节省 ${(totalSaved / 1024 / 1024).toFixed(1)}MB`);

  // 打印 URL 列表
  console.log(`\n📋 Thumbnail URLs(给 HeroPoster / PetCard 用):`);
  for (const r of results) {
    if (r.outs) {
      for (const o of r.outs) {
        console.log(`   [${o.width}px] ${r.cat}/${r.slug.padEnd(28)} ${o.url}`);
      }
    }
  }

  // 清理
  try {
    fs.rmSync(TMP, { recursive: true, force: true });
  } catch (e) {}

  if (failCount > 0) process.exit(1);
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err.message);
  console.error(err.stack);
  process.exit(1);
});
