#!/usr/bin/env node
/**
 * scripts/build-og-text.mjs · Atlas 文字版 OG image (v1.1)
 *
 * 目标:给 atlas 页面生成"文字版"风格的 OG image
 * - 不用立绘(根除 AI 图风险)
 * - 跟 AtlasTextCard 视觉一致(大画框 + 暖棕调色 + vintage 美学)
 * - 含 6 维雷达图(SVG)
 *
 * 输出:
 * - public/og/{slug}-text.png (100 张)
 *
 * prebuild 链入 package.json
 */

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC_OG = path.join(ROOT, "public", "og");
const CONTENT_PETS = path.join(ROOT, "..", "content", "pets");

const FONT = "STHeiti";
const FONT_SERIF = "Georgia, serif";
const FONT_MONO = "JetBrains Mono, Menlo, monospace";

const C = {
  oat: "#F5EFE0",
  sand: "#E8D9B8",
  warmBrown: "#8B6F47",
  warmBrownLight: "#B8956A",
  brownDeep: "#3D2817",
  brownMid: "#6E5635",
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** 6 维雷达图 SVG (center cx,cy, radius r) */
function radarSvg(p, cx, cy, r) {
  const labels = [
    { k: "亲人", v: p.affection ?? 0 },
    { k: "活跃", v: p.activity ?? 0 },
    { k: "服从", v: p.obedience ?? p.independence ?? 0 },
    { k: "独立", v: p.independence ?? 0 },
    { k: "吠叫", v: p.vocalization ?? 0 },
    { k: "智商", v: p.intelligence ?? 0 },
  ];
  const n = labels.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // top

  // 计算多边形顶点
  const points = labels.map((d, i) => {
    const a = startAngle + i * angleStep;
    const dist = (d.v / 10) * r;
    return {
      x: cx + Math.cos(a) * dist,
      y: cy + Math.sin(a) * dist,
      label: d.k,
      value: d.v,
      lx: cx + Math.cos(a) * (r + 30),
      ly: cy + Math.sin(a) * (r + 30),
    };
  });

  // 背景网格 (3 圈)
  const grids = [0.33, 0.66, 1.0].map((scale) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = startAngle + i * angleStep;
      pts.push(`${cx + Math.cos(a) * r * scale},${cy + Math.sin(a) * r * scale}`);
    }
    return `<polygon points="${pts.join(" ")}" fill="none" stroke="${C.warmBrown}" stroke-width="1" opacity="0.25"/>`;
  }).join("");

  // 6 维射线
  const axes = labels.map((_, i) => {
    const a = startAngle + i * angleStep;
    return `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * r}" y2="${cy + Math.sin(a) * r}" stroke="${C.warmBrown}" stroke-width="1" opacity="0.25"/>`;
  }).join("");

  // 数据多边形
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(" ");
  const polyFill = `<polygon points="${polyPoints}" fill="${C.warmBrown}" fill-opacity="0.18" stroke="${C.warmBrown}" stroke-width="2"/>`;

  // 数据点 + 标签
  const dots = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${C.warmBrown}"/>`).join("");
  const labels2 = points.map(p => {
    const anchor = p.lx > cx + 5 ? "start" : p.lx < cx - 5 ? "end" : "middle";
    return `<text x="${p.lx}" y="${p.ly}" text-anchor="${anchor}" font-family="${FONT}" font-size="14" fill="${C.brownDeep}" dominant-baseline="middle">${p.label} <tspan font-family="${FONT_MONO}" font-size="11" fill="${C.brownMid}">${p.value}</tspan></text>`;
  }).join("");

  return `${grids}${axes}${polyFill}${dots}${labels2}`;
}

/** 文字版 breed OG */
function textBreedSvg(pet) {
  const p = pet.personality ?? {};
  const summary = p.summary ?? "";
  const tags = (p.tags ?? []).slice(0, 5);
  const tagsText = tags.map((t, i) => {
    const x = 80 + (i * 110);
    return `
      <rect x="${x}" y="510" width="100" height="32" fill="${C.oat}" stroke="${C.warmBrown}" stroke-width="1" rx="16" opacity="0.85"/>
      <text x="${x + 50}" y="530" text-anchor="middle" font-family="${FONT}" font-size="14" fill="${C.brownDeep}">${esc(t)}</text>
    `;
  }).join("");

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
    <!-- 左侧 -->
    <text x="80" y="100" font-family="${FONT_MONO}" font-size="11" letter-spacing="3" fill="${C.warmBrown}">PERSONALITY · 6 维性格</text>
    <text x="80" y="160" font-family="${FONT}" font-size="56" font-weight="700" fill="${C.brownDeep}">${esc(pet.name.zh)}</text>
    <text x="80" y="195" font-family="${FONT_SERIF}" font-size="22" font-style="italic" fill="${C.warmBrown}">${esc(pet.name.en)}</text>
    <line x1="80" y1="220" x2="600" y2="220" stroke="${C.warmBrown}" stroke-width="1" opacity="0.4"/>
    <text x="80" y="260" font-family="${FONT}" font-size="20" font-style="italic" fill="${C.brownMid}">"${esc(summary)}"</text>
    <text x="80" y="320" font-family="${FONT_MONO}" font-size="11" letter-spacing="2" fill="${C.warmBrown}">TAGS · 性格标签</text>
    <text x="80" y="340" font-family="${FONT}" font-size="14" fill="${C.brownDeep}">${tags.map(t => `· ${esc(t)}`).join("  ")}</text>
    <text x="80" y="580" font-family="${FONT_MONO}" font-size="18" fill="${C.warmBrown}">out-three-tan.vercel.app/pets/${esc(pet.slug)}/atlas</text>
    <!-- 右侧雷达图 -->
    <g transform="translate(900, 290)">
      <circle cx="0" cy="0" r="140" fill="${C.oat}" stroke="${C.warmBrown}" stroke-width="1" opacity="0.4"/>
      ${radarSvg(p, 0, 0, 140)}
    </g>
    <text x="900" y="500" text-anchor="middle" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${C.warmBrown}">— Character Radar —</text>
  </svg>`;
}

async function main() {
  console.log("[build-og-text] starting…");
  await fs.mkdir(PUBLIC_OG, { recursive: true });

  // Idempotent: 文字版 OG 不需要 TCB fetch,可以纯本地生成
  // 但仍提供 FORCE_OG_REBUILD 跳过
  // 不依赖外部资源,build 永远不会 fail

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
  console.log(`[build-og-text] loaded ${pets.length} breeds`);

  let ok = 0, skip = 0, fail = 0;
  for (const pet of pets) {
    const outPath = path.join(PUBLIC_OG, `${pet.slug}-text.png`);
    const exists = await fs.access(outPath).then(() => true).catch(() => false);
    if (exists && process.env.FORCE_OG_REBUILD !== "1") {
      skip++;
      continue;
    }
    try {
      const buf = await sharp(Buffer.from(textBreedSvg(pet))).png().toBuffer();
      await fs.writeFile(outPath, buf);
      ok++;
      if ((ok + skip) % 20 === 0) console.log(`  ${ok + skip}/${pets.length}…`);
    } catch (e) {
      fail++;
      console.warn(`  ✗ ${pet.slug}: ${e.message}`);
    }
  }
  console.log(`[build-og-text] done: ${ok} ok, ${skip} skipped, ${fail} fail`);
}

main().catch(e => {
  console.error("[build-og-text] FATAL:", e);
  process.exit(1);
});
