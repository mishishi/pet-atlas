# 🐾 pet-atlas

> A flip-page visual encyclopedia for pet lovers — 6-page vintage museum specimen card atlas per breed (犬 / 猫 / 兔 / 仓鼠 / 鹦鹉 / 守宫)

一个面向移动端的宠物品种百科 App。每个品种是一份 9:16 翻页式图鉴(博物馆标本卡风格),包含 **6 张精心绘制的视觉页面**:封面 / 形态 / 性格 / 历史 / 养护 / 名场面。

**线上地址** · https://out-three-tan.vercel.app

---

## ✨ 项目亮点

- **50 个品种**:15 犬 + 12 猫 + 12 小型哺乳 + 4 鸟 + 7 爬虫
- **300 张图谱**:全部由 AI 生成,统一 **vintage museum specimen card** 风格
- **6 张/品种**:封面 + 形态特征表 + 性格雷达 + 演化时间线 + 养护指南 + 名场面
- **4 套模板**:犬 / 猫 / 小型哺乳 / 鸟+爬虫,各物种专属装饰
- **可翻页图鉴 Viewer**:移动端友好的触摸翻页体验
- **每张图配 prompt 文档**:同目录 `.md` 文件,方便追溯

---

## 🎨 视觉风格

| 角色 | Hex | 用法 |
|------|-----|------|
| 主背景 Oat 燕麦 | `#F5EFE0` | 所有页面底色 |
| 卡片中心 Sand 沙 | `#E8D9B8` | 卡片/画框内 |
| 强调 Warm Brown 暖棕 | `#8B6F47` | 边框、图标、文字 |
| 点缀 Mint 薄荷 | `#A8C5A0` | 叶片、装饰 |

**核心 4 件套**(每张图必带):
1. Vintage museum specimen card aesthetic(博物馆标本卡)
2. Healing hand-drawn watercolor + flat info graphic
3. Real pet photo anchor(1-2 张,占画面 1/4-1/3)
4. Decorative frame border in warm brown(暖棕画框)

详细规范见 [`prompts/_shared-style-guide.md`](./prompts/_shared-style-guide.md)

---

## 🏗️ 项目结构

```
pet-receiver/
├── art/                    # AI 生成的 6×50 = 300 张图谱原图
│   ├── dog/                # 15 犬
│   ├── cat/                # 12 猫
│   ├── small-mammal/       # 12 小型哺乳
│   └── bird-reptile/       # 11 鸟+爬虫
│
├── content/pets/           # 50 个品种的元数据 JSON
│   └── README.md           # Schema 文档
│
├── prompts/                # Prompt 模板库
│   ├── README.md
│   ├── _shared-style-guide.md
│   ├── _template-1-dog.md
│   ├── _template-2-cat.md
│   ├── _template-3-small-mammal.md
│   └── _template-4-bird-reptile.md
│
├── scripts/                # 批量跑图 + 工具脚本
│   ├── BATCH-RERUN.md
│   ├── render-prompts.mjs  # 模板 → 最终 prompt
│   ├── vintage-paper-batch.mjs  # 扫描生成 50 品种清单
│   └── ...
│
├── web/                    # Next.js 16 + React 19 应用
│   ├── app/                # App Router
│   │   ├── page.tsx        # 首页
│   │   └── pets/
│   │       ├── page.tsx            # 50 品种列表
│   │       └── [slug]/
│   │           ├── page.tsx        # 品种详情
│   │           └── atlas/
│   │               ├── page.tsx    # 静态导出
│   │               └── AtlasViewer.tsx  # 翻页 viewer
│   ├── lib/                # pets.ts, atlas-constants.ts, types.ts
│   ├── public/             # 构建用图(从 art/ 同步)
│   ├── out/                # 构建产物(1GB,不进 git)
│   ├── next.config.ts
│   └── package.json
│
└── README.md               # 你正在看
```

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm / pnpm / yarn
- macOS / Linux(开发)/ Vercel(部署)

