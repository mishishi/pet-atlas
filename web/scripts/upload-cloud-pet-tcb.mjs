/**
 * web/scripts/upload-cloud-pet-tcb.mjs
 *
 * 批量上传 web/public/cloud-pets/pool/*.png 到腾讯云 TCB
 * prefix: `pet-atlas/cloud-pets/pool/`
 *
 * 用法(在 web/ 目录跑):
 *   node scripts/upload-cloud-pet-tcb.mjs             # 全部上传
 *   node scripts/upload-cloud-pet-tcb.mjs --dry-run   # 干跑
 *
 * 跟 upload-atlas-tcb.mjs 的区别:
 * - 源目录扁平(pool/*.png,无子目录)
 * - prefix 不同(cloud-pets/ 而不是 atlas/)
 * - 不按 category 分桶
 */

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
import COS from 'cos-nodejs-sdk-v5';

const BUCKET = process.env.TCB_BUCKET;
const REGION = process.env.TCB_REGION || 'ap-shanghai';
const SECRET_ID = process.env.TCB_SECRET_ID;
const SECRET_KEY = process.env.TCB_SECRET_KEY;
const TCB_DOMAIN = process.env.TCB_DOMAIN;

if (!SECRET_ID || !SECRET_KEY || !BUCKET || !TCB_DOMAIN) {
  console.error('❌ 缺少 TCB 配置(.env.local):');
  console.error('   TCB_SECRET_ID, TCB_SECRET_KEY, TCB_BUCKET, TCB_DOMAIN');
  process.exit(1);
}

const client = new COS({ SecretId: SECRET_ID, SecretKey: SECRET_KEY });

const POOL_DIR = path.join(process.cwd(), 'public', 'cloud-pets', 'pool');
const DRY_RUN = process.argv.includes('--dry-run');
const CONCURRENCY = 10;
const PROJECT = 'pet-atlas';
const TYPE = 'cloud-pets';
const KEY_PREFIX = `${PROJECT}/${TYPE}/pool/`;

async function getRemoteMeta(key) {
  try {
    const head = await client.headObject({ Bucket: BUCKET, Region: REGION, Key: key });
    return { exists: true, size: Number(head.headers?.['content-length'] || 0) };
  } catch (err) {
    if (err.code === 'NoSuchKey' || err.statusCode === 404) {
      return { exists: false };
    }
    throw err;
  }
}

async function uploadWithRetry(localPath, key, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await client.putObject({
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        Body: fs.createReadStream(localPath),
        ContentType: 'image/png',
        CacheControl: 'public, max-age=31536000, immutable',
      });
      return;
    } catch (err) {
      if (attempt === retries) throw err;
      const wait = Math.min(2 ** attempt * 500, 8000);
      console.warn(
        `\n  ⚠️  ${path.basename(localPath)} attempt ${attempt} failed: ${err.message}. Retry in ${wait}ms`
      );
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

async function uploadOne(localPath, key) {
  const localSize = fs.statSync(localPath).size;
  if (DRY_RUN) return { status: 'dry-run', localSize };

  const remote = await getRemoteMeta(key);
  if (remote.exists && remote.size === localSize) {
    return { status: 'skipped', localSize, remoteSize: remote.size };
  }

  await uploadWithRetry(localPath, key);
  return { status: 'uploaded', localSize };
}

async function main() {
  if (!fs.existsSync(POOL_DIR)) {
    console.error(`❌ 源目录不存在: ${POOL_DIR}`);
    console.error('   先跑 image_synthesize 生成 50 × 3 张图');
    process.exit(1);
  }

  const files = fs
    .readdirSync(POOL_DIR)
    .filter((f) => f.endsWith('.png'))
    .sort();

  const tasks = files.map((f) => ({
    localPath: path.join(POOL_DIR, f),
    key: `${KEY_PREFIX}${f}`,
  }));

  console.log(`🚀 TCB 上传 → ${BUCKET} (${REGION})`);
  console.log(`   prefix: ${KEY_PREFIX}`);
  console.log(`   files: ${tasks.length} 个`);
  if (DRY_RUN) console.log('   🧪 DRY RUN — 不实际上传');

  if (DRY_RUN) {
    tasks.slice(0, 5).forEach((t) => console.log(`     ${t.key}`));
    if (tasks.length > 5) console.log(`     ... 还有 ${tasks.length - 5} 个`);
    return;
  }

  let uploaded = 0,
    skipped = 0,
    failed = 0;
  const startTime = Date.now();

  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (t) => {
        try {
          const r = await uploadOne(t.localPath, t.key);
          if (r.status === 'uploaded') uploaded++;
          else if (r.status === 'skipped') skipped++;
        } catch (err) {
          failed++;
          console.error(`\n  ❌ ${path.basename(t.localPath)}: ${err.message}`);
        }
      })
    );
    const done = i + batch.length;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const mb = (uploaded + skipped) * 2.5; // avg ~2.5MB per file
    const rate = (mb / (elapsed || 1)).toFixed(2);
    process.stdout.write(
      `\r  ${done}/${tasks.length}  ↑${uploaded} =${skipped} ✗${failed}  ${elapsed}s ${rate}MB/s`
    );
  }
  console.log();

  console.log('\n' + '='.repeat(60));
  console.log('📊 总计:');
  console.log(`   ${tasks.length} 文件  ↑${uploaded} =${skipped} ✗${failed}`);

  if (uploaded > 0 && tasks[0]) {
    console.log(`\n📋 Sample URL: https://${TCB_DOMAIN}/${tasks[0].key}`);
    console.log('   复制这个到浏览器验证可访问');
  }

  if (failed > 0) {
    console.log('\n❌ 有失败,exit 1');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err.message);
  console.error(err.stack);
  process.exit(1);
});
