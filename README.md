# 🐾 Pet Atlas · 宠物大百科

> 一个面向移动端的宠物品种百科 App。  
> 每只宠物 = 一份 9:16 翻页式标本卡图鉴 + 一只可领养的云养电子宠物。  
> **Vintage museum specimen card** 美学 + **治愈手绘水彩** + **信息图** 三合一。

**线上地址** · https://out-three-tan.vercel.app  
**GitHub** · https://github.com/mishishi/pet-atlas

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/PWA-Ready-5a0fc8?logo=pwa" alt="PWA" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT" />
</p>

---

## ✨ 项目亮点

### 📚 **100 个品种 · 600 张图谱 · 300 张立绘**

5 大品类全覆盖:🐕 犬 30 · 🐈 猫 24 · 🐹 小型哺乳 18 · 🦜 鸟 17 · 🐍 爬虫 11

### 🎨 **6 页图鉴 · Vintage 标本卡风格**

每只宠物 = 6 页翻页式图鉴:
1. 封面 · 2. 形态特征 · 3. 性格雷达 · 4. 演化时间线 · 5. 养护指南 · 6. 名场面

### 📖 **Atlas 文字版 (v0.6)** — 根除 AI 图字体风险

03 / 04 / 06 槽位默认采用 **纯 HTML 文字卡片** 替代 AI 生成图。
- 加载快 600 倍(5KB vs 2-3MB)
- SEO 全文索引(适合 GSC 收录)
- **AI 图版** 仍可通过 toggle 切回(用户偏好自动记忆)

### 🐾 **云养电子宠物** + 互动生态(M2)

每只宠物有 1:1 立绘 + 6 段心情语音 + 等级/经验/连续打卡。
- ✋ 摸摸 · 心情按钮 · 好感度
- 📔 心情日记(append-only + last-write-wins 同步)
- ❤️ 收藏 · 等级 · 称号
- 📤 分享海报(纯文字 + SVG 渲染)

### 👤 **用户系统 (M4)** — 邮箱密码 + 跨设备同步

- 本地 PBKDF2-SHA256 100k 哈希 + per-user salt
- 30 天 session TTL
- 登录后 favorites / progression 自动云同步(腾讯云 CloudBase)

### 📱 **PWA + SEO 完整化 (M3)**

- `manifest.webmanifest` · `sitemap.xml` · `robots.txt`
- Service Worker (CacheFirst + SWR + NetworkFirst)
- JSON-LD 结构化数据(WebSite + Organization + Pet schema)
- 离线 fallback 页面

### ⌨️ **键盘友好的翻页 Viewer**

- `←/→` 翻页 · `F` 全屏 · `T` 文字版 · `Home/End` 首尾
- CSS 3D flip + 交叉淡入
- 触摸滑动(移动端)
- 6 缩略图导航 + lazy load

---

## 🎨 视觉规范

| Token | Hex | 用途 |
|-------|-----|------|
| Oat 燕麦 | `#F5EFE0` | 主背景 |
| Sand 沙 | `#E8D9B8` | 卡片中心 |
| Warm Brown 暖棕 | `#8B6F47` | 边框 / 图标 / 文字 |
| Mint 薄荷 | `#A8C5A0` | 叶片 / 装饰 |

**字体**:Noto Serif SC (display) · Noto Sans SC (body) · JetBrains Mono (数字)

每张图谱遵守 **4 件套**:
1. Vintage museum specimen card 美学
2. 治愈手绘水彩 + 信息图
3. 真实宠物照片锚点(占画面 1/4-1/3)
4. 暖棕装饰画框

---

## 🏗️ 项目结构

