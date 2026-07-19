# 03 · 品种详情页(拉布拉多)

> 单一品种详情页 UI,核心体验验证

| 字段 | 值 |
|------|----|
| 文件 | `art/03-breed-detail.png` |
| 用途 | 单一品种详情页 UI |
| 比例 | 9:16 |
| 分辨率 | 2K(1536×2752) |
| 模型 | GPT-4o Image |
| 文字内容 | 品种名/拉丁名/原产地/4 个快速属性/6 张图谱缩略图/CTA 按钮 |

---

## Prompt

```text
9:16 vertical iPhone 15 Pro screen mockup, full UI design draft for a pet encyclopedia app breed detail page for Labrador Retriever. Healing hand-drawn style with watercolor illustration + real pet photo. iOS status bar at top. Top: full-bleed hero photo of a happy Labrador retriever with watercolor edges fading into oat background. Overlay: small back button, share button, favorite heart button. Middle: breed name '拉布拉多寻回犬' in bold rounded Chinese, latin name 'Labrador Retriever' in handwritten English, small chip '原产地 · 加拿大'. Quick stats row: 体重 25-32kg · 寿命 10-12年 · 性格 9/10 · 亲人度 8/10. Below: section title '6 张图谱' with horizontal scroll of 6 small thumbnail cards (cover, traits, personality radar, history, care, fun facts). Bottom: sticky CTA button '开始图鉴'. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47. Style: iOS 17 + healing hand-drawn + info graphic, soft rounded corners 16px.
```

---

## 工具适配

| 工具 | 加什么 |
|------|--------|
| Midjourney | `--ar 9:16 --v 6.1 --style raw --iw 0.6`(低 iw 让文字占主导) |
| Stable Diffusion (Flux) | ControlNet 锁定 iPhone 屏幕比例 + 顶部大图布局,Realistic Vision 锁真实狗 |
| Ideogram | 渲染中文最佳,可优先尝试 |
