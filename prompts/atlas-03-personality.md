# Atlas 03/06 · 性格雷达

> 拉布拉多 6 张图谱 · 第 3 页:6 维性格雷达

| 字段 | 值 |
|------|----|
| 文件 | `art/atlas-03-personality.png` |
| 用途 | 完整图谱第 3 页(性格雷达) |
| 比例 | 9:16 |
| 分辨率 | 2K(1536×2752) |
| 模型 | GPT-4o Image |
| 文字内容 | 6 维雷达 + 综合评分 + 副标签 |
| 模板 | 模板 1 · 犬类(已验证) |

---

## Prompt

```text
9:16 vertical visual design, page 3 'Personality Radar' of a pet encyclopedia visual atlas for Labrador. Healing hand-drawn style with watercolor illustration + flat info graphic. Top: small dot indicator '3 / 6' in warm brown, section title '性格雷达 · Personality' in rounded Chinese. Main center: 6-axis personality radar chart with watercolor edges and clean data lines. Axes labels in Chinese: 亲人度 8/10, 活跃度 9/10, 服从度 9/10, 独立性 3/10, 吠叫度 4/10, 智商值 9/10. Each axis has a small icon. Right side info card: '综合评分 8.5/10' and subtitle '家庭友好犬 · Family-friendly'. Background: oat #F5EFE0 with subtle hand-drawn leaves. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum infographic + healing watercolor.
```

---

## 工具适配

| 工具 | 加什么 |
|------|--------|
| Midjourney | `--ar 9:16 --v 6.1 --style raw --s 80` |
| SD-Flux | ControlNet 锁雷达图中心布局 + `infographic_v1` LoRA |
| 通义万相 | 中文 prompt 强调"雷达图 + 信息图表" |
