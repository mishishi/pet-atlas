# 01 · 商店展示图

> App Store 营销首图 / 整体气质定调

| 字段 | 值 |
|------|----|
| 文件 | `art/01-storefront.png` |
| 用途 | App Store 营销首图 |
| 比例 | 9:16 |
| 分辨率 | 2K(1536×2752) |
| 模型 | GPT-4o Image |
| 文字内容 | 标题「宠物大百科」+ 副标题「治愈系宠物图鉴 · 50+ 品种」 |

---

## Prompt

```text
9:16 vertical visual design mockup for an iOS pet encyclopedia app store marketing image. Healing hand-drawn style with watercolor illustration + flat info graphic + real pet photo anchors. App name '宠物大百科' in bold rounded Chinese font at top, subtitle '治愈系宠物图鉴 · 50+ 品种' in handwritten English. Background: warm oat color #F5EFE0 with hand-drawn watercolor dog and cat silhouettes. Center: a real golden retriever and an orange tabby cat with soft watercolor edges blending into the background. Decorative elements: paw prints, leaves, small museum-style info icons. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Mood: warm, healing, professional yet friendly. Style: high-end museum illustration meets iOS app design. No UI chrome, this is a pure visual mood board for the app.
```

---

## 工具适配

| 工具 | 加什么 |
|------|--------|
| Midjourney | 末尾加 `--ar 9:16 --v 6.1 --style raw --s 50` |
| Stable Diffusion (Flux) | 加 LoRA `healing_watercolor_v1`,sampler DPM++ 2M,steps 30,CFG 4 |
| 通义万相 | 中文版:「治愈系手绘水彩 + 平面信息图 + 真实宠物照片,9:16 比例,App Store 营销图」 |
| Ideogram | 文字渲染更准,保持 9:16 |
