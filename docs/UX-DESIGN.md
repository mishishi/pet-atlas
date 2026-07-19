# 宠物大百科 · UX/UI 设计语言

> Paper Naturalism · Editorial × Museum Specimen Card
> 2026-07-19 P1 重设计,基于 [design-taste-frontend] skill 工作流

## Design Read

> "Reading this as: **redesign (overhaul) of a pet encyclopedia atlas for design-conscious pet enthusiasts**, with an editorial + museum specimen card language, leaning toward Tailwind v4 + a hand-built design system honoring the existing paper-color palette (oat/sand/warm-brown/mint)."

### Dials
- `DESIGN_VARIANCE: 7` (中等偏高,editorial 偏 symmetry 但有图可适度偏移)
- `MOTION_INTENSITY: 4` (标本卡美学偏静,scroll-reveal + 翻页 + hover)
- `VISUAL_DENSITY: 3` (museum 偏稀疏,大留白)

## Design Tokens

### 颜色 (扩展现有 + 新增)
```
纸色系 (Oat 9 阶):
  --oat-50:  #FCFAF4
  --oat-100: #F8F3E8
  --oat-200: #F5EFE0   ← 主背景
  --oat-300: #EBE3CF   ← 卡片背景
  --oat-400: #DCD0B3
  --oat-500: #C9BC9C
  --oat-600: #A89A78

棕色系 (Brown 9 阶):
  --brown-50:  #F5EFE7
  --brown-100: #E8D9C5
  --brown-200: #D2B999
  --brown-300: #B8956A
  --brown-400: #A07A48
  --brown-500: #8B6F47   ← 现有 accent(等同)
  --brown-600: #6E5635
  --brown-700: #523E24
  --brown-800: #382916
  --brown-900: #2A2520   ← 现有 ink(最深)

辅助色 (新增):
  --brick:     #A44A3F   ← 标本编号 / 强调
  --forest:    #4A5D3A
  --sage:      #A8C5A0
  --rose:      #C68A8A
```

### 字体 (避开 Inter default)
- **Noto Serif SC** (中文衬线,所有 display + 标题)
- **Noto Sans SC** (中文无衬线,正文)
- **JetBrains Mono** (数字 / 标签 / 标本编号)

### 圆角 / 阴影
- 圆角统一 **12px**
- 阴影:`shadow-[0_2px_8px_rgba(139,111,71,0.08)]` (暖棕调,不是纯黑)

## 文件结构 (新增)
```
web/
  components/
    ui/             (Button, Card, Container)
    nav/            (Header, Footer)
    brand/          (HeroEditorial, BreedCard, CategoryStrip, FeaturedBreeds)
  app/
    fonts.ts        (next/font 加载)
    globals.css     (扩展 design tokens)
```

## Anti-patterns
- ❌ AI-purple gradient / neon
- ❌ 3 张等大 feature cards
- ❌ Generic glassmorphism
- ❌ Inter font
- ❌ Em-dash (—) anywhere
- ❌ "Quietly in use at"
- ❌ Scroll cue
- ❌ 3+ consecutive image+text-split

## Theme
- Light only (纸色 + warm, dark 跟 paper 美学冲突)
- No dark mode toggle

## Reduced Motion
- `MOTION_INTENSITY > 3` 必须 honor `prefers-reduced-motion`

## P1 (本次)
- Design tokens
- Fonts
- Components 目录 + 4 个基础组件
- Header nav
- 主页 (全新)
- 列表页 (全新)
- 部署

## P2 (下次)
- 详情页 (全新)
- Atlas 页增强
