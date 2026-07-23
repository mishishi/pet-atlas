# Architecture · pet-atlas v1.0

> **目标读者**:贡献者 / 二次开发者 / 想理解系统设计的工程师
>
> **本文件范围**:解释 *为什么* 这样设计,而不只是 *做了什么*。  
> 详细功能 / 时间线 / 5 批扩张记录见 [`docs/RELEASE-NOTES-v1.0.md`](./RELEASE-NOTES-v1.0.md)。

---

## 1. 顶层架构

```
┌─────────────────────────────────────────────────────────────┐
│                  Vercel  (生产托管)                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js 16 · React 19 · TypeScript strict · Tailwind v4 │ │
│  │  App Router + 静态导出 (output: "export")                │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
   ┌──────────────┐ ┌──────────┐ ┌────────────────┐
   │ Vercel CDN   │ │ TCB      │ │ TCB Database   │
   │ (静态资源)   │ │ Storage  │ │ (用户/互动数据)│
   │  - HTML/JS   │ │ (CDN)    │ │                │
   │  - CSS       │ │  - atlas │ │  - pet_stats   │
   │              │ │  - cloud │ │  - cloud_pets  │
   │              │ │  - voice │ │  - pet_diary   │
   └──────────────┘ └──────────┘ │  - pet_progression│
                                 │  - user_favorites │
                                 └────────────────┘
                                         ▲
                                         │
                              ┌──────────┴──────────┐
                              │  Web Crypto API     │
                              │  (PBKDF2 + 盐)      │
                              │  本地鉴权 + TCB sync│
                              └─────────────────────┘
```

**关键点**:
- **Next.js 静态导出** — 没有 Node runtime,所有 HTML 预渲染,Vercel CDN 静态托管
- **资源全在 TCB** — 图谱 / 立绘 / 语音 全部走 TCB Object Storage,不走 Vercel build artifact
- **localStorage 主 + TCB 兜底** — 互动数据先写 localStorage,fire-and-forget 异步同步到 TCB
- **TCB `_openid` 主键** — 未登录用 deviceId,登录后用 userId,同一集合兼容两种身份

---

## 2. 目录结构 & 模块边界

```
web/
├── app/                       # Next.js App Router (server + client 混合)
│   ├── layout.tsx             # Root: 字体 + JSON-LD + PWA + Service Worker 注册
│   ├── page.tsx               # 首页 (server, getAllPets)
│   ├── pets/
│   │   ├── page.tsx           # 100 breed 列表
│   │   └── [slug]/
│   │       ├── page.tsx       # 品种详情 (server, getPetBySlug)
│   │       └── atlas/
│   │           ├── page.tsx   # 翻页图鉴 (server, generateStaticParams + Suspense)
│   │           ├── AtlasViewer.tsx     # 翻页逻辑 (client)
│   │           └── AtlasTextCard.tsx   # 文字版卡片 (server-safe, 可 SSR)
│   ├── login/  register/      # 邮箱密码登录注册 (client)
│   ├── profile/               # 个人中心 (client, mount 触发云同步)
│   ├── adopt/                 # 领养云宠物 (client)
│   ├── about/                 # 项目介绍 (server)
│   ├── offline/               # SW 离线 fallback
│   ├── icon.svg / apple-icon.png  # PWA icons (static)
│   ├── manifest.webmanifest   # PWA manifest (build-time 预生成)
│   ├── sitemap.xml            # 205 URLs (build-time 预生成)
│   └── robots.txt             # build-time 预生成
│
├── components/                # 共享 UI
│   ├── auth/AuthMenu.tsx              # Header 登录态菜单
│   ├── brand/                         # 标本卡 + 植物装饰
│   │   ├── SpecimenFrame.tsx          # 9:16 复古画框
│   │   └── BotanicalBorder.tsx        # LeafDivider / 装饰边
│   ├── cloud-pet/PetSettings.tsx      # 6 段心情试听 + 设置
│   ├── nav/Header.tsx                 # 顶部导航 + AuthMenu
│   ├── pwa/PWAInstallPrompt.tsx       # PWA 安装引导 (Chrome/iOS)
│   └── ui/                            # Button / SafeImage
│
├── lib/                       # 业务逻辑
│   ├── pets.ts                # 100 breed 元数据 (server-only, 读 fs)
│   ├── pets-data.ts           # 预生成的 JSON (client-safe)
│   ├── auth.ts                # 邮箱密码 + PBKDF2 (client)
│   ├── tcb.ts                 # 腾讯云 SDK 封装 (client)
│   ├── tcbSync.ts             # 5 个集合的 push/fetch 函数
│   ├── favorites.ts           # 收藏 localStorage + 防抖 2s 推 TCB
│   ├── petProgression.ts      # 等级 + 经验 + 连续打卡
│   ├── petDiary.ts            # 心情日记 append-only
│   ├── cloudPet.ts            # 云宠物状态机 (心情/好感度)
│   ├── deviceId.ts            # 设备 ID + ownerId 抽象
│   ├── atlas-constants.ts     # 6 槽位元数据
│   ├── atlas-urls.ts          # 图谱 URL 构造 (本地 / TCB)
│   ├── breedFeatures.ts       # 100 breed UI 特性 (M4 stage 1 修复)
│   └── types.ts               # 完整 TypeScript schema
│
├── scripts/                   # build-time
│   ├── build-pets-data.mjs    # 读 JSON → 生成 lib/pets-data.ts
│   ├── build-pwa-assets.mjs   # 生成 manifest/sitemap/robots
│   └── upload-cloud-pet-tcb.mjs  # 批量上传立绘到 TCB
│
└── public/                    # 静态 (大部分 gitignore)
    ├── manifest.webmanifest
    ├── sitemap.xml
    ├── robots.txt
    ├── sw.js                  # Service Worker
    ├── cloud-pets/pool/       # 立绘本地 (生产走 TCB, 兜底用)
    └── icon.svg / apple-icon.png
```