```
pet-atlas/
├── web/                          # Next.js 16 应用
│   ├── app/                      # App Router
│   │   ├── page.tsx              # 首页
│   │   ├── pets/                 # 100 品种列表 + 详情 + atlas
│   │   ├── login/  register/     # 邮箱密码登录注册
│   │   ├── profile/              # 个人中心 (等级/收藏/打卡)
│   │   ├── adopt/                # 领养云宠物
│   │   ├── about/                # 项目介绍
│   │   ├── offline/              # 离线 fallback
│   │   ├── manifest.webmanifest  # PWA 配置
│   │   ├── sitemap.xml           # 205 条 URL
│   │   └── sw.js                 # Service Worker
│   ├── components/               # 共享组件
│   │   ├── auth/                 # 登录态菜单
│   │   ├── brand/                # SpecimenFrame / BotanicalBorder
│   │   ├── cloud-pet/            # 云宠物立绘 + 心情
│   │   ├── nav/                  # Header / Footer
│   │   ├── pwa/                  # PWA 安装引导
│   │   └── ui/                   # Button / SafeImage 等
│   ├── lib/                      # 业务逻辑
│   │   ├── pets.ts               # 100 breed 元数据 (server-only)
│   │   ├── auth.ts               # 邮箱密码 + PBKDF2
│   │   ├── tcb.ts + tcbSync.ts   # 腾讯云同步层
│   │   ├── favorites.ts          # 收藏 + 云同步
│   │   ├── petProgression.ts     # 等级 + 经验
│   │   ├── petDiary.ts           # 心情日记
│   │   └── cloudPet.ts           # 云宠物状态机
│   ├── public/                   # 静态资源(部分 gitignore)
│   └── scripts/                  # build 脚本
│       ├── build-pets-data.mjs   # 预生成 pet metadata
│       └── build-pwa-assets.mjs  # 预生成 PWA 静态文件
│
├── content/pets/                 # 100 品种元数据 JSON
├── prompts/                      # Atlas 4 套模板 + 风格指南
├── scripts/                      # Atlas 批量跑图工具
├── docs/
│   ├── RELEASE-NOTES-v1.0.md     # v1.0 完整发布说明
│   ├── M2-RELEASE.md             # M2 互动生态发布
│   ├── UX-DESIGN.md              # UX 设计规范
│   ├── ATLAS-PIPELINE.md         # Atlas 批量生成流程
│   ├── COS-MIGRATION.md          # TCB CDN 迁移
│   └── GITHUB-DEPLOY.md          # GitHub auto-deploy 流程
│
└── README.md                     # 你正在看
```

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- macOS / Linux(开发) / Vercel(部署)

### 本地开发

```bash
git clone https://github.com/mishishi/pet-atlas.git
cd pet-atlas/web
npm install
npm run dev
# 打开 http://localhost:3000
```

### 本地预览(推荐)

```bash
cd web
npm run build       # 预生成 PWA + pets data + 静态导出
npx serve out -l tcp://0.0.0.0:3000
```

依次查看:
- `/` — 首页(博物馆风)
- `/pets/` — 100 品种卡片
- `/pets/labrador-retriever/` — 拉布拉多详情
- `/pets/labrador-retriever/atlas?page=3` — 性格雷达 (默认文字版)
- `/pets/labrador-retriever/atlas?page=3&text=0` — 性格雷达 (AI 图版)
- `/login` · `/register` — 用户系统
- `/profile` — 个人中心

### 部署到 Vercel

项目已配 **GitHub auto-deploy**:每次 `git push origin main`,Vercel 自动 build + 部署到生产环境。

不需要任何手动操作。

---

## 🛠️ 技术栈

