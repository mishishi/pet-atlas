# 模板 4 · 鸟 + 爬虫图谱(6 张/品种)

> 用于所有鸟类和爬虫类(鹦鹉/虎皮鹦鹉/玄凤/情侣鹦鹉 + 球蟒/豹纹守宫/鬃狮蜥/龟类)的图谱批量出图。
> 复用规则:**只换品种名 + 物种 + 真实宠物照片描述**,其他结构/文字/色板全部一致。
> 风格基准:**vintage museum specimen card** + 暖棕画框 + 散落 paw print + 树叶(2026-07-18 统一)

---

## 共享规范(所有 6 张必带)

- **比例**:9:16
- **分辨率**:2K(1536×2752)
- **基础色板**(描述用,不写进图):oat / sand / warm brown / mint
- **风格关键词**:vintage museum specimen card + healing hand-drawn watercolor + flat info graphic + real pet photo anchors
- **物种专属装饰**:
  - **鸟**:`feathers + branches + leaves` (羽毛 + 树枝 + 树叶)
  - **爬虫**:`scales + stones + desert plants` (鳞片 + 石头 + 仙人掌/多肉)
- **气质**:鸟更轻盈优雅;爬虫更神秘内敛,装饰留白比小型哺乳再多 10%

---

## 物种分支决策表

每个品种的 `{species_branch}` 必须是 `bird` 或 `reptile`,决定 prompt 里的所有装饰。

| 字段 | bird | reptile |
|------|------|---------|
| 装饰主题 | feathers / branches / leaves | scales / stones / desert plants |
| 雷达 6 维 | 亲人 / 活跃 / 独立 / 智商 / 鸣叫 / 社交 | 亲人 / 活跃 / 独立 / 智商 / 夜行 / 紧张度 |
| 养护 4 卡片 | 饮食 / 运动 / 医疗 / 笼舍 | 饮食 / 运动 / 医疗 / 温湿度 |
| 历史节点数 | 3-4 | 3(更短) |
| 真实照片比例 | 上 55% | 上 50%(蛇更瘦长,占比可稍大) |

---

## 第 1 张 · 封面

**结构**:
- 整图有暖棕画框(8-12px,跟底色 6-10% 亮度差)
- 上 50-55%: 真实鸟/爬虫大图(自然栖息/警戒/觅食等自然姿态,眼神清亮)
- 下 45-50%: 燕麦色画框内 + 水彩晕染 + 物种专属装饰
- 品种名(中)+ 拉丁学名(英文)
- 原产地 chip
- 属性图标行(体型/体重/寿命)

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{origin}`, `{species_branch}`, `{species_themed}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + real pet photo. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top 50-55%: a real {breed_name_en} ({species_branch}) in a natural, alert pose (perched, basking, or exploring) with bright clear eyes, soft natural light, hand-drawn feathers/scales and branches/stones as decorative anchor. Bottom 45-50%: within the frame, oat background with hand-drawn watercolor {species_themed} decorations. Breed name '{breed_name_zh}' in bold rounded Chinese font, latin name '{breed_name_en}' in handwritten English, origin chip '原产地 · {origin}', small icon row with size/weight/lifespan. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor + info graphic. Mood: gentle, natural, vintage naturalist illustration.
```

> **`{species_themed}` 替换示例:**
>
> **鸟(feathers / branches / leaves):**
> - 非洲灰鹦鹉:`tropical feathers, rainforest leaves, branch with berries`
> - 虎皮鹦鹉:`colorful feathers, eucalyptus branches, wild grass seeds`
> - 玄凤鹦鹉:`soft yellow-grey feathers, dried grass, wheat ears`
> - 情侣鹦鹉:`lovebird plumage in pairs, acacia branches, small fruits`
>
> **爬虫(scales / stones / desert plants):**
> - 球蟒:`reptile scales, dark burrow stones, dry leaves`
> - 豹纹守宫:`gecko spots, desert stones, succulents, sand grains`
> - 鬃狮蜥:`spiny scales, red sandstone, dry spinifex grass`
> - 龟类:`tortoise shell pattern, dry grass, small cacti, river stones`

---

## 第 2 张 · 形态特征

**结构**:
- 整图有暖棕画框
- 页码 2/6 + 标题「形态特征 · Traits」
- 5 行对比表(身长/体重/寿命/被毛或鳞甲/眼睛)
- 底部小真实鸟/爬虫侧脸

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{height_range}`, `{weight_range}`, `{lifespan_range}`, `{coat_desc}`, `{eye_colors}`, `{species_branch}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: page indicator '2 / 6' in warm brown, section title '形态特征 · Traits' in rounded Chinese. Main: clean comparison table with 5 rows within the frame. Row 1: 身长 {height_range} with small {species_branch} silhouette ruler icon. Row 2: 体重 {weight_range} with scale icon. Row 3: 寿命 {lifespan_range} with hourglass icon. Row 4: {coat_or_scales} {coat_desc} with feather/scale texture illustration. Row 5: 眼睛 {eye_colors} with eye color circles. Each row has hand-drawn watercolor accents (feathers or scales). Bottom: small real {breed_name_en} profile photo with watercolor edges, within the frame. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image.
```