---

## 3. 关键子系统

### 3.1 Atlas 文字版 (v0.6 default)

**问题**:AI 生成的 03/04/06 信息图有字体 footgun 风险(任何 prompt 改动都可能让 AI 把字面量印进图)。

**方案**:03-personality / 04-history / 06-famous 三个槽位改用 **纯 HTML 卡片** (`AtlasTextCard.tsx`)。01/02/05 仍用 AI 图(治愈系视觉锚点)。

**渲染逻辑** (`AtlasViewer.tsx`):
```ts
const TEXT_SLOTS = new Set([3, 4, 6]);  // 03/04/06
const showTextCard = textMode && TEXT_SLOTS.has(page);
```

**用户偏好优先级** (URL > localStorage > default):
```
?text=1 / ?text=0  →  强制覆盖
localStorage.atlas-text-mode  →  记忆用户选择
都没  →  default = true  (文字版为 default)
```

**数据 schema 适配**:
| Pet 字段 | AtlasTextCard 期望 | 处理 |
|----------|------------------|------|
| `personality` | `PersonalityScores` | ✅ 直接 match |
| `history.timeline[]` | `{year, event}[]` | ✅ 直接 match |
| `famous: string[]` | `{title, subtitle, description}[]` 或 `string[]` | ✅ 两种都接受,string[] 自动转换 |
| `obedience` 缺失 (4 breed) | 必填 | ✅ fallback 用 independence 兜底 |

**收益**:
- 加载快 600 倍 (5KB vs 2-3MB)
- SEO 全文索引 (Google 能抓文字内容,抓不到 AI 图)
- 0 字体 footgun 风险
- Token 节省:扩品种时 03/04/06 三页不需要 image_synthesize

### 3.2 资源 CDN (TCB)

**为什么不用 Vercel 静态托管**:
- 100 breed × 6 atlas = 600 张图(每张 2-3MB)→ ~1.5GB
- Vercel 部署有 size 限制,大 build artifact 慢
- TCB 国内 CDN 加速,延迟低

**URL pattern**:
```
# Atlas 图谱
{TCB}/pet-atlas/atlas/{category}/{slug}/{slot}-{key}.png
示例: pet-atlas/atlas/dog/labrador-retriever/03-personality.png

# Cloud-pet 立绘
{TCB}/pet-atlas/cloud-pets/pool/{slug}-v{n}.png
示例: pet-atlas/cloud-pets/pool/labrador-retriever-v1.png
```

**TCB 配置**:
- envId: `cloud1-d9gv1q8ikad5e9721`
- Bucket: `636c-cloud1-d9gv1q8ikad5e9721-1442530204`
- Region: `ap-shanghai`
- Domain: `*.tcb.qcloud.la`

**本地降级** (`web/public/cloud-pets/pool/`):
- gitignore,只在开发时存在
- 生产走 TCB,本地降级给 dev server 用

### 3.3 用户系统 (M4 阶段化)

**Stage 1 (MVP,当前)**:本地邮箱密码
- 客户端 Web Crypto API:PBKDF2-SHA256 100k iter + per-user salt
- 30 天 session TTL,base64url random token (32 bytes)
- 数据存 localStorage (无后端依赖)
- 登录后 `getOwnerId()` 返回 userId,未登录返回 deviceId

**Stage 2 (已上)**:tcbSync 用 `_openid` 主键
- 5 个 TCB 集合 (`pet_stats` / `cloud_pets` / `pet_diary` / `pet_progression` / `user_favorites`)
- push 走 upsert (idempotent),fetch 走 `_openid` 主键
- 同一集合兼容 user (登录) / device (未登录) 两种 owner

