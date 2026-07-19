# Atlas 05/06 · 养护指南

> 拉布拉多 6 张图谱 · 第 5 页:2×2 卡片矩阵

| 字段 | 值 |
|------|----|
| 文件 | `art/atlas-05-care.png` |
| 用途 | 完整图谱第 5 页(养护指南) |
| 比例 | 9:16 |
| 分辨率 | 2K(1536×2752) |
| 模型 | GPT-4o Image |
| 文字内容 | 4 卡片(饮食/运动/医疗/训练) |
| 模板 | 模板 1 · 犬类(已验证) |

---

## Prompt

```text
9:16 vertical visual design, page 5 'Care Guide' of a pet encyclopedia visual atlas for Labrador. Healing hand-drawn style with watercolor illustration + flat info graphic. Top: small dot indicator '5 / 6' in warm brown, section title '养护指南 · Care Guide' in rounded Chinese. Main: 4 cards in 2x2 grid. Card 1: '饮食 Diet' with bowl icon, text '每日 2 顿 / 300-400g'. Card 2: '运动 Exercise' with running dog icon, text '每日 60-90 分钟'. Card 3: '医疗 Health' with stethoscope icon, text '髋关节检查 · 易胖体质'. Card 4: '训练 Training' with paw icon, text '智商高 · 易训练'. Each card has a soft watercolor background. Bottom: small real Labrador eating photo. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum card design + healing watercolor.
```

---

## 工具适配

| 工具 | 加什么 |
|------|--------|
| Midjourney | `--ar 9:16 --v 6.1 --style raw --s 60` |
| SD-Flux | ControlNet 锁 2x2 网格 + `card_layout_v1` LoRA |
| 通义万相 | 中文 prompt 强调"卡片矩阵 + 简洁图标" |