- **Framework**: [Next.js 16](https://nextjs.org) + React 19(App Router + 静态导出)
- **Language**: TypeScript strict mode
- **Styling**: Tailwind CSS v4(@theme tokens + utilities)
- **Animation**: CSS 3D transforms + keyframes
- **State**: React useState + useEffect(localStorage 主 + TCB 兜底)
- **Backend**: 腾讯云 CloudBase (auth + database + storage)
- **Auth**: 邮箱密码 PBKDF2-SHA256 100k(本地)+ TCB `_openid` 主键
- **PWA**: Service Worker (CacheFirst + SWR + NetworkFirst)
- **SEO**: JSON-LD + sitemap + robots + canonical
- **Build**: 输出 `web/out/` 静态文件,CDN 资源走 TCB

---

## 📊 项目数据

| 指标 | 数值 |
|------|------|
| 品种数 | **100** (5 品类) |
| Atlas 图谱 | **600** 张(6 张/品种) |
| Cloud-pet 立绘 | **300** 张(3 张/品种) |
| 静态 HTML 页面 | **60+** (含 atlas 子页) |
| 主页 + 详情 + 列表 | **214** 静态路由 |
| 资源 CDN | 腾讯云 CloudBase `pet-atlas/` prefix |
| TCB 集合 | 5 个(`pet_stats` / `cloud_pets` / `pet_diary` / `pet_progression` / `user_favorites`) |

---

## 🗺️ Roadmap

### v1.0 ✅(当前)
- 100 breeds + 600 plates + 300 portraits
- M2 互动生态(6 模块)
- M3 PWA + SEO
- M4 用户系统(stage 1+2+2.5)
- Atlas 文字版 v0.6(default)

### v1.1(规划中)
- 删 `art/` 下 03/04/06 AI 图(释放 ~600MB)
- README + 文档完整化
- Atlas OG image 优化(social share)
- M4 stage 3: TCB `users` collection 跨设备登录同步

### v2.0(远期)
- 100 → 200 breeds(再扩 50 兔/貂/稀有爬虫/海鱼)
- 微信扫码登录(国内场景)
- i18n 中英双语
- 移动端 native app 封装(Capacitor)

---

## 📦 100 品种一览

> 完整清单见 [`content/pets/`](./content/pets/)

| 品类 | 数量 | 代表品种 |
|------|------|---------|
| 🐕 犬 | 30 | 拉布拉多 · 金毛 · 柯基 · 柴犬 · 边牧 · 法斗 · 哈士奇 · 萨摩耶 · 贵宾 · 雪纳瑞 · 博美 · 腊肠 · 比熊 · 吉娃娃 · 阿拉斯加 · 巴吉度 · 杰克罗素梗 · 英国跳猎犬 · 英国古代牧羊犬 · 哈瓦那犬 · 斑点狗 · **杜宾** · **罗威纳** ... |
| 🐈 猫 | 24 | 英短 · 美短 · 布偶 · 暹罗 · 缅因 · 加菲 · 波斯 · 阿比 · 橘 · 金吉拉 · 斯芬克斯 · 中华狸花 · 缅甸 · 孟买 · 美国卷耳 · **挪威森林猫 · 索马里 · 土耳其安哥拉 · 伯曼** ... |
| 🐹 小型哺乳 | 18 | 叙利亚仓鼠 · 中国仓鼠 · 荷兰兔 · 安哥拉兔 · 垂耳兔 · 豚鼠 · 龙猫 · 雪貂 · 刺猬 · 沙鼠 · 八齿鼠 · **花栗鼠** ... |
| 🦜 鸟 | 17 | 非洲灰鹦鹉 · 虎皮鹦鹉 · 玄凤 · 牡丹鹦鹉 · 太阳锥尾鹦鹉 · 太平洋鹦鹉 · 斑胸草雀 · 禾雀 · **印度环颈鹦鹉 · 七彩文鸟 · 虎皮鹦鹉(扩展) · 牧师鹦鹉** ... |
| 🐍 爬虫 | 11 | 球蟒 · 鬃狮蜥 · 睫角守宫 · 豹纹守宫 · 希腊陆龟 · 巴西龟 · 俄罗斯陆龟 · 苏卡达陆龟 · **红腿陆龟 · 蓝舌石龙子 · 赫尔曼陆龟 · 穴居蛇** ... |

---

## ⚠️ 注意事项

- 本项目大量使用 AI 生成图谱,token 消耗较高
- `web/public/{dog,cat,small-mammal,bird-reptile}/` 等图谱目录 gitignore(资源在 TCB)
- `web/public/cloud-pets/pool/` 同上(资源在 TCB)
- 不要 commit `web/out/` (构建产物)
- 详细架构 / 同步策略 / Atlas pipeline 流程见 [`docs/`](./docs/)

---

## 🤝 贡献

欢迎开 Issue 报错或提建议。  
代码贡献流程: Fork → 新分支 → PR → 等待 CI。

---

## 📜 License

[MIT](./LICENSE) © 2026 mishishi

---

## 💬 联系

- 提 Issue: <https://github.com/mishishi/pet-atlas/issues>
- 部署地址: <https://out-three-tan.vercel.app>
