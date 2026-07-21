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
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// web/scripts/build-pets-data.mjs → /Users/.../pet-receiver
const REPO_ROOT = path.join(__dirname, "..", "..");
const PETS_DIR = path.join(REPO_ROOT, "content", "pets");
const OUT = path.join(__dirname, "..", "lib", "pets-data.json");

if (!fs.existsSync(PETS_DIR)) {
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
