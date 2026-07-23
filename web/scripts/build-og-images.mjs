#!/usr/bin/env node
/**
 * scripts/build-og-images.mjs · Atlas OG image 预生成 (v1.1)
 *
 * 目标:给 home + 100 breed 各生成 1 张 1200×630 OG image
 * 实现:
 *   1) SVG → PNG:背景渐变 + 暖棕边框 + 中文文字(sharp + librsvg)
 *   2) sharp composite:立绘圆形裁剪后贴到右侧
 *   3) 中文字体:STHeiti Medium (macOS 系统字体,无需下载)
 *
 * 为什么不直接用 SVG <image href="data:...">:
 *   librsvg 对 base64 embedded image 处理有 bug,文字会盖到立绘
 *
 * 输出:
 *   public/og/home.png
 *   public/og/{slug}.png
 *
 * prebuild 链入 package.json
 */

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC_OG = path.join(ROOT, "public", "og");
const CONTENT_PETS = path.join(ROOT, "..", "content", "pets");

const TCB = "https://636c-cloud1-d9gv1q8ikad5e9721-1442530204.tcb.qcloud.la";
const CDN_FALLBACK = "https://out-three-tan.vercel.app";

const FONT = "STHeiti";
const FONT_SERIF = "Georgia, serif";
const FONT_MONO = "JetBrains Mono, Menlo, monospace";

const C = {
  oat: "#F5EFE0",
  sand: "#E8D9B8",
  warmBrown: "#8B6F47",
  brownDeep: "#3D2817",
  brownMid: "#6E5635",
};