### 本地开发

```bash
cd web
npm install
npm run dev
# 打开 http://localhost:3000
```

### 本地预览(推荐)

```bash
# 先 build 一次
cd web
npm run build       # 输出到 web/out/

# 静态 server 测试
npx serve web/out -l tcp://0.0.0.0:3000
# 或:cd web/out && python3 -m http.server 3000
```

打开 `http://localhost:3000`,依次查看:
- `/` — 首页(博物馆风)
- `/pets/` — 50 品种卡片
- `/pets/labrador-retriever/` — 单品种详情 + 6 张图谱
- `/pets/labrador-retriever/atlas?page=1` — 翻页图鉴 viewer

### 部署到 Vercel

```bash
cd web/out
npx vercel --prod --yes
# 部署后得到一个 https://out-*.vercel.app URL
```

**注意:** `web/out/` 是构建产物(~1GB),已经在 `.gitignore` 里。部署时 vercel CLI 会读取本地目录上传。

---

## 🔄 重新生成图谱

如果你想跑新一批图(或者跑失败重试):

```bash
# 1. 扫描所有品种,生成清单
node scripts/vintage-paper-batch.mjs

# 2. 渲染 prompt(从模板 + JSON 替换占位)
node scripts/render-prompts.mjs <slug>          # 打印 6 个 prompt
node scripts/render-prompts.mjs <slug> --write  # 写到 art/{cat}/{slug}/XX.md
node scripts/render-prompts.mjs <slug> --write --copy-web  # 同步到 web/public

# 3. 调用 image_synthesize 跑图(需要 LLM token)
# 详见 scripts/BATCH-RERUN.md
```

---

## 📦 50 品种清单

| Category | 品种 |
|----------|------|
| 🐕 **犬 (15)** | 拉布拉多 · 金毛 · 柯基 · 柴犬 · 边牧 · 法斗 · 比熊 · 腊肠 · 雪纳瑞 · 博美 · 萨摩耶 · 哈士奇 · 贵宾 · 吉娃娃 · 阿拉斯加 |
| 🐈 **猫 (12)** | 英短 · 阿比 · 美短 · 中华狸花 · 加菲 · 缅因 · 橘 · 波斯 · 金吉拉 · 布偶 · 暹罗 · 斯芬克斯 |
| 🐹 **小哺乳 (12)** | 叙利亚仓鼠 · 中国仓鼠 · 公婆鼠 · 三线鼠 · 荷兰兔 · 安哥拉兔 · 垂耳兔 · 雷克斯兔 · 豚鼠 · 长尾龙猫 · 雪貂 · 刺猬 |
| 🦜 **鸟 (4)** | 非洲灰鹦鹉 · 虎皮鹦鹉 · 玄凤 · 牡丹鹦鹉 |
| 🐍 **爬虫 (7)** | 球蟒 · 睫角守宫 · 希腊陆龟 · 豹纹守宫 · 巴西龟 · 俄罗斯陆龟 · 苏卡达陆龟 |

---

## ⚠️ 注意事项

1. **token 消耗**:50 × 6 = 300 张图,一次跑完约消耗 150-180 个 LLM token。
2. **web/out/ 是 1GB 构建产物**,**不要 commit**,已在 `.gitignore`。
3. **prompt 模板一旦改了**,所有依赖的图都要重新跑(否则风格不统一)。
4. **GitHub 部署时**:因 web/out/ 太大,推荐 [Vercel CLI 直接部署](https://vercel.com/docs/cli) 而非 git 集成。

---

## 🛠️ 技术栈

- [Next.js 16](https://nextjs.org) + React 19(App Router + 静态导出)
- TypeScript strict mode
- Tailwind CSS v4
- 内置字体用 system font(避免 Google Fonts 网络问题)
- LLM: image_synthesize(每张图平均 30-50s)

---

## 📜 License

MIT — 自由使用、修改、分发。

