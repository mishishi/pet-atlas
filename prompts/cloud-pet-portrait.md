# Cloud Pet · 01/01 · 专属立绘

> 用户从图鉴 50 个品种里挑一个,AI 生成"我家那只"宠物形象。
> 关键约束:**必须一眼能看出是从本套图鉴出来的**(风格锚定)。

| 字段 | 值 |
|------|----|
| 文件 | `art/cloud-pet/{deviceId}/{petId}.png` |
| 用途 | 用户个人中心头像 / 分享卡片主图 |
| 比例 | **1:1**(头像用) |
| 分辨率 | 2K(2048×2048) |
| 模型 | GPT-4o Image |
| 文字内容 | 名字(必填,小字) + 品种 chip(可选) |
| 输入参考 | 必传 1 张:该品种的图鉴封面 `art/{cat}/{slug}/01-cover.png` |

---

## 模板(用时填 5 个变量)

```text
A vintage museum specimen card aesthetic portrait of a young cute {breed_en}. Healing hand-drawn watercolor illustration with a single pet as the hero subject, occupying center 70% of the frame, looking at camera with soft curious eyes, soft natural light. **Distinctive {breed_en} features: {breed_features}.** Subtle paper texture background (oat #F5EFE0), decorative simplified frame border in warm brown #8B6F47 with hand-drawn {decoration} at four corners, **no extra sketch lines, clean thin border**. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Bottom-right small text "{pet_name}" in rounded Chinese font (PingFang Rounded). Bottom-left small chip "{breed_zh}" in handwritten style. Mood: warm, healing, professional yet friendly. Style: high-end museum pet portrait + healing watercolor, square 1:1 aspect, no info graphic, no charts, just one beloved pet, exactly one pet, no other animals in frame, plain paper texture background, no scenery.
```

---

## 变量填写规则

| 变量 | 取值 | 来源 |
|------|------|------|
| `{breed_zh}` | "拉布拉多寻回犬" / "英国短毛猫" / "金丝熊" | `content/pets/{slug}.json` 的 `name.zh` |
| `{breed_en}` | "Labrador Retriever" / "British Shorthair" | `content/pets/{slug}.json` 的 `name.en` |
| `{breed_features}` | **必填,3-5 句英文 breed-specific 特征描述** | 见下方"特征描述速查表" |
| `{decoration}` | 犬→"leaves and bones" / 猫→"fish bones and feathers" / 鸟→"feathers and twigs" / 爬→"scales and stones" / 小型哺乳→"small leaves and seeds" | 按图鉴 `_template-N` 装饰规范 |
| `{pet_name}` | 用户在 `/adopt` 填的名字(2-6 字中文) | 用户输入 |
| 参考图 | 1 张 `01-cover.png` 绝对路径 | `art/{cat}/{slug}/01-cover.png` |

---

## 特征描述速查表(breed_features)

**为什么必须有这个字段(2026-07-20 验证):**
光靠 input_file_paths 参考图锚定不够。GPT-4o 对"通用宠物"会画"通用样子",必须显式写 breed 特征。

| 品种 (zh) | features 描述(英文,直接用) |
|-----------|------------------------------|
| 拉布拉多寻回犬 | "Labrador Retriever: short dense yellow/black/chocolate coat, broad head, friendly expression, otter tail, athletic muscular build" |
| 英国短毛猫 | "British Shorthair: solid blue-grey (slate blue) plush dense coat, iconic cobby round body shape, broad chest, round face with chubby cheeks, large round copper eyes, short thick legs" |
| 叙利亚仓鼠(金丝熊) | "Syrian hamster: golden honey-blonde fur with soft white belly, small rounded ears, plump chubby cheeks, tiny pink paws, short tail" |
| 鬃狮蜥 | "Bearded Dragon: warm sandy-tan base color with subtle darker patterns, spiky beard/throat pouch, triangular head shape, rough textured scales, fat round body" |
| **其他品种** | **运行时按需生成或从维基百科抓取,3-5 句关键外貌特征英文** |

**实现思路:** M1 在 `web/lib/breedFeatures.ts` 维护一张 fallback 表,新增品种时人工加 3-5 句英文特征。后期可接维基百科 API 自动生成。

---

## 不要出现(2026-07-20 v2 新增)

- ❌ "puppy/kitty" 混用占位词(必须用 `{breed_en}`)
- ❌ 画框出现额外 sketch lines(英短 v1 翻车教训:prompt 加 "clean thin border, no extra sketch lines")
- ❌ 仅靠参考图不写特征(英短 v1 翻车:必须显式写 breed features)

---

## 与图鉴封面的差异(明确)

