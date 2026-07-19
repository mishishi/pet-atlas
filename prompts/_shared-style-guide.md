# 共享视觉规范

> 所有 prompt 必带的视觉规则。改这里,所有图同步生效。
> 引用方式:在每个 prompt 末尾或开头加 "Style: healing hand-drawn + ..." 即可。

---

## 色板(精确 hex)

| 角色 | 名称 | Hex | 用法 |
|------|------|-----|------|
| 主背景 | Oat 燕麦色 | `#F5EFE0` | 所有页面底色(外层) |
| 卡片中心 | Sand 沙色 | `#E8D9B8` | 卡片/画框内 |
| 强调 | Warm Brown 暖棕 | `#8B6F47` | 边框、图标、文字 |
| 点缀 | Mint 薄荷绿 | `#A8C5A0` | 叶片、装饰 |
| 文字主 | Dark Brown 深咖 | `#3D2F1F` | 标题/正文 |
| 文字次 | Mid Gray 中灰 | `#8B8680` | 副文/标签 |

## 字体

- **中文**:阿里巴巴普惠体 / 思源黑体 Rounded(圆润)
- **英文**:handwritten style(MUJI 风)
- **小字**:无衬线,圆润

## 核心风格关键词(2026-07-18 统一版)

```text
vintage paper museum specimen card aesthetic
healing hand-drawn watercolor illustration
flat info graphic clarity
real pet photos as anchors (1-2 张/图)
subtle paper texture background
decorative frame border in warm brown
hand-drawn paw prints, leaves, feathers, fish bones
warm color palette (oat + warm brown + mint)
```

## 核心 4 件套(每个 prompt 必带)

```text
1. Vintage museum specimen card aesthetic with subtle paper texture
2. Healing hand-drawn watercolor illustration + flat info graphic
3. Real pet photo anchor (1-2 张, 占画面 1/4-1/3)
4. Decorative frame border in warm brown #8B6F47 with hand-drawn paw prints and leaves
```

## 装饰元素(看场景)

- 画框:细线 8-12px 暖棕矩形边框,与底色有 6-10% 亮度差
- 手绘水彩晕染:局部,不超过 20% 画面
- 犬类:paw print + 骨头 + 树叶
- 猫类:paw print + 鱼骨 + 羽毛 + 胡须
- 鸟:羽毛 + 树枝
- 爬宠:鳞片 + 石头

## 不要出现的元素(红线)

- ❌ 冷色调 / 蓝紫 / 工业感金属色
- ❌ 写实摄影(非锚点)
- ❌ 儿童涂鸦感 / 卡通风
- ❌ 表情包/emoji 元素
- ❌ 黑底白字硬科幻
- ❌ 任何"卡通狗"插画(违反"真实宠物照片"原则)
- ❌ 廉价 Logo / 模板感设计

## 通用 prompt 片段(每个 prompt 必带)

```text
A vintage museum specimen card aesthetic. Healing hand-drawn style with watercolor illustration + flat info graphic + real pet photo anchors. Subtle paper texture background (oat #F5EFE0), decorative frame border in warm brown #8B6F47, hand-drawn paw prints and leaves. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Mood: warm, healing, professional yet friendly. Style: high-end museum illustration meets iOS app design. Chinese text uses rounded sans-serif (PingFang Rounded or Alibaba PuHuiTi Rounded). English text uses handwritten style.
```

## 跨平台适配速查

| 工具 | 必加项 |
|------|--------|
| Midjourney | `--ar 9:16 --v 6.1 --style raw` |
| Stable Diffusion (Flux) | `healing_watercolor_v1` LoRA, ControlNet 锁 9:16 |
| Stable Diffusion (SDXL) | `infographic_v1` LoRA, sampler DPM++ 2M |
| 通义万相 | 中文 prompt 翻译版,加"治愈系手绘 + 平面信息图" |
| 豆包图像 | 中文 prompt 直接用,加"9:16 竖屏" |
| Ideogram | 渲染中文最佳,优先用 |
| GPT-4o Image | 原版 prompt 即可,本库默认 |

## 跑前 checklist

- [ ] aspect_ratio = 9:16(标准竖屏)
- [ ] resolution ≥ 2K(否则细节糊)
- [ ] 锁定色板 hex,不用 "warm brown" 这种模糊词
- [ ] 风格描述必带 "vintage museum specimen card aesthetic"
- [ ] 必带 "decorative frame border in warm brown" 关键词

## 跑后 checklist

- [ ] 中文渲染是否正确(AI 不会写中文,需后期修)
- [ ] 真实宠物照片占全图比例(应 ≤ 1/3)
- [ ] 水彩晕染是否过度(过度会"乱")
- [ ] 信息图表可读性(雷达图轴文字是否清晰)
- [ ] **画框是否在所有图里都出现**(避免 17 品种风格不一致)

---

## 修订历史

- 2026-07-18 上午:加 "vintage paper museum specimen card" 关键词 + "decorative frame border" 画框指令(英短那 6 张验证后,统一为基准)
