# 宠物大百科 · Prompt 库索引

> 每个 prompt 一个独立文件,方便单独调用、跨 AI 工具比较、版本管理。
> 所有图都在 `art/` 目录。

## 目录结构

```
prompts/
├── README.md                          ← 你在这里
├── _shared-style-guide.md             ← 共享视觉规范(色板/字体/风格)
│
├── 01-storefront.md                   ← 4 张核心设计稿
├── 02-home.md
├── 03-breed-detail.md
├── 04-atlas-page.md
│
├── atlas-01-cover.md                  ← 拉布拉多 6 张图谱(模板 1 验证)
├── atlas-02-traits.md
├── atlas-03-personality.md
├── atlas-04-history.md
├── atlas-05-care.md
└── atlas-06-famous.md
```

## 命名规范

- `NN-name.md` — 单页设计稿(01-04 是核心)
- `atlas-NN-name.md` — 完整品种的图谱页(`atlas-01` 到 `atlas-06`)

## 跨 AI 工具复现

每个 prompt 文件都包含「工具适配」小节,告诉你:
- Midjourney 加什么参数
- SD-Flux / SDXL 加什么 LoRA / ControlNet
- 通义万相 / 豆包的中文版怎么写
- Ideogram 怎么用

## 维护规则

- 新加图谱:文件名 `atlas-NN-{breed}-{type}.md`,prompt 复用 `_shared-style-guide.md`
- 调整视觉:**只改 `_shared-style-guide.md`**,所有 prompt 同步生效
- 跨项目复用:把 `_shared-style-guide.md` 拷贝到新项目即可

## 当前进度

- ✅ 共享视觉规范
- ✅ 4 张核心设计稿(商店/首页/详情/图谱页)
- ✅ 1 个完整品种(拉布拉多)6 张图谱 → 模板 1(犬类)验证通过
- ⏳ 待跑:模板 2(猫类)6 张
- ⏳ 待跑:模板 3(小型哺乳)6 张
- ⏳ 待跑:模板 4(鸟+爬宠)6 张
- ⏳ 待批量:15 个犬 + 12 个猫 + 23 个异宠
