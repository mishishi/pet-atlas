#!/usr/bin/env node
/**
 * web/scripts/upload-pet-voice-tcb.mjs · 上传 6 段中文 pet TTS 短句到 TCB
 *
 * prefix: pet-atlas/pet-voice/
 * 上传后: https://<bucket>.tcb.qcloud.la/pet-atlas/pet-voice/happy.mp3
 *
 * 用法(在 web/ 目录跑):
 *   node scripts/upload-pet-voice-tcb.mjs             # 全部上传
 *   node scripts/upload-pet-voice-tcb.mjs --dry-run  # 干跑
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const COS = require("cos-nodejs-sdk-v5");

// dotenv
import dotenv from "dotenv";
const LOCAL_ENV = path.join(process.cwd(), ".env.local");
const ROOT_ENV = path.resolve(process.cwd(), "..", ".env.local");
if (fs.existsSync(LOCAL_ENV)) {
  dotenv.config({ path: LOCAL_ENV });
} else if (fs.existsSync(ROOT_ENV)) {
  dotenv.config({ path: ROOT_ENV });
}

const BUCKET = process.env.TCB_BUCKET;
const REGION = process.env.TCB_REGION || "ap-shanghai";
const SECRET_ID = process.env.TCB_SECRET_ID;
const SECRET_KEY = process.env.TCB_SECRET_KEY;
const TCB_DOMAIN = process.env.TCB_DOMAIN;

if (!SECRET_ID || !SECRET_KEY || !BUCKET || !TCB_DOMAIN) {
  console.error("❌ 缺少 TCB 配置(.env.local):");
  console.error("   TCB_SECRET_ID, TCB_SECRET_KEY, TCB_BUCKET, TCB_DOMAIN");
  process.exit(1);
}

const client = new COS({ SecretId: SECRET_ID, SecretKey: SECRET_KEY });

const VOICE_DIR = path.join(process.cwd(), "public", "sounds", "pet-voice");
const DRY_RUN = process.argv.includes("--dry-run");
const CONCURRENCY = 6;
const KEY_PREFIX = "pet-atlas/pet-voice/";

async function getRemoteMeta(key) {
  try {
    const head = await client.headObject({ Bucket: BUCKET, Region: REGION, Key: key });
    return { exists: true, size: Number(head.headers?.["content-length"] || 0) };
  } catch (err) {
    if (err.code === "NoSuchKey" || err.statusCode === 404) {
      return { exists: false };
    }
    throw err;
  }
}

async function uploadOne(localPath, key) {
  const remote = await getRemoteMeta(key);
  const localSize = fs.statSync(localPath).size;
  if (remote.exists && remote.size === localSize) {
    return { status: "skipped" };
  }
  await client.putObject({
    Bucket: BUCKET,
    Region: REGION,
    Key: key,
    Body: fs.createReadStream(localPath),
    ContentType: "audio/mpeg",
    CacheControl: "public, max-age=31536000, immutable",
  });
  return { status: "uploaded" };
}

async function main() {
  if (!fs.existsSync(VOICE_DIR)) {
    console.error(`❌ 源目录不存在: ${VOICE_DIR}`);
    process.exit(1);
  }
  const files = fs
    .readdirSync(VOICE_DIR)
    .filter((f) => f.endsWith(".mp3"))
    .sort();
  const tasks = files.map((f) => ({
    localPath: path.join(VOICE_DIR, f),
    key: `${KEY_PREFIX}${f}`,
  }));
  console.log(`🚀 上传 ${tasks.length} 段中文 pet TTS → ${BUCKET}`);
  console.log(`   prefix: ${KEY_PREFIX}`);
  if (DRY_RUN) {
    for (const t of tasks) console.log(`     ${t.key}`);
    return;
  }
  let uploaded = 0,
    skipped = 0,
    failed = 0;
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (t) => {
        try {
          const r = await uploadOne(t.localPath, t.key);
          if (r.status === "uploaded") uploaded++;
          else if (r.status === "skipped") skipped++;
        } catch (err) {
          failed++;
          console.error(`\n  ❌ ${path.basename(t.localPath)}: ${err.message}`);
        }
      })
    );
    process.stdout.write(`\r  ${Math.min(i + CONCURRENCY, tasks.length)}/${tasks.length}  ↑${uploaded} =${skipped} ✗${failed}`);
  }
  console.log();
  console.log(`\n📊 ${tasks.length} 文件  ↑${uploaded} =${skipped} ✗${failed}`);
  if (uploaded + skipped > 0) {
    console.log(`\n📋 Sample: https://${TCB_DOMAIN}/${tasks[0].key}`);
  }
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("\n💥", err.message);
  process.exit(1);
});
