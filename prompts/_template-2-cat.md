# 模板 2 · 猫类图谱(6 张/品种)

> 用于所有猫类品种的图谱批量出图。
> 复用规则:**只换品种名 + 真实猫照片描述**,其他结构/文字/色板全部一致。

---

## 共享规范(所有 6 张必带)

- **比例**:9:16
- **分辨率**:2K(1536×2752)
- **基础色板**:oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0
- **风格关键词**:vintage museum specimen card + healing hand-drawn watercolor + flat info graphic + real pet photo anchors
- **猫类专属**:真实猫照片占 1/4-1/3 画面,手绘水彩占 2/3-3/4
- **气质调整**:猫比犬更"独立/优雅",装饰元素可用猫爪/胡须/鱼骨/逗猫棒,不用犬骨/肉垫

---

## 第 1 张 · 封面

**结构**:
- 上 50%: 真实猫大图(全侧身或坐姿,优雅姿态,眼神清亮)
- 下 50%: 燕麦色背景 + 水彩晕染 + 装饰(猫爪印/胡须/叶子)
- 品种名(中)+ 拉丁学名(英文)
- 原产地 chip
- 属性图标行(体型/体重/寿命)

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{origin}`, `{size_icons}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + real cat photo. Subtle paper texture background (oat #F5EFE0) with a decorative frame border in warm brown #8B6F47. Top 50%: a real {breed_name_en} cat in elegant pose (sitting or side profile) with bright clear eyes, soft natural light, within the frame. Bottom 50%: oat background with hand-drawn watercolor whiskers, fish bones, cat paw prints, cat toys, and leaves. Breed name '{breed_name_zh}' in bold rounded Chinese font, latin name '{breed_name_en}' in handwritten English, origin chip '原产地 · {origin}', small icon row with size/weight/lifespan. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum specimen card + healing watercolor + info graphic.
```

---

## 第 2 张 · 形态特征

**结构**:
- 页码 2/6 + 标题「形态特征 · Traits」
- 5 行对比表(身高/体重/寿命/被毛/眼睛)
- 底部小真实猫侧脸

**Prompt 模板**:

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat #F5EFE0) with a decorative frame border in warm brown #8B6F47. Top: page indicator '2 / 6' in warm brown, section title '形态特征 · Traits' in rounded Chinese. Main: clean comparison table with 5 rows within the frame. Row 1: 身高 {height_range} with small cat silhouette ruler icon. Row 2: 体重 {weight_range} with scale icon. Row 3: 寿命 {lifespan_range} with hourglass icon. Row 4: 被毛 {coat_desc} with fur texture illustration. Row 5: 眼睛 {eye_colors} with eye color circles. Each row has hand-drawn watercolor accents (whiskers, fish bones). Bottom: small real {breed_name_en} profile photo with watercolor edges, within the frame. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0.
```

---

## 第 3 张 · 性格雷达

**结构**:
- 页码 3/6 + 标题「性格雷达 · Personality」
- 6 维雷达(猫通常:亲人度/活跃度/独立性/智商/话多/粘人)
- 右侧综合评分卡

**Prompt 模板**:

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat #F5EFE0) with a decorative frame border in warm brown #8B6F47. Top: small dot indicator '3 / 6' in warm brown, section title '性格雷达 · Personality' in rounded Chinese. Main center: 6-axis personality radar chart with watercolor edges and clean data lines, within the frame. Axes labels in Chinese: 亲人度 {affection}/10, 活跃度 {activity}/10, 独立性 {independence}/10, 智商 {intelligence}/10, 话多 {vocalization}/10, 粘人 {clingy}/10. Each axis has a small cat-related icon. Right side info card: '综合评分 {avg_score}/10' and subtitle '{summary}'. Background: oat #F5EFE0 with subtle hand-drawn fish bones and cat toys. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum specimen card + healing watercolor.
```

> **注意**:猫的 6 维跟犬不同——用「粘人」替代「服从度」,更适合猫的习性。

---

## 第 4 张 · 演化历史

**结构**:
- 页码 4/6 + 标题「演化历史 · History」
- 4 节点横向时间线
- 节点图标:古埃及/航海/维多利亚/现代

**Prompt 模板**:

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat #F5EFE0) with a decorative frame border in warm brown #8B6F47. Top: small dot indicator '4 / 6' in warm brown, section title '演化历史 · History' in rounded Chinese. Main: hand-drawn horizontal timeline with 4 milestone nodes, within the frame. Node 1: {year_1} '{event_1}' with small ancient/animal icon. Node 2: {year_2} '{event_2}' with Victorian frame icon. Node 3: {year_3} '{event_3}' with badge icon. Node 4: {year_4} '{event_4}' with modern house icon. Each node has a small Chinese description. Bottom right: small real {breed_name_en} head photo. Background: oat #F5EFE0 with fish bone decorations. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum timeline illustration + healing watercolor + vintage specimen card.
```

---

## 第 5 张 · 养护指南

**结构**:
- 页码 5/6 + 标题「养护指南 · Care」
- 2×2 卡片(饮食/运动/医疗/美容)
- 猫的「美容」替代犬的「训练」

**Prompt 模板**:

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat #F5EFE0) with a decorative frame border in warm brown #8B6F47. Top: small dot indicator '5 / 6' in warm brown, section title '养护指南 · Care Guide' in rounded Chinese. Main: 4 cards in 2x2 grid, within the frame. Card 1: '饮食 Diet' with bowl icon, text '{diet}'. Card 2: '运动 Exercise' with running cat icon, text '{exercise}'. Card 3: '医疗 Health' with stethoscope icon, text '{health}'. Card 4: '美容 Grooming' with comb icon, text '{grooming}'. Each card has a soft watercolor background. Bottom: small real {breed_name_en} photo, within the frame. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum specimen card + healing watercolor.
```

> **猫类特色**:**「美容 Grooming」** 替代「训练 Training」(猫训练不突出,美容是刚需)。

---

## 第 6 张 · 名场面

**结构**:
- 页码 6/6 + 标题「名场面 · Famous」
- 4 拼贴趣闻(影视/网络梗/文化/历史)

**Prompt 模板**:

```text
9:16 vertical visual design, page 6 'Famous Moments' of a pet encyclopedia visual atlas for {breed_name_zh}. Healing hand-drawn style with watercolor illustration + flat info graphic. Top: small dot indicator '6 / 6' in warm brown, section title '名场面 · Famous Moments' in rounded Chinese. Main: collage of 4 hand-drawn watercolor vignettes. Vignette 1: '{famous_1}' with icon. Vignette 2: '{famous_2}' with icon. Vignette 3: '{famous_3}' with icon. Vignette 4: '{famous_4}' with icon. Each has a small Chinese handwritten caption. Bottom: real {breed_name_en} photo. Background: oat #F5EFE0 with watercolor confetti decorations. Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0. Style: museum storyboard + healing watercolor.
```

---

## 批量执行流程

1. 选品种(从 `content/pets/{breed}.json` 读)
2. 从 JSON 抽字段填到 prompt 模板的 `{...}` 占位
3. 用 image_synthesize 6 张同时跑
4. 文件名:`art/{breed}-atlas-01-cover.png` 等(避免和拉布拉多混淆)
5. 更新 JSON 的 `gallery` 字段指向新生成的图

## 当前状态

- ⏳ 模板 1 犬类 · 拉布拉多已验证 6 张
- ⏳ 模板 2 猫类 · 准备跑(等元数据 JSON 完成)
- ⏳ 模板 3-4 后续
