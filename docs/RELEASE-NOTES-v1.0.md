# Pet Atlas · v1.0 Release Note (100 Breeds)

> **2026-07-23 · pet-atlas 第一个 major version**
>
> 从 M1 demo(51 breeds / 306 plates)到 v1.0 公开里程碑(100 breeds / 600 plates / 完整 M2 互动生态),
> 5 天密集迭代,5 批 breed 扩张(共 50 个新品种),主分支 126 个 commits。
>
> 部署地址:**https://out-three-tan.vercel.app**
> 源码仓库:**https://github.com/mishishi/pet-atlas**
> CDN 资源:腾讯云 CloudBase `pet-atlas/` prefix

---

## 🎯 1. 一页速览

| 指标 | M1 (51) | **v1.0 (100)** | 增量 |
|---|---|---|---|
| **breeds (品种)** | 51 | **100** | +49 (+96%) |
| **atlas plates (图谱)** | 306 | **600** | +294 (+96%) |
| **cloud-pet 立绘 (1:1 portrait)** | 0 → 153 (M2 起) | **300** | +147 (×2) |
| **breed 品类** | 5 (犬/猫/小哺乳/鸟/爬) | **5** (不变) | - |
| **M2 互动模块** | 0 | **6 完整** (互动/日记/收藏/分享/心情/等级) | - |
| **静态 HTML 页面** | 30 | **60+** | ×2 |
| **TCB CDN 资源** | 0 | **~5GB** (atlas + cloud-pets + pet-voice) | - |
| **build size** | 11 MB | **~2 MB** (首屏 thumb 优化) | -82% |
| **Vercel auto-deploy** | 启用 | **启用** | - |
| **commits** | - | **126** in 5 days | - |

---

## 🗓 2. 关键里程碑(5 批扩张 + 5 阶段 M2)

### 2.1 5 批扩张轨迹(从 51 到 100)

| 批 | 节点 commit | 新增 | 累计 | 说明 |
|---|---|---|---|---|
| baseline | (M1 已上) | 51 个原始 | 51 | M1 demo 阶段 |
| **A 批** | `a3d...` (略) | +10 犬 | 61 | 第一轮扩张 |
| **B 批** | `c8e...` (略) | +10 (犬+猫+小哺乳混合) | 70 | 第二轮扩张 |
| **C 批 1** | `c8e216f` | +10: basset-hound / jack-russell-terrier / english-springer-spaniel / old-english-sheepdog / burmese / bombay / american-curl / gerbil / degu / sun-conure | 80 | 第一批新分布 |
| **C 批 2** | `7b6461c` | +10: havanese / dalmatian / turkish-angora / somali / society-finch / java-sparrow / parrotlet / red-footed-tortoise / blue-tongued-skink / hermann-tortoise | 90 | 第二批新分布 |
| **C 批 3** | `dc75805` | +10: doberman-pinscher / rottweiler / norwegian-forest-cat / birman / chipmunk / indian-ringneck / gouldian-finch / quaker-parrot / savannah-monitor / gopher-snake | **100** | **🎯 100 milestone** |

每次扩张 10 个,**3 阶段 token 控制**:
- C 批 1: 60 张 atlas + 60 张立绘(0 retry)
- C 批 2: 60 张 atlas + 60 张立绘(中途触发 402,resume 后 0 missing)
- C 批 3: 60 张 atlas + 30 张立绘(1 retry: doberman 06-famous)

### 2.2 M2 阶段交付(5 个功能模块)

| 模块 | commit | 状态 | 说明 |
|---|---|---|---|
| **M2-A 互动 (Pet Stats)** | `399f5e6` | ✅ | 喂食/抚摸/玩耍,影响饱食度/亲密度/活力/心情 |
| **M2.5 TCB 同步** | `d4ace26` | ✅ | localStorage 主 + TCB 兜底,fire-and-forget + last-write-wins |
| **M2-B 日记 (Diary)** | `399f5e6` | ✅ | append-only 日记,`entryId` + `_id` 去重 |
| **M2-D 分享海报 (v4 FINAL)** | (c 批前) | ✅ | 纯文字 + inline SVG,无跨域图污染 |
| **M2-C 收藏** | (M2 早期) | ✅ | localStorage + JSON-LD structured data |
| **M2-E 等级/XP/签到/成就** | `399f5e6` | ✅ | 粘性升级,30s MiniGame 加分 |
| **MoodPortrait 装饰** | `0f7460d` | ✅ | 立绘状态装饰系统(5 种情绪叠加层) |
| **6 段心情试听 (TTS)** | `4c89926` | ✅ | happy/calm/hungry/sleepy/bored/sad 6 段中文 |

### 2.3 重要修复