> **变量细节**:
> - 鸟:`{coat_or_scales}` = 羽毛
> - 爬虫:`{coat_or_scales}` = 鳞甲/甲壳
> - 体重单位:鸟通常 0.04-0.65 kg(克到几百克);爬虫 0.1-2 kg;龟类 0.5-50 kg

---

## 第 3 张 · 性格雷达

**结构**:
- 整图有暖棕画框
- 页码 3/6 + 标题「性格雷达 · Personality」
- **6 维**(鸟 vs 爬虫不同):

**鸟的 6 维**:亲人度 / 活跃度 / 独立性 / 智商 / 鸣叫度 / 社交性
**爬虫的 6 维**:亲人度 / 活跃度 / 独立性 / 智商 / 夜行性 / 紧张度

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{axis_1..6_label}`, `{axis_1..6_value}`, `{avg_score}`, `{summary}`, `{species_branch}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '3 / 6' in warm brown, section title '性格雷达 · Personality' in rounded Chinese. Main center: 6-axis personality radar chart with watercolor edges and clean data lines, within the frame. Axes labels in Chinese: {axis_1_label} {axis_1_value}/10, {axis_2_label} {axis_2_value}/10, {axis_3_label} {axis_3_value}/10, {axis_4_label} {axis_4_value}/10, {axis_5_label} {axis_5_value}/10, {axis_6_label} {axis_6_value}/10. Each axis has a small {species_branch} icon. Right side info card: '综合评分 {avg_score}/10' and subtitle '{summary}'. Background: oat with subtle hand-drawn feathers or scales. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor.
```

> **轴标签替换示例:**
>
> **鸟:** 亲人度 / 活跃度 / 独立性 / 智商 / 鸣叫度 / 社交性
> **爬虫:** 亲人度 / 活跃度 / 独立性 / 智商 / 夜行性 / 紧张度
>
> 注意:JSON 里 `personality.vocalization` 字段在爬虫里要当 `nocturnal` 解读,在鸟里就当 `vocalization` 解读。

---

## 第 4 张 · 演化历史

**结构**:
- 整图有暖棕画框
- 页码 4/6 + 标题「演化历史 · History」
- **3 节点**横向时间线(异宠历史普遍较短,通常 3 个节点)
- 节点图标:野外/科研/家宠

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{year_1..3}`, `{event_1..3}`, `{species_branch}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '4 / 6' in warm brown, section title '演化历史 · History' in rounded Chinese. Main: hand-drawn horizontal timeline with 3 milestone nodes, within the frame. Node 1: {year_1} '{event_1}' with wild habitat icon. Node 2: {year_2} '{event_2}' with research/explorer icon. Node 3: {year_3} '{event_3}' with home pet icon. Each node has a small Chinese description. Bottom right: small real {breed_name_en} head photo. Background: oat with feather or scale decorations. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum timeline illustration + healing watercolor + vintage specimen card.
```

> **3 vs 4 节点处理**:如果 history.timeline 有 4-5 个,选 3 个最重要的(发现/分类/家养化)。

---

## 第 5 张 · 养护指南

**结构**:
- 整图有暖棕画框
- 页码 5/6 + 标题「养护指南 · Care」
- **2×2 卡片**:

