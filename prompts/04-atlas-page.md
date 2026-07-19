# 04 · 图谱翻页页(性格雷达图)

> 9:16 全屏图谱(核心差异化页面)

| 字段 | 值 |
|------|----|
| 文件 | `art/04-atlas-personality.png` |
| 用途 | 9:16 全屏图谱(核心差异化页面) |
| 比例 | 9:16 |
| 分辨率 | 2K(1536×2752) |
| 模型 | GPT-4o Image |
| 文字内容 | 页码指示「3 / 6」+ 6 维雷达图 + 元数据卡 + 装饰元素 |

---

## Prompt

```text
9:16 full-screen UI design draft for a pet encyclopedia app visual atlas page, showing the 'Personality Radar' page for Labrador. Healing hand-drawn style with watercolor illustration + flat info graphic. Top: small dot indicator '3 / 6' (page 3 of 6) in warm brown. Main: 6-axis personality radar chart with watercolor edges on oat background. Axes labels in Chinese: 亲人度 8/10, 活跃度 9/10, 服从度 9/10, 独立性 3/10, 吠叫度 4/10, 智商值 9/10. Right side: small info card with '原产地 · 加拿大纽芬兰' and '寿命 · 10-12 年'. Bottom right: small real Labrador photo in circular frame with watercolor ring. Background: oat #F5EFE0 with subtle hand-drawn leaf decorations. Decorative watercolor paw prints in corners. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum infographic + healing watercolor + iOS clarity, suitable as a shareable 9:16 visual.
```

---

## 工具适配

| 工具 | 加什么 |
|------|--------|
| Midjourney | `--ar 9:16 --v 6.1 --style raw --s 80`(高 stylize 让水彩更明显) |
| Stable Diffusion (Flux) | ControlNet 锁定雷达图布局 + 加 `infographic_v1` LoRA |
| 通义万相 | 中文 prompt 强调"博物馆信息图 + 治愈水彩 + 平面设计" |
