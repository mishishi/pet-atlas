# 模板 1 · 犬类图谱(6 张/品种)

> 用于所有犬类品种的图谱批量出图。
> 复用规则:**只换品种名 + 真实狗照片描述**,其他结构/文字/色板全部一致。
> 风格基准:**vintage museum specimen card** + 暖棕画框 + 散落 paw print + 树叶(2026-07-18 统一)

---

## 共享规范(所有 6 张必带)

- **比例**:9:16
- **分辨率**:2K(1536×2752)
- **基础色板**(描述用,不写进图):oat / sand / warm brown / mint
- **风格关键词**:vintage museum specimen card + healing hand-drawn watercolor + flat info graphic + real pet photo anchors
- **犬类专属装饰**:paw print + 骨头 + 树叶,不用鱼骨/羽毛
- **气质**:犬比猫更"活泼忠诚",封面姿态更 dynamic

---

## 第 1 张 · 封面

**结构**:
- 整图有暖棕画框(8-12px,跟底色 6-10% 亮度差)
- 上 60%: 真实狗大图(全侧身或坐姿,活泼姿态,眼神清亮)
- 下 40%: 燕麦色画框内 + 水彩晕染 + 装饰(paw print / 骨头 / 树叶)
- 品种名(中)+ 拉丁学名(英文)
- 原产地 chip
- 属性图标行(体型/体重/寿命)

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{origin}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + real pet photo. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top 60%: a real {breed_name_en} in a dynamic, friendly pose (standing or sitting, alert expression) with bright clear eyes, soft natural light, hand-drawn paw prints and leaves as decorative anchor. Bottom 40%: within the frame, oat background with hand-drawn watercolor paw prints, bones, and leaves. Breed name '{breed_name_zh}' in bold rounded Chinese font, latin name '{breed_name_en}' in handwritten English, origin chip '原产地 · {origin}', small icon row with size/weight/lifespan. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor + info graphic.
```

---

## 第 2 张 · 形态特征

**结构**:
- 整图有暖棕画框
- 页码 2/6 + 标题「形态特征 · Traits」
- 5 行对比表(身高/体重/寿命/被毛/眼睛)
- 底部小真实狗侧脸

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{height_range}`, `{weight_range}`, `{lifespan_range}`, `{coat_desc}`, `{eye_colors}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: page indicator '2 / 6' in warm brown, section title '形态特征 · Traits' in rounded Chinese. Main: clean comparison table with 5 rows within the frame. Row 1: 身高 {height_range} with small dog silhouette ruler icon. Row 2: 体重 {weight_range} with scale icon. Row 3: 寿命 {lifespan_range} with hourglass icon. Row 4: 被毛 {coat_desc} with fur texture illustration. Row 5: 眼睛 {eye_colors} with eye color circles. Each row has hand-drawn watercolor paw print accents. Bottom: small real {breed_name_en} profile photo with watercolor edges, within the frame. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image.
```

---

## 第 3 张 · 性格雷达

**结构**:
- 整图有暖棕画框
- 页码 3/6 + 标题「性格雷达 · Personality」
- 6 维雷达(犬:亲人度/活跃度/服从度/独立性/吠叫度/智商)
- 右侧综合评分卡

**Prompt 模板**(替换 `{breed_name_zh}`, `{affection}`, `{activity}`, `{obedience}`, `{independence}`, `{vocalization}`, `{intelligence}`, `{summary}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '3 / 6' in warm brown, section title '性格雷达 · Personality' in rounded Chinese. Main center: 6-axis personality radar chart with watercolor edges and clean data lines, within the frame. Axes labels in Chinese: 亲人度 {affection}/10, 活跃度 {activity}/10, 服从度 {obedience}/10, 独立性 {independence}/10, 吠叫度 {vocalization}/10, 智商值 {intelligence}/10. Each axis has a small paw print icon. Right side info card: '综合评分 {avg_score}/10' and subtitle '{summary}'. Background: oat with subtle hand-drawn paw prints and leaves. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor.
```

---

## 第 4 张 · 演化历史

**结构**:
- 整图有暖棕画框
- 页码 4/6 + 标题「演化历史 · History」
- 4 节点横向时间线(犬有完整繁育史)
- 节点图标:船/维多利亚/认证/现代

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{year_1..4}`, `{event_1..4}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '4 / 6' in warm brown, section title '演化历史 · History' in rounded Chinese. Main: hand-drawn horizontal timeline with 4 milestone nodes, within the frame. Node 1: {year_1} '{event_1}' with small boat/farmhouse icon. Node 2: {year_2} '{event_2}' with Victorian frame icon. Node 3: {year_3} '{event_3}' with badge icon. Node 4: {year_4} '{event_4}' with modern house icon. Each node has a small Chinese description. Bottom right: small real {breed_name_en} head photo. Background: oat with paw print decorations. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum timeline illustration + healing watercolor + vintage specimen card.
```

---

## 第 5 张 · 养护指南

**结构**:
- 整图有暖棕画框
- 页码 5/6 + 标题「养护指南 · Care」
- 2×2 卡片(饮食/运动/医疗/训练)
- 底部小真实狗照片

**Prompt 模板**(替换 `{breed_name_zh}`, `{diet}`, `{exercise}`, `{health}`, `{training}`, `{breed_name_en}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '5 / 6' in warm brown, section title '养护指南 · Care Guide' in rounded Chinese. Main: 4 cards in 2x2 grid, within the frame. Card 1: '饮食 Diet' with bowl icon, text '{diet}'. Card 2: '运动 Exercise' with running dog icon, text '{exercise}'. Card 3: '医疗 Health' with stethoscope icon, text '{health}'. Card 4: '训练 Training' with paw icon, text '{training}'. Each card has a soft watercolor background. Bottom: small real {breed_name_en} eating photo, within the frame. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor.
```

---

## 第 6 张 · 名场面

**结构**:
- 整图有暖棕画框
- 页码 6/6 + 标题「名场面 · Famous」
- 4 拼贴趣闻(影视/网络梗/文化/历史)

**Prompt 模板**(替换 `{breed_name_zh}`, `{famous_1..4}`, `{breed_name_en}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '6 / 6' in warm brown, section title '名场面 · Famous Moments' in rounded Chinese. Main: collage of 4 hand-drawn watercolor vignettes, within the frame. Vignette 1: '{famous_1}' with icon. Vignette 2: '{famous_2}' with icon. Vignette 3: '{famous_3}' with icon. Vignette 4: '{famous_4}' with icon. Each has a small Chinese handwritten caption. Bottom: real {breed_name_en} photo. Background: oat with paw print decorations. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor.
```

---

## 批量执行流程

1. 选品种(从 `content/pets/{breed}.json` 读)
2. 从 JSON 抽字段填到 prompt 模板的 `{...}` 占位
3. 用 image_synthesize 6 张同时跑
4. 文件名:`art/dog/{breed}/01-cover.png` 等(已统一目录结构)
5. 更新 `web/public/dog/{breed}/` 同步

## 当前状态

- ✅ 模板 1 猫类 6 张(英短)已验证
- ⏳ 模板 1 犬类 6 张 — 等重跑,12 犬 + 拉布拉多 = 13 个品种需重跑