**鸟的 4 卡片**:饮食 Diet / 运动 Exercise / 医疗 Health / 笼舍 Cage
**爬虫的 4 卡片**:饮食 Diet / 运动 Exercise / 医疗 Health / 温湿度 Temp&Humidity

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{diet}`, `{exercise}`, `{health}`, `{care_4th_label}`, `{care_4th_text}`, `{species_branch}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '5 / 6' in warm brown, section title '养护指南 · Care Guide' in rounded Chinese. Main: 4 cards in 2x2 grid, within the frame. Card 1: '饮食 Diet' with bowl/seed icon, text '{diet}'. Card 2: '运动 Exercise' with running/basking icon, text '{exercise}'. Card 3: '医疗 Health' with stethoscope icon, text '{health}'. Card 4: '{care_4th_label}' with cage/thermo icon, text '{care_4th_text}'. Each card has a soft watercolor background. Bottom: small real {breed_name_en} photo, within the frame. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor.
```

> **第 4 卡片差异**:
> - 鸟: `{care_4th_label}` = 笼舍 Cage, `{care_4th_text}` 写笼子尺寸/栖杠/玩具
> - 爬虫: `{care_4th_label}` = 温湿度 Temp&Humidity, `{care_4th_text}` 写温度/湿度/UVB 灯
> - 龟: `{care_4th_label}` = 水质 Water, 写水深/过滤/晒台

---

## 第 6 张 · 名场面

**结构**:
- 整图有暖棕画框
- 页码 6/6 + 标题「名场面 · Famous」
- 4 拼贴趣闻(科研/动漫/历史/流行文化)
- 装饰元素:鸟用羽毛,爬虫用鳞片(物种专属)

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{famous_1..4}`, `{species_branch}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '6 / 6' in warm brown, section title '名场面 · Famous Moments' in rounded Chinese. Main: collage of 4 hand-drawn watercolor vignettes, within the frame. Vignette 1: '{famous_1}' with icon. Vignette 2: '{famous_2}' with icon. Vignette 3: '{famous_3}' with icon. Vignette 4: '{famous_4}' with icon. Each has a small Chinese handwritten caption. Bottom: real {breed_name_en} photo. Background: oat with feather/scale decorations. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor.
```

> **鸟/爬虫著名场面的类型**:
> - 鸟:Alex 鹦鹉科研 / 动漫《鹦鹉兄弟》/ 迪士尼《里约大冒险》/ 名人养鸟趣闻
> - 爬虫:突变品系培育(球蟒 5000+ 变种)/ 动漫《宠物小精灵》/ 龟类长寿记录/ 探险家捕蟒趣闻

---

## 批量执行流程

1. 选品种(从 `content/pets/{breed}.json` 读)
2. 验证 `template === 4` 且 `category` ∈ {`bird`, `reptile`}
3. 决定 `species_branch`:
   - `category === "bird"` → bird
   - `category === "reptile"` → reptile
4. 从 JSON 抽字段填到 prompt 模板的 `{...}` 占位
5. 用 image_synthesize 6 张同时跑
6. 文件名:`art/bird-reptile/{breed}/01-cover.png` 等
7. 同步到 `web/public/bird-reptile/{breed}/`

## 当前状态

- ⏳ 模板 4 · 11 个鸟+爬虫待跑
  - 鸟(5):african-grey-parrot, budgerigar, cockatiel, lovebird
  - 爬虫(6):ball-python, crested-gecko, greek-tortoise, leopard-gecko, red-eared-slider, russian-tortoise, sulcata-tortoise
- ✅ 模板基准:`_shared-style-guide.md` 加 vintage paper 关键字
- ✅ 命名规范:`art/bird-reptile/{slug}/XX-{key}.png`

## 跑前 checklist

- [ ] 验证 `content/pets/{slug}.json` 的 `template === 4` 且 `category` 是 bird/reptile
- [ ] 决定 species_branch(bird/reptile)
- [ ] 雷达 6 维标签按 species_branch 替换(鸣叫 vs 夜行)
- [ ] 养护第 4 卡片按 species_branch 替换(笼舍 vs 温湿度)
- [ ] `history.timeline` 选 3 个最重要的(不要塞 5 个)
- [ ] 体重单位核对(鸟 vs 爬虫 vs 龟差异大)
