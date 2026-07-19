# 02 · 首页

> App 首页 UI 设计稿,验证信息层级

| 字段 | 值 |
|------|----|
| 文件 | `art/02-home.png` |
| 用途 | App 首页 UI 设计稿 |
| 比例 | 9:16(9:16 视觉等价 iPhone 屏幕) |
| 分辨率 | 2K(1536×2752) |
| 模型 | GPT-4o Image |
| 文字内容 | App 名称/搜索框/三大类入口/今日推荐/主题深读 chips/Tab Bar |

---

## Prompt

```text
9:16 vertical iPhone 15 Pro screen mockup, full UI design draft for a pet encyclopedia app home page. Healing hand-drawn style with watercolor illustration. iOS status bar at top with 9:41 time. App header '宠物大百科' in rounded Chinese + search bar. Three large category cards in 1x3 grid: 犬 DOG (with hand-drawn golden retriever face), 猫 CAT (with orange tabby cat face), 异宠 EXOTIC (with hamster face). Each card has a soft watercolor background. Below: section title '今日推荐 · Editor's Pick' with 3 horizontal scrolling pet cards (Labrador, British Shorthair, Hamster). Below: '主题深读' chips for '小型犬/治愈猫/异宠入门/长毛品种'. Bottom tab bar with 4 icons. Background: oat #F5EFE0. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47. Style: iOS 17 design language + watercolor illustration accents + info graphic clarity, soft rounded corners 16px.
```

---

## 工具适配

| 工具 | 加什么 |
|------|--------|
| Midjourney | `--ar 9:16 --v 6.1 --style raw`(MJ 不会渲染精确 iOS UI,需后期) |
| Stable Diffusion (Flux) | ControlNet 锁定 iPhone 15 Pro 屏幕比例 + UI Layout,加 `ui_mockup_v1` LoRA |
| 通义万相 | 中文 prompt 强调"iOS 17 设计风格 + 治愈系手绘 + 平面信息图" |
