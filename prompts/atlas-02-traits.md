# Atlas 02/06 · 形态特征

> 拉布拉多 6 张图谱 · 第 2 页:形态特征对比表

| 字段 | 值 |
|------|----|
| 文件 | `art/atlas-02-traits.png` |
| 用途 | 完整图谱第 2 页(形态特征) |
| 比例 | 9:16 |
| 分辨率 | 2K(1536×2752) |
| 模型 | GPT-4o Image |
| 文字内容 | 5 行对比表(身高/体重/寿命/被毛/眼睛) |
| 模板 | 模板 1 · 犬类(已验证) |

---

## Prompt

```text
9:16 vertical visual design, page 2 'Physical Traits' of a pet encyclopedia visual atlas for Labrador. Healing hand-drawn style with watercolor illustration + flat info graphic. Top: page indicator '2 / 6' in warm brown, section title '形态特征 · Traits' in rounded Chinese. Main: clean comparison table with 5 rows. Row 1: 身高 54-62cm with small dog silhouette ruler icon. Row 2: 体重 25-32kg with kettlebell icon. Row 3: 寿命 10-12年 with hourglass icon. Row 4: 被毛 双层短毛防水 with fur texture illustration. Row 5: 眼睛 棕色榛色 with eye color circles. Each row has hand-drawn watercolor accents. Bottom: small real Labrador profile photo with watercolor edges. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum infographic + healing watercolor + iOS clarity.
```

---

## 工具适配

| 工具 | 加什么 |
|------|--------|
| Midjourney | `--ar 9:16 --v 6.1 --style raw --s 60` |
| SD-Flux | ControlNet 锁对比表布局 + 加 `infographic_v1` LoRA |
| 通义万相 | 中文 prompt 直接用,加"对比表 + 图标" |
