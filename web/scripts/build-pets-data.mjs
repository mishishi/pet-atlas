/**
 * web/scripts/build-pets-data.mjs · 读取 content/pets/*.json → 输出 web/lib/pets-data.json
 *
 * 用途:让 client component 也能拿到 pets 数据,而不必 import lib/pets.ts(那里面有 fs / path)。
 *
 * prebuild 时跑:Vercel build 会自动执行 `npm run prebuild` → `npm run build`。
 *
 * 修这个 build 的故事:把 /app/pets/page.tsx 和 FavoritesList 标 "use client" 后,
 * 浏览器 bundle 引到了 lib/pets.ts (有 fs),Vercel build 挂 "Module not found: fs"。
 * 解法:server-only 函数 (fs) 留在 lib/pets.ts,纯数据 (JSON) 走 build-pets-data.mjs 生成,
 * client 通过 lib/pets-data.ts 读 JSON(无 fs)。
 *
 * Vercel 路径说明: Vercel Project Root 是 web/, build 时把 web/ 平铺到 /vercel/path0/。
 *   - content/ 不在 deploy 里 (在 repo root)
 *   - lib/pets-data.json 是 committed, deploy 自带
 * 修法: 找不到 content/pets/ 但 lib/pets-data.json 存在 → 跳过, 视为 already-generated
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// web/scripts/build-pets-data.mjs → /Users/.../pet-receiver (local)
// → /vercel/path0/scripts/build-pets-data.mjs (Vercel flat)
const REPO_ROOT = path.join(__dirname, "..", "..");
const PETS_DIR = path.join(REPO_ROOT, "content", "pets");
const OUT = path.join(__dirname, "..", "lib", "pets-data.json");

// Vercel 兼容: 找不到 content/pets/ 但 lib/pets-data.json 存在 → 跳过
if (!fs.existsSync(PETS_DIR)) {
  if (fs.existsSync(OUT)) {
    const stat = fs.statSync(OUT);
    console.log(
      `[build-pets-data] PETS_DIR 不存在 (${PETS_DIR}) 但 ${path.relative(process.cwd(), OUT)} 已存在 (${(stat.size / 1024).toFixed(1)} KB), 跳过 (Vercel 用 committed 数据)`
    );
    process.exit(0);
  }
  console.error(`[build-pets-data] PETS_DIR 不存在: ${PETS_DIR}`);
  process.exit(1);
}

const entries = fs.readdirSync(PETS_DIR);
const pets = [];
let skipped = 0;
for (const file of entries) {
  if (!file.endsWith(".json")) continue;
  const full = path.join(PETS_DIR, file);
  try {
    const raw = fs.readFileSync(full, "utf-8");
    const data = JSON.parse(raw);
    if (!data || typeof data.slug !== "string" || !data.name) {
      skipped++;
      continue;
    }
    pets.push(data);
  } catch (err) {
    console.warn(`[build-pets-data] skip invalid JSON: ${file}`, err.message);
    skipped++;
  }
}

// 不格式化,minify (减小 bundle)
fs.writeFileSync(OUT, JSON.stringify(pets));
console.log(
  `[build-pets-data] wrote ${pets.length} pets (skipped ${skipped}) to ${path.relative(REPO_ROOT, OUT)}`
);
