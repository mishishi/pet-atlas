# Atlas 04/06 · 演化历史

> 拉布拉多 6 张图谱 · 第 4 页:4 节点时间线

| 字段 | 值 |
|------|----|
| 文件 | `art/atlas-04-history.png` |
| 用途 | 完整图谱第 4 页(演化历史) |
| 比例 | 9:16 |
| 分辨率 | 2K(1536×2752) |
| 模型 | GPT-4o Image |
| 文字内容 | 4 个时间节点(1500s/1800s/1903/2000s) |
| 模板 | 模板 1 · 犬类(已验证) |

---

## Prompt

```text
9:16 vertical visual design, page 4 'Evolution History' of a pet encyclopedia visual atlas for Labrador. Healing hand-drawn style with watercolor illustration + flat info graphic. Top: small dot indicator '4 / 6' in warm brown, section title '演化历史 · History' in rounded Chinese. Main: hand-drawn horizontal timeline with 4 milestone nodes. Node 1: 1500s '加拿大纽芬兰' with small fishing boat illustration. Node 2: 1800s '英国贵族培育' with Victorian frame. Node 3: 1903 'AKC 认证' with badge icon. Node 4: 2000s '全球家宠' with globe icon. Each node has a small Chinese description. Bottom right: small real Labrador head photo. Background: oat #F5EFE0. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum timeline illustration + healing watercolor.
```

---

## 工具适配

| 工具 | 加什么 |
|------|--------|
| Midjourney | `--ar 9:16 --v 6.1 --style raw --s 70` |
| SD-Flux | ControlNet 锁横向时间线布局 + `timeline_v1` LoRA |
| 通义万相 | 中文 prompt 强调"时间线 + 历史插画" |
