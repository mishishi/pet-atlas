# Atlas 01/06 · 封面

> 拉布拉多 6 张图谱 · 第 1 页:封面首图

| 字段 | 值 |
|------|----|
| 文件 | `art/atlas-01-cover.png` |
| 用途 | 完整图谱第 1 页(封面) |
| 比例 | 9:16 |
| 分辨率 | 2K(1536×2752) |
| 模型 | GPT-4o Image |
| 文字内容 | 品种名/拉丁名/原产地 chip/属性图标 |
| 模板 | 模板 1 · 犬类(已验证) |

---

## Prompt

```text
9:16 vertical visual design, cover page of a pet encyclopedia visual atlas for Labrador Retriever. Healing hand-drawn style with watercolor illustration + real pet photo. Top 60%: a happy Labrador retriever standing in soft oat background with watercolor leaf decorations, full body photo, looking at camera, warm natural light. Bottom 40%: oat background with hand-drawn watercolor paw prints and leaves, breed name '拉布拉多寻回犬' in bold rounded Chinese font, latin name 'Labrador Retriever' in handwritten English, origin chip '原产地 · 加拿大纽芬兰', small icon row with size, weight, lifespan icons. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum-quality pet portrait + healing watercolor + info graphic clarity, suitable as a 9:16 shareable visual.
```

---

## 工具适配

| 工具 | 加什么 |
|------|--------|
| Midjourney | `--ar 9:16 --v 6.1 --style raw --iw 0.7` |
| SD-Flux | ControlNet 锁 9:16 + 顶部 60% 真实狗,加 `pet_portrait_v1` LoRA |
| Ideogram | 中文最佳 |
