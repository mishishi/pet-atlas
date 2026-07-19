# Pet Atlas · Web App

> Next.js 16 + React 19 静态站,展示 50 个宠物品种的 6 页图鉴。

本目录是 pet-receiver 项目的 web 前端子项目。根目录的 [`../README.md`](../README.md) 有项目总览。

## 命令

```bash
# 开发(热更新)
npm run dev

# 静态构建(输出到 out/)
npm run build

# 本地预览构建产物
npx serve out -l tcp://0.0.0.0:3000
# 或:cd out && python3 -m http.server 3000

# 部署到 Vercel
cd out && npx vercel --prod --yes
```

## 关键目录

```
web/
├── app/                  # App Router 页面
│   ├── page.tsx          # 首页
│   └── pets/
│       ├── page.tsx      # 50 品种列表
│       └── [slug]/
│           ├── page.tsx  # 单品种详情
│           └── atlas/
│               ├── page.tsx         # 静态导出
│               └── AtlasViewer.tsx   # 翻页交互组件
├── lib/                  # 工具函数与配置
│   ├── pets.ts           # 50 品种 JSON 扫描 + 图谱 URL 生成
│   ├── atlas-constants.ts  # ATLAS_SLOTS, SLOT_KEYS
│   └── types.ts          # Pet, AtlasSlot 类型定义
├── public/               # 静态资源(从 ../art/ 同步)
│   ├── dog/<slug>/01-cover.png ... 06-famous.png
│   ├── cat/...
│   ├── small-mammal/...
│   └── bird-reptile/...
├── next.config.ts        # output: 'export', trailingSlash: true
├── package.json
└── tsconfig.json
```

## 关键文件

- `lib/pets.ts` — 50 品种图谱的**唯一数据源**。`getBreedAtlas(slug)` 返回 6 张图 URL;`VINTAGE_PAPER_DONE` 是已统一到 vintage paper 风格的品种白名单。
- `app/pets/[slug]/atlas/page.tsx` — 静态生成所有 50 品种的 atlas 页面(generateStaticParams 扫 public/)。
- `app/pets/[slug]/atlas/AtlasViewer.tsx` — 翻页交互(因 `output: 'export'` 模式不能读 searchParams,需要客户端组件处理 page= 查询参数)。

## 部署产物大小

- `web/out/` ≈ 1 GB(主要是 300 张 2K 复古风格图)
- 不要 commit 到 git
- Vercel 免费 plan 单次部署上限 1 GB,刚好够

## 添加新品种

1. 创建 `../content/pets/{slug}.json` — 参见 [`../content/pets/README.md`](../content/pets/README.md) Schema
2. 跑图:用 `../scripts/render-prompts.mjs` 生成 prompt → `image_synthesize` 跑 6 张
3. 复制到 `public/{cat}/{slug}/01-cover.png ... 06-famous.png`
4. 加到 `lib/pets.ts` 的 `VINTAGE_PAPER_DONE`
5. `npm run build` — 自动检测 public/ 目录生成静态页
6. `cd out && npx vercel --prod --yes`