**Stage 2.5 (已上)**:favorites + progression 跨设备同步
- toggleFavorite 触发防抖 2s push
- syncFavoritesFromCloud 取并集 (新加优先)
- syncProgressionFromCloud 取 max(xp/streak) + badges 并集

**Stage 3 (远期)**:TCB `users` collection 真实部署
- 需要 ICP 备案
- PBKDF2 hash 存 TCB
- 跨设备真实登录 (非 localStorage)

### 3.4 PWA + SEO (M3)

**PWA**:
- `manifest.webmanifest` (build-time 预生成,Next.js 16 output:export 不支持 dynamic route)
- Service Worker:CacheFirst (静态资源) + SWR (HTML) + NetworkFirst (API)
- `PWAInstallPrompt.tsx` 监听 `beforeinstallprompt` 弹原生,iOS Safari 显示 3 步引导

**SEO**:
- JSON-LD:WebSite (root) + Organization (root) + Pet (详情页)
- `sitemap.xml` 205 URLs (5 静态 + 100 breed + 100 atlas)
- `robots.txt` 允许所有,指向 sitemap
- canonical URL 防止重复内容

**Next.js 16 踩坑** (memory 记):
- ❌ `app/manifest.ts` / `sitemap.ts` / `robots.ts` / `icon.tsx` / `apple-icon.tsx` 动态路由在 `output: export` 模式 build 失败
- ✅ 全部用 build-time script 生成 static 文件,prebuild 链入 package.json
- ❌ `apple-icon.svg` 404 (Next 16 只支持 .png/.ico/.jpg)
- ✅ 用 sips 转换 SVG → PNG

### 3.5 翻页 Viewer

**状态机** (`AtlasViewer.tsx`):
- `page` (1-6) + `direction` (next/prev) + `isFlipping` (380ms 防抖)
- URL 同步:`router.replace(/atlas?page=N, { scroll: false })` 不刷新不滚动
- 键盘:`←/→` 翻页 · `F` 全屏 · `T` 文字版 · `Home/End` 首尾
- 触摸:50px 阈值翻页
- 缩略图:点击直接跳 + active 状态高亮

**渲染优化**:
- 只渲染当前 + 邻页 (其他 3 页不下载)
- `key={page}` 强制重渲染触发 CSS 3D flip 动画
- 缩略图:`eager` for past+active,`lazy` for future

**动画** (inline styled-jsx):
```css
@keyframes atlasFlipOutLeft {
  0% { transform: rotateY(0deg); opacity: 1; }
  100% { transform: rotateY(-15deg) translateX(-20%); opacity: 0; }
}
```

---

## 4. 数据流

### 4.1 品种浏览路径

```
User 访问 /pets/labrador-retriever
  ↓
app/pets/[slug]/page.tsx (server)
  ↓ getPetBySlug(slug)  ←  读 lib/pets.ts (100 entry)
  ↓
getBreedAtlas(slug)     ←  6 张图谱 URL (本地 → TCB fallback)
  ↓
Render <PetDetailView pet={pet} atlas={atlas} />
  ↓
User 点击 "翻页图鉴" → /pets/labrador-retriever/atlas?page=3
  ↓
atlas/page.tsx (server) generateStaticParams
  ↓ getBreedAtlas(slug) + Suspense fallback
  ↓
<AtlasViewer ... personality={pet.personality} history={pet.history?.timeline} famous={pet.famous} />
  ↓ (client)
读 URL ?text=1 → textMode = true → 渲染 <AtlasTextCard /> (03/04/06)
否则渲染 <SpecimenFrame url={gallery[2]} /> (从 TCB 拉 AI 图)
```

### 4.2 互动数据流 (M2)

```
User 点击 ❤️ 收藏按钮
  ↓
favorites.ts:toggleFavorite(slug)
  ↓ 1. localStorage.setItem (instant, 同步)
  ↓ 2. scheduleSync() 防抖 2s
  ↓
tcbSync.ts:pushFavoritesToTcb(ownerId, list)
  ↓ tcb.database().collection('user_favorites').upsert({ _openid, slugs })
  ↓
[下次 mount profile 页] syncFavoritesFromCloud(ownerId) → 取并集 → 写回 localStorage
```

**冲突解决**:
- **Last-write-wins** (无版本号) — localStorage 立即生效,TCB 异步同步
- **Append-only** (diary) — 用 entryId 去重
- **Max-merge** (progression) — XP / streak 取 max, badges 取并集

### 4.3 登录态切换