/** fetch URL → Buffer (支持 redirect) */
function fetchBuffer(url, maxRedirect = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirect <= 0) return reject(new Error("too many redirects"));
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchBuffer(res.headers.location, maxRedirect - 1));
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} ${url}`));
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** 圆形裁剪立绘 → 透明背景 PNG (size × size) */
async function circleCrop(petBuf, size) {
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`
  );
  return sharp(petBuf)
    .resize(size, size, { fit: "cover" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

/** 背景 SVG (1200×630) */
function homeBgSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${C.oat}"/>
        <stop offset="100%" stop-color="${C.sand}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="20" y="20" width="1160" height="590" fill="none" stroke="${C.warmBrown}" stroke-width="4" rx="8"/>
    <rect x="36" y="36" width="1128" height="558" fill="none" stroke="${C.warmBrown}" stroke-width="1" rx="4" opacity="0.4"/>
    <text x="80" y="160" font-family="${FONT}" font-size="68" font-weight="700" fill="${C.brownDeep}">宠物大百科</text>
    <text x="80" y="220" font-family="${FONT_SERIF}" font-size="32" font-style="italic" fill="${C.warmBrown}">Pet Atlas</text>
    <text x="80" y="280" font-family="${FONT}" font-size="20" fill="${C.brownMid}">100 种动物 · 600 张图谱</text>
    <text x="80" y="310" font-family="${FONT}" font-size="20" fill="${C.brownMid}">300 张立绘 · vintage 标本卡</text>
    <text x="80" y="555" font-family="${FONT_MONO}" font-size="18" fill="${C.warmBrown}">out-three-tan.vercel.app</text>
    <circle cx="940" cy="315" r="180" fill="none" stroke="${C.warmBrown}" stroke-width="3" opacity="0.6"/>
    <text x="940" y="525" text-anchor="middle" font-family="${FONT_SERIF}" font-size="20" font-style="italic" fill="${C.warmBrown}">— 拉布拉多 · Labrador —</text>
  </svg>`;
}

function breedBgSvg(pet) {
  const p = pet.personality ?? {};
  const summary = p.summary ?? "";
  const stats = [
    { k: "亲人度", v: p.affection ?? 0 },
    { k: "活跃度", v: p.activity ?? 0 },
    { k: "服从度", v: p.obedience ?? p.independence ?? 0 },
    { k: "智商",   v: p.intelligence ?? 0 },
  ];
  const bars = stats.map((s, i) => {
    const y = 290 + i * 36;
    const w = Math.max(20, s.v * 18);
    return `
      <text x="80" y="${y + 22}" font-family="${FONT}" font-size="16" fill="${C.brownDeep}">${esc(s.k)}</text>
      <rect x="160" y="${y + 8}" width="180" height="18" fill="${C.oat}" stroke="${C.warmBrown}" stroke-width="1" rx="9" opacity="0.6"/>
      <rect x="160" y="${y + 8}" width="${w}" height="18" fill="url(#barGrad)" rx="9"/>
      <text x="350" y="${y + 22}" font-family="${FONT_MONO}" font-size="14" fill="${C.brownDeep}">${s.v}/10</text>
    `;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${C.oat}"/>
        <stop offset="100%" stop-color="${C.sand}"/>
      </linearGradient>
      <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#C9A876"/>
        <stop offset="100%" stop-color="${C.warmBrown}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="20" y="20" width="1160" height="590" fill="none" stroke="${C.warmBrown}" stroke-width="4" rx="8"/>
    <rect x="36" y="36" width="1128" height="558" fill="none" stroke="${C.warmBrown}" stroke-width="1" rx="4" opacity="0.4"/>
    <text x="80" y="100" font-family="${FONT}" font-size="48" font-weight="700" fill="${C.brownDeep}">${esc(pet.name.zh)}</text>
    <text x="80" y="140" font-family="${FONT_SERIF}" font-size="22" font-style="italic" fill="${C.warmBrown}">${esc(pet.name.en)}</text>
    <text x="80" y="185" font-family="${FONT}" font-size="16" fill="${C.brownMid}">${esc(pet.category)} · ${esc(pet.physical?.sizeGroup ?? "")} · ${esc(pet.physical?.lifespanYears ?? "")}</text>
    <line x1="80" y1="210" x2="640" y2="210" stroke="${C.warmBrown}" stroke-width="1" opacity="0.4"/>
    <text x="80" y="245" font-family="${FONT}" font-size="16" fill="${C.brownMid}">${esc(summary)}</text>
    <text x="80" y="270" font-family="${FONT_MONO}" font-size="11" fill="${C.warmBrown}" letter-spacing="2">PERSONALITY · 6 维性格</text>
    ${bars}
    <text x="80" y="580" font-family="${FONT_MONO}" font-size="18" fill="${C.warmBrown}">out-three-tan.vercel.app/pets/${esc(pet.slug)}</text>
    <circle cx="960" cy="280" r="160" fill="none" stroke="${C.warmBrown}" stroke-width="3" opacity="0.6"/>
    <text x="960" y="470" text-anchor="middle" font-family="${FONT_SERIF}" font-size="18" font-style="italic" fill="${C.warmBrown}">— ${esc(pet.name.en)} —</text>
  </svg>`;
}

/** Home OG */
async function buildHome(petBuf) {
  const bg = await sharp(Buffer.from(homeBgSvg())).png().toBuffer();
  return sharp(bg)
    .composite([{ input: petBuf, top: 135, left: 760 }])
    .png()
    .toBuffer();
}

/** Per-breed OG */
async function buildBreed(pet, petBuf) {
  const bg = await sharp(Buffer.from(breedBgSvg(pet))).png().toBuffer();
  return sharp(bg)
    .composite([{ input: petBuf, top: 120, left: 800 }])
    .png()
    .toBuffer();
}

async function main() {
  console.log("[build-og-images] starting…");
  await fs.mkdir(PUBLIC_OG, { recursive: true });

  const files = await fs.readdir(CONTENT_PETS);
  const pets = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(CONTENT_PETS, f), "utf8");
      const d = JSON.parse(raw);
      if (d?.slug && d?.name?.zh) pets.push(d);
    } catch {}
  }
  console.log(`[build-og-images] loaded ${pets.length} breeds`);

  // 拉 labrador 立绘 (home 用)
  console.log("[build-og-images] fetching labrador preview…");
  const labBuf = await fetchBuffer(`${TCB}/pet-atlas/cloud-pets/pool/labrador-retriever-v1.png`);
  const labCropped = await circleCrop(labBuf, 360);

  console.log("[build-og-images] build home.png…");
  const homeBuf = await buildHome(labCropped);
  await fs.writeFile(path.join(PUBLIC_OG, "home.png"), homeBuf);
  console.log(`  ✓ home.png (${(homeBuf.length / 1024).toFixed(1)} KB)`);

  // per-breed
  let ok = 0, fail = 0;
  for (const pet of pets) {
    try {
      const petImg = await fetchBuffer(`${TCB}/pet-atlas/cloud-pets/pool/${pet.slug}-v1.png`).catch(() => labBuf);
      const cropped = await circleCrop(petImg, 320);
      const buf = await buildBreed(pet, cropped);
      await fs.writeFile(path.join(PUBLIC_OG, `${pet.slug}.png`), buf);
      ok++;
      if (ok % 20 === 0) console.log(`  ${ok}/${pets.length}…`);
    } catch (e) {
      fail++;
      console.warn(`  ✗ ${pet.slug}: ${e.message}`);
    }
  }
  console.log(`[build-og-images] done: ${ok} ok, ${fail} fail`);
}

main().catch(e => {
  console.error("[build-og-images] FATAL:", e);
  process.exit(1);
});