| 元素 | 图鉴封面 | 云宠物 |
|------|----------|--------|
| 比例 | 9:16 | **1:1** |
| 主体占比 | 上 60% | **中 70%** |
| 信息区(下 40%) | ✅ 名字/拉丁名/原产地/属性图标 | ❌ 完全去掉,只留名字小字 |
| 文字 | 多 | **只 2 行**:右下名字 + 左下品种 chip |
| 边框 | 暖棕画框 + 四角花纹 | **简化画框**(头像场景不需要太繁复),保留暖棕细线 |
| 装饰元素 | 满铺 | **仅 4 角点缀** paw print + 1 片叶 |
| 整体气质 | "图鉴条目" | **"我家宠物的肖像照"** |

---

## 不要出现

- ❌ 多只宠物(只画一只)
- ❌ Q 版 2 头身 / 大眼卡通(走"治愈手绘"不卖萌过头)
- ❌ 背景复杂(背景留白,主体清晰)
- ❌ 装饰元素压过主体
- ❌ 任何"宠物 + 主人在玩耍"的场景(只画宠物本身)
- ❌ 文字超过 8 个字(只显示名字 + 品种)

---

## 跑前 checklist(2026-07-20 v2 更新)

- [ ] `input_file_paths` 传 1 张该品种的 `01-cover.png` 绝对路径
- [ ] aspect_ratio = "1:1"
- [ ] resolution = "2K"
- [ ] `{breed_features}` 显式填入(不能省略,不能只写 "cute" 这种空话)
- [ ] `{pet_name}` 长度 2-6 字中文
- [ ] 装饰关键词按品种分类填对
- [ ] 已确认 TCB 上传路径 prefix = `cloud-pets/`(跟 atlas 图分开)

## 跑后 checklist(2026-07-20 v2 更新)

- [ ] 风格是否跟原图鉴封面**有 70%+ 一致**(色板、画框、纸感都对)
- [ ] **品种关键特征是否命中**(颜色/体型/毛型/标志性部位都对得上)
- [ ] 主体是否清晰、单只、居中
- [ ] 装饰元素不抢戏
- [ ] 名字 + 品种 chip 文字位置不挡主体
- [ ] 中文是否正常渲染(AI 经常写错)
- [ ] 画框**没有**多余 sketch 杂线(英短 v1 教训)

## 验证样本(2026-07-20)

4 张 sample 已生成,见 `art/cloud-pet/samples/`:

| 文件 | 品种 | 分数 | 备注 |
|------|------|------|------|
| `labrador-01.png` | 拉布拉多(豆豆) | 95 | 首跑就 OK,v1 prompt |
| `british-shorthair-01.png` | 英短(圆圆) | 75 | v1 颜色偏,体型偏瘦长 |
| `british-shorthair-02.png` | 英短(圆圆) | 95 | v2 加 blue-grey + cobby body 满分 |
| `syrian-hamster-01.png` | 金丝熊(糖糖) | 90 | 蜂蜜金色 + 坐姿完美 |
| `bearded-dragon-01.png` | 鬃狮蜥(龙龙) | 95 | 三角头 + 胡子 + 鳞片全对 |

**结论:** 4 品类全部通过风格验证,v2 prompt 模板可直接用。

---

## 典型失败 & 修法

| 失败 | 原因 | 修法 |
|------|------|------|
| 完全不像原品种 | input_file_paths 没生效 / reference 弱 | 确认参考图传的是 `01-cover.png` 不是 `.md` |
| 风格跑偏(变写实摄影 / 变 Q 版) | prompt 里 "healing watercolor" 权重被吃 | 在 prompt 开头重写 "vintage museum specimen card aesthetic" 3 遍 |
| 文字乱码或位置错 | GPT-4o 中文经常错位 | 后期用 sharp 叠一张纯文字 PNG 盖上去(text layer 思路) |
| 多只宠物出现 | prompt 没强调 "single" | 加 "**exactly one** pet, no other animals in frame" |
| 背景复杂 | prompt 没强调 "minimal background" | 加 "**plain paper texture background**, no scenery" |

---

## 跟现有管线的区别

- `scripts/atlas-pipeline.mjs`:跑 6 张(cover + traits + personality + history + care + famous),信息图为主
- `cloud-pet-portrait`(本模板):**只 1 张**,肖像为主,无信息图
- 共用:参考图(`01-cover.png`)、风格指南(`_shared-style-guide.md`)、TCB 上传脚本
- 不共用:不需要 markdown prompt 渲染管线(单图不走 batch)

---

## M1 范围

本模板只在 **领养流程**(`/adopt`)和 **换一只** 时使用:
- 1 次领养 = 1 次生成
- Reroll 最多 3 次(用 localStorage 计数 + 读图鉴解锁)
- 输出存 TCB `cloud-pets/{deviceId}/{petId}.png`
- 元数据存 localStorage: `{petId, breed, name, personality, color, tcbUrl, createdAt}`

**M1 不做:** 表情变化、动画、装备、分享卡片、互动。
