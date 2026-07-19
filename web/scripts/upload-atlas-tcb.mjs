/**
 * web/scripts/upload-atlas-tcb.mjs
 *
 * 批量上传 web/public 下 {dog,cat,small-mammal,bird-reptile} 的 0N-XXX.png
 * 到腾讯云 TCB 存储桶,prefix `pet-atlas/atlas/{category}/`
 *
 * 用法(在 web/ 目录跑):
 *   npm install --no-save cos-nodejs-sdk-v5 dotenv
 *   node scripts/upload-atlas-tcb.mjs             # 跑 4 个 category
 *   node scripts/upload-atlas-tcb.mjs dog         # 跑 1 个 category
 *   node scripts/upload-atlas-tcb.mjs --dry-run   # 干跑
 *
 * 行为:
 *   - 并发 10 上传
 *   - 跳过已上传(size 对比)
 *   - 输出 progress bar + 每个 category sample URL
 *   - 失败重试 3 次(指数退避)
 *
 * 参考:history-tool/scripts/upload-audio-tcb.mjs(同 TCB 环境,同 SDK)
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

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const CATEGORIES = ['dog', 'cat', 'small-mammal', 'bird-reptile'];
const DRY_RUN = process.argv.includes('--dry-run');
const CONCURRENCY = 10;
const PROJECT = 'pet-atlas';
const TYPE = 'atlas';
const KEY_PREFIX = `${PROJECT}/${TYPE}/`;

function getTargetCategory() {
  for (const arg of process.argv.slice(2)) {
    if (!arg.startsWith('--') && CATEGORIES.includes(arg)) return arg;
  }
  return null;
}

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
      console.warn(`\n  ⚠️  ${path.basename(localPath)} attempt ${attempt} failed: ${err.message}. Retry in ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

async function uploadOne(localPath, key) {
  const localSize = fs.statSync(localPath).size;

  if (DRY_RUN) {
    return { status: 'dry-run', localSize };
  }

  const remote = await getRemoteMeta(key);
  if (remote.exists && remote.size === localSize) {
    return { status: 'skipped', localSize, remoteSize: remote.size };
  }

  await uploadWithRetry(localPath, key);
  return { status: 'uploaded', localSize };
}

async function uploadCategory(category) {
  const catDir = path.join(PUBLIC_DIR, category);
  if (!fs.existsSync(catDir)) {
    console.log(`⏭️  ${category}/ 不存在,跳过`);
    return { category, uploaded: 0, skipped: 0, failed: 0, files: 0 };
  }

  const slugs = fs.readdirSync(catDir).filter((d) => {
    const p = path.join(catDir, d);
    return fs.statSync(p).isDirectory();
  });

  const tasks = [];
  for (const slug of slugs) {
    const slugDir = path.join(catDir, slug);
    for (const f of fs.readdirSync(slugDir)) {
      if (f.endsWith('.png')) {
        tasks.push({ localPath: path.join(slugDir, f), key: `${KEY_PREFIX}${category}/${slug}/${f}` });
      }
    }
  }

  console.log(`\n📁 ${category}/ → ${BUCKET}:${KEY_PREFIX}${category}/`);
  console.log(`   ${slugs.length} 个品种 × 6 张 = ${tasks.length} 个文件`);

  if (DRY_RUN) {
    tasks.slice(0, 3).forEach((t) => console.log(`   ${t.key}`));
    if (tasks.length > 3) console.log(`   ... 还有 ${tasks.length - 3} 个`);
    return { category, uploaded: 0, skipped: 0, failed: 0, files: tasks.length, sampleKey: tasks[0]?.key };
  }

  let uploaded = 0, skipped = 0, failed = 0;
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
      }),
    );
    const done = i + batch.length;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const rate = (((uploaded + skipped) * 3.16) / (elapsed || 1)).toFixed(2);
    process.stdout.write(
      `\r  ${done}/${tasks.length}  ↑${uploaded} =${skipped} ✗${failed}  ${elapsed}s ${rate}MB/s`,
    );
  }

  console.log();
  return {
    category,
    uploaded,
    skipped,
    failed,
    files: tasks.length,
    sampleKey: tasks[0]?.key,
    duration: Date.now() - startTime,
  };
}

async function main() {
  const target = getTargetCategory();
  const cats = target ? [target] : CATEGORIES;

  console.log(`🚀 TCB 上传 → ${BUCKET} (${REGION})`);
  console.log(`   prefix: ${KEY_PREFIX}`);
  if (DRY_RUN) console.log('   🧪 DRY RUN — 不实际上传');

  const results = [];
  for (const cat of cats) {
    results.push(await uploadCategory(cat));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 总计:');
  let totalUp = 0, totalSkip = 0, totalFail = 0, totalFiles = 0;
  for (const r of results) {
    console.log(`   ${r.category.padEnd(15)} ${r.files} 文件  ↑${r.uploaded} =${r.skipped} ✗${r.failed}`);
    totalUp += r.uploaded;
    totalSkip += r.skipped;
    totalFail += r.failed;
    totalFiles += r.files;
  }
  console.log(`   ${'TOTAL'.padEnd(15)} ${totalFiles} 文件  ↑${totalUp} =${totalSkip} ✗${totalFail}`);

  if (!DRY_RUN && totalUp > 0) {
    const sample = results.find((r) => r.sampleKey)?.sampleKey;
    if (sample) {
      console.log(`\n📋 Sample URL: https://${TCB_DOMAIN}/${sample}`);
      console.log('   复制这个到浏览器验证可访问');
    }
  }

  if (totalFail > 0) {
    console.log('\n❌ 有失败,exit 1');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err.message);
  console.error(err.stack);
  process.exit(1);
});
