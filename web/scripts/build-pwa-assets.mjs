/**
 * web/scripts/build-pwa-assets.mjs
 *
 * Build-time 生成 PWA / SEO 静态资源:
 * - public/manifest.webmanifest
 * - public/sitemap.xml (100 breed × 2 路径 + 5 静态页)
 * - public/robots.txt
 *
 * 在 next build 之前跑 (prebuild 钩子),生成的文件直接被 static export 复制到 out/。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, '..', 'content', 'pets');
const PUBLIC_DIR = path.join(ROOT, 'public');

const SITE = 'https://out-three-tan.vercel.app';
const TCB = 'https://636c-cloud1-d9gv1q8ikad5e9721-1442530204.tcb.qcloud.la';
const NOW_ISO = new Date().toISOString();

function readAllBreedSlugs() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => f.replace('.json', '')).sort();
}

const breeds = readAllBreedSlugs();
console.log(`[pwa-assets] 读 ${breeds.length} 个 breed`);

const manifest = {
  name: '宠物大百科 · Pet Atlas',
  short_name: '宠物大百科',
  description: '为爱宠收藏一整套图鉴 — 100 种动物的 vintage 标本卡图谱,犬、猫、小型哺乳、鸟、爬虫。',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  theme_color: '#8B6F47',
  background_color: '#F5EFE0',
  lang: 'zh-CN',
  categories: ['education', 'lifestyle', 'books'],
  icons: [
    { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    { src: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml', purpose: 'maskable' },
  ],
  screenshots: [
    {
      src: `${TCB}/pet-atlas/atlas/dog/golden-retriever/01-cover.png`,
      sizes: '1536x2752',
      type: 'image/png',
      form_factor: 'narrow',
      label: '图鉴示例:金毛寻回犬',
    },
  ],
};
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'manifest.webmanifest'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);
console.log('[pwa-assets] ✓ manifest.webmanifest');

const staticUrls = [
  { loc: '/', priority: 1.0, changefreq: 'weekly' },
  { loc: '/about', priority: 0.6, changefreq: 'monthly' },
  { loc: '/adopt', priority: 0.9, changefreq: 'weekly' },
  { loc: '/pets', priority: 0.9, changefreq: 'weekly' },
  { loc: '/profile', priority: 0.3, changefreq: 'never' },
];
const breedUrls = breeds.flatMap((slug) => [
  { loc: `/pets/${slug}`, priority: 0.8, changefreq: 'monthly' },
  { loc: `/pets/${slug}/atlas`, priority: 0.7, changefreq: 'monthly' },
]);
const allUrls = [...staticUrls, ...breedUrls];

const sitemapBody = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${NOW_ISO}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapBody, 'utf8');
console.log(`[pwa-assets] ✓ sitemap.xml (${allUrls.length} URLs)`);

const robotsBody = `User-agent: *
Allow: /
Disallow: /profile/
Disallow: /profile/reroll/

Sitemap: ${SITE}/sitemap.xml
Host: ${SITE}
`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsBody, 'utf8');
console.log('[pwa-assets] ✓ robots.txt');

console.log('\n[pwa-assets] ✅ 全部生成完成');