```
User 登录
  ↓
auth.ts:login(email, password)
  ↓ PBKDF2-SHA256(email, password, storedSalt, 100k) === storedHash
  ↓ sessionToken = base64url(32 bytes random)
  ↓ localStorage.setItem('auth-session', { userId, email, token, expiresAt })
  ↓
deviceId.ts:bindDeviceToCurrentUser(did)
  ↓ 首次生成 deviceId 时自动 bind,后续 user → device 1:1
  ↓
notifyAuthChange() → 触发 Header 重新渲染
  ↓
所有 tcbSync 函数 getOwnerId() 返回 userId (而非 deviceId)
```

---

## 5. 部署

### 5.1 GitHub auto-deploy (Vercel)

```
git push origin main
  ↓ Vercel webhook 触发
  ↓
vercel build
  ↓ prebuild: build-pets-data + build-pwa-assets
  ↓ next build (output: export)
  ↓ 上传 web/out/ → Vercel CDN
  ↓
production: https://out-three-tan.vercel.app
```

**build time**:~4.5s (compile) + 2.2s (214 static pages)
**deploy time**:~38s total

### 5.2 SSO / 域名

- Project: `pet-receiver` (mishishis-projects org)
- Project ID: `prj_PchVOOdr5hyDpcQhzq05Ttrgwg2U`
- Custom domain: `out-three-tan.vercel.app`
- SSO bypass: `ssoProtection.deploymentType = "all_except_custom_domains"`

---

## 6. 性能 & 优化

| 项 | 当前 | 优化策略 |
|----|------|----------|
| 首屏 HTML | ~20KB | 静态预渲染 + 最小 SSR |
| Atlas 图加载 | 2-3MB/张 (懒加载) | 只 pre-current + 邻页,其他懒加载 |
| Atlas 文字版 | 5KB | SSR 完整 HTML,零额外请求 |
| Cloud-pet 立绘 | 1-2MB/张 | TCB CDN + img lazy + responsive |
| TCB 数据库查询 | 50-200ms | 5 个集合按需 query,防抖写入 |
| Service Worker 缓存 | CacheFirst | 静态资源 30 天,HTML SWR 1 天 |

**Bundle 拆分**:
- `AtlasTextCard` 跟 AtlasViewer 同 chunk (用 AtlasViewer 时才加载)
- 登录态组件单独 chunk (`AuthMenu`)
- PWA prompt 单独 chunk (5s 后才挂载)

---

## 7. 已知 trade-off

| 决策 | 收益 | 代价 |
|------|------|------|
| Atlas 文字版 default | 0 字体风险 + 6×加载速度 | 失去 AI 图的视觉冲击 |
| localStorage 主 + TCB 兜底 | 0 延迟交互 | 多设备数据有 last-write-wins 风险 |
| PBKDF2 本地鉴权 (Stage 1) | 不依赖后端,可演示 | 跨设备登录 = Stage 3 才支持 |
| TCB 国内 CDN | 国内访问快 | 海外访问稍慢 |
| 资源 gitignore (走 TCB) | repo 体积小 (~几 MB) | clone 后首次访问要等 TCB 拉图 |
| 静态导出 (output: export) | Vercel CDN 静态托管,部署快 | 不支持 SSR API route,dynamic route 受限 |

---

## 8. 未来方向

详见 [`README.md` Roadmap](./README.md#-roadmap)

**短期 (v1.1)**:
- 删 `art/` 下 03/04/06 AI 图(释放 ~600MB)
- Atlas OG image 优化
- i18n 中英双语

**中期 (v1.5)**:
- 100→200 breed 扩张
- TCB `users` collection (需备案)
- 微信扫码登录

**远期 (v2.0)**:
- Native app (Capacitor)
- 真实 TCB 跨设备登录同步
- 用户生成内容 (UGC) 社区

---

## 9. 常见问题

**Q: 怎么加新 breed?**
A: 见 [`docs/ATLAS-PIPELINE.md`](./ATLAS-PIPELINE.md)。流程:`content/pets/{slug}.json` → 跑 `render-prompts.mjs` → image_synthesize → 上传 TCB → commit。

**Q: Atlas 模板改了,要重跑所有图吗?**
A: 改 4 套模板 → 渲染 prompt → 重跑 → 验证 OCR 无 hex code → 替换 TCB 资源。约 100 张图 = 50 token。

**Q: 怎么调图片 hex code 问题?**
A: prompt 里 **绝对不要** 写 hex (例如 `#F5EFE0`)。改用色彩名 (`oat beige`)。AtlasTextCard 现在是 SSR HTML,根除这个风险。

**Q: 部署失败怎么 debug?**
A: `vercel ls --prod` 看历史 → 拿 deployment id → `curl https://api.vercel.com/v2/deployments/{id}/events` 看日志。Vercel 详情页有完整 build log。

**Q: 资源走 TCB 后,如何避免 CORS / 防盗链?**
A: TCB bucket 默认允许 CORS (`*`)。如果加 referer 限制,需要在 `next.config.ts` 的 `images.remotePatterns` 加 TCB domain(已经配了)。