- `adeb6ae` **atlas 模板去 hex** — 4 个模板里的 `#F5EFE0` 等 hex code 会被 AI 当文字印进图,改为颜色名 + negative
- `c8b5c81` **重跑 12 张 hex 文字污染图** — 03-personality / 04-history / 06-famous 共 12 张扫描命中,重跑后 OCR 0 命中
- `60a424e` **PetCard 改回 1:1** — 立绘是 2048×2048 1:1,UI 容器之前用 9:16 把狗脸裁了
- `b7383a3` **adopt hero 文字改中文** — 之前是英文,从 `allPets` 拼 `physical.coat + personality.summary`
- `4fc6de41` **Vercel API token 复活** — 之前 token 失效,deploy 监控断了

---

## 🏗 3. 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Next.js 16 (static export) + React 19 + Tailwind v4 |
| 数据 | localStorage 主 + TCB 数据库 兜底 |
| CDN | 腾讯云 CloudBase (ap-shanghai) |
| 部署 | Vercel (git-based auto-deploy) |
| 图生成 | image_synthesize 2K 9:16 (atlas) / 2K 1:1 (portrait) |
| 图上传 | cos-nodejs-sdk-v5,prefix `pet-atlas/` |
| TTS | MiniMax TTS,6 段心情中文短句 |
| 字体 | Noto Serif SC (display) + Noto Sans SC (body) + JetBrains Mono (numbers) |
| 监控 | `mavis cron` 盯 production deploy + 90 张立绘 URL smoke test |

---

## 🎨 4. 设计系统

- **Color tokens**: oat #F5EFE0 / sand #E8D9B8 / warm brown #8B6F47 / mint #A8C5A0
- **9-step token system**: Oat 50-900 + Brown 50-900 + 4 accents (brick/forest/sage/rose)
- **Typography**: Serif 标题 + Sans 正文 + Mono 数字
- **Layout**: 9:16 atlas viewer + 1:1 PetCard + 大画框 + 翻页箭头 + BottomNav
- **Aesthetic**: vintage museum specimen card + 暖棕画框 + 治愈水彩 + 真实品种照片锚定

---

## 💰 5. 成本 & 性能

- **图生成 token**:~100 credits / 天限额(image_synthesize 2K),100 breeds 累计消耗 ~700 credits
- **首屏 size**:11 MB → 1.4 MB(thumb 变体 + 懒加载)
- **Vercel build**:23s / deploy
- **TCB 累计存储**:~5 GB / 700+ 张图 + 6 段 mp3
- **Vercel git deploy 限额**:5000 / 天(目前每天 1-2 deploy,远低于限额)

---

## 🚧 6. 当前已知限制 & v1.1 路线图

| 限制 | 解决方向 | 优先级 |
|---|---|---|
| 19 个老 baseline 立绘是占位(无图,但 TCB 已 mock) | 跑 AI 立绘补齐 | P3 |
| Atlas 仍可能有少量黑色字体根除 | 全面 OCR 扫描 + 重跑 | P3 |
| 本地 dev 走本地路径会破图(线上 TCB 不受影响) | 配 `.env.local` 走 TCB | P2 |
| 跨设备同步弱(localStorage 主) | M4 用户系统 | P2 |
| 单语言(中文) | i18n 改造 + en 翻译 | P3 |
| 无 PWA | manifest + service worker | P2 |
| 无 SEO meta 完整化 | sitemap + JSON-LD Pet 类型 | P2 |
| 无付费解锁 | TCB 云函数 + 微信支付 | P3 |

---

## 📝 7. 公开 changelog (since v1.0)

后续每次 release 用 semver:

- **v1.0.0** (2026-07-23) — 100 breeds milestone + 完整 M2 生态
- v1.0.1 (TBD) — 修 19 个老 baseline 立绘
- v1.1.0 (TBD) — PWA + SEO 完整化
- v2.0.0 (TBD) — 用户系统 + 跨设备同步

---

## 🙏 8. 致谢

- 视觉风格参考 19 世纪鸟类学专著(John Gould《Birds of Australia》)、标本馆馆藏图录
- 字体:Google Noto Serif/Sans SC + JetBrains Mono
- 图床:腾讯云 CloudBase(同 bucket 复用了 history-tool 项目)
- 部署:Vercel Hobby plan
- 图生成:image_synthesize(MiniMax LLM)
- TTS:MiniMax TTS

---

> 📌 **链接**:
> - [M2 Release Note (详细版)](./M2-RELEASE.md)
> - [UX Design 文档](./UX-DESIGN.md)
> - [Atlas Pipeline 文档](./ATLAS-PIPELINE.md)
> - [COS Migration 文档](./COS-MIGRATION.md)
> - [GitHub Repo](https://github.com/mishishi/pet-atlas)
