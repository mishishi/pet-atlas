# cloud-pet v1 · 英国短毛猫 (British Shorthair) · 圆圆

- breed: british-shorthair
- breedZh: 英国短毛猫
- breedEn: British Shorthair
- variant: 1
- personality: curious
- petName: 圆圆
- aspect: 1:1
- resolution: 2K (2048×2048)
- generated: 2026-07-20

## Prompt

```text
A vintage museum specimen card aesthetic portrait of a young cute British Shorthair. Healing hand-drawn watercolor illustration with a single pet as the hero subject, occupying center 70% of the frame, looking at camera with playful and curious expression, bright alert eyes, soft natural light. **Distinctive British Shorthair features: British Shorthair: solid blue-grey (slate blue) plush dense coat, iconic cobby round body shape, broad chest, round face with chubby cheeks, large round copper eyes, short thick legs.** Subtle paper texture background (oat #F5EFE0), decorative simplified frame border in warm brown #8B6F47 with hand-drawn paw prints and fish bones and feathers at four corners, **no extra sketch lines, clean thin border**. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Bottom-right small text "圆圆" in rounded Chinese font (PingFang Rounded). Bottom-left small chip "英国短毛猫" in handwritten style. Mood: warm, healing, professional yet friendly. Style: high-end museum pet portrait + healing watercolor, square 1:1 aspect, no info graphic, no charts, just one beloved pet, exactly one pet, no other animals in frame, plain paper texture background, no scenery.
```

## 参考图

- `art/cat/british-shorthair/01-cover.png` (绝对路径作 `input_file_paths` 锁定品种外貌)

## 备注

- 2026-07-20 补齐:之前 50/51 品种 × 3 变体已生成,british-shorthair v1 缺,补上。
- variantIndex 1 = curious 性格,主色 #F5EFE0 暖底 + 暖棕边框,1 张主体,四角 paw + fish bone 装饰。
- 失败 case (历史): 早期 v1 prompt 缺 "blue-grey" + "cobby body" 关键 breed features,AI 画成"通用灰猫"。本次 v2 prompt 模板已修复 (见 `prompts/cloud-pet-portrait.md`)。
