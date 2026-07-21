# 模板 3 · 小型哺乳图谱(6 张/品种)

> 用于所有小型哺乳类(兔/仓鼠/刺猬/雪貂/龙猫/荷兰猪/迷你垂耳兔)的图谱批量出图。
> 复用规则:**只换品种名 + 真实宠物照片描述**,其他结构/文字/色板全部一致。
> 风格基准:**vintage museum specimen card** + 暖棕画框 + 散落 paw print + 树叶(2026-07-18 统一)

---

## 共享规范(所有 6 张必带)

- **比例**:9:16
- **分辨率**:2K(1536×2752)
- **基础色板**(描述用,不写进图):oat / sand / warm brown / mint
- **风格关键词**:vintage museum specimen card + healing hand-drawn watercolor + flat info graphic + real pet photo anchors
- **小型哺乳专属装饰**:paw print(小尺寸)+ 树叶 + 胡萝卜/坚果(兔/仓鼠);刺猬用刺+橡子;龙猫用羽状尾;雪貂用面具纹
- **气质**:小巧可爱、温顺、治愈系,装饰留白比犬类多 15-20%(画面要"透气")

---

## 第 1 张 · 封面

**结构**:
- 整图有暖棕画框(8-12px,跟底色 6-10% 亮度差)
- 上 55%: 真实小型哺乳大图(全侧身或坐姿,警觉/进食/蜷缩等自然姿态,眼神清亮)
- 下 45%: 燕麦色画框内 + 水彩晕染 + 装饰(品种专属 paw print + 食物/坚果 + 树叶)
- 品种名(中)+ 拉丁学名(英文)
- 原产地 chip
- 属性图标行(体型/体重/寿命)

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{origin}`, `{small_mammal_themed}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + real pet photo. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top 55%: a real {breed_name_en} in a natural, gentle pose (sitting, foraging, or curled up, alert expression) with bright clear eyes, soft natural light, hand-drawn paw prints (small) and leaves as decorative anchor. Bottom 45%: within the frame, oat background with hand-drawn watercolor {small_mammal_themed} decorations. Breed name '{breed_name_zh}' in bold rounded Chinese font, latin name '{breed_name_en}' in handwritten English, origin chip '原产地 · {origin}', small icon row with size/weight/lifespan. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor + info graphic. Mood: gentle, healing, cute but professional.
```

> **`{small_mammal_themed}` 替换示例:**
> - 仓鼠/沙鼠:`carrots, sunflower seeds, hay, small wood shavings`
> - 兔子/荷兰猪:`carrots, fresh greens, dandelion flowers, hay`
> - 刺猬:`acorns, fallen leaves, mushrooms, tiny paw prints`
> - 雪貂:`ferret toys, fish bones (small), feathers`
> - 龙猫:`dried herbs, pumice stone, juniper branches`
> - 迷你垂耳兔:`carrots, daisies, soft hay, mushrooms`

---

## 第 2 张 · 形态特征

**结构**:
- 整图有暖棕画框
- 页码 2/6 + 标题「形态特征 · Traits」
- 5 行对比表(身长/体重/寿命/被毛/眼睛)
- 底部小真实小型哺乳侧脸

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{height_range}`, `{weight_range}`, `{lifespan_range}`, `{coat_desc}`, `{eye_colors}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: page indicator '2 / 6' in warm brown, section title '形态特征 · Traits' in rounded Chinese. Main: clean comparison table with 5 rows within the frame. Row 1: 身长 {height_range} with small animal silhouette ruler icon. Row 2: 体重 {weight_range} with scale icon (showing grams). Row 3: 寿命 {lifespan_range} with hourglass icon. Row 4: 被毛 {coat_desc} with fur texture illustration. Row 5: 眼睛 {eye_colors} with eye color circles. Each row has hand-drawn watercolor paw print (small) accents. Bottom: small real {breed_name_en} profile photo with watercolor edges, within the frame. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image.
```

> **注意**:小型哺乳体重用克/克 vs 千克,需要根据品种调整(仓鼠 100-200g,兔 1-2kg)。

---

## 第 3 张 · 性格雷达

**结构**:
- 整图有暖棕画框
- 页码 3/6 + 标题「性格雷达 · Personality」
- **6 维**(小型哺乳专用,跟犬猫不同):
  - 亲人度 affection
  - 活跃度 activity
  - 独立性 independence
  - 智商 intelligence
  - 夜行性 nocturnal
  - 社交性 social
- 右侧综合评分卡

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{affection}`, `{activity}`, `{independence}`, `{intelligence}`, `{nocturnal}`, `{social}`, `{avg_score}`, `{summary}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '3 / 6' in warm brown, section title '性格雷达 · Personality' in rounded Chinese. Main center: 6-axis personality radar chart with watercolor edges and clean data lines, within the frame. Axes labels in Chinese: 亲人度 {affection}/10, 活跃度 {activity}/10, 独立性 {independence}/10, 智商 {intelligence}/10, 夜行性 {nocturnal}/10, 社交性 {social}/10. Each axis has a small paw print icon. Right side info card: '综合评分 {avg_score}/10' and subtitle '{summary}'. Background: oat with subtle hand-drawn paw prints (small) and leaves. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor.
```

> **小型哺乳 6 维差异**(跟犬/猫对比):
> - ❌ 不要 `obedience` 服从度(小型哺乳不训练)
> - ❌ 不要 `vocalization` 吠叫度(不适用)
> - ✅ 用 `nocturnal` 夜行性(很多小型哺乳夜行)
> - ✅ 用 `social` 社交性(独居 vs 合笼关键指标)

---

## 第 4 张 · 演化历史

**结构**:
- 整图有暖棕画框
- 页码 4/6 + 标题「演化历史 · History」
- **3-4 节点**横向时间线(异宠历史通常较短,可能只 3 个节点)
- 节点图标:野外/科研/家宠/现代

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{year_1..3_or_4}`, `{event_1..3_or_4}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '4 / 6' in warm brown, section title '演化历史 · History' in rounded Chinese. Main: hand-drawn horizontal timeline with 3-4 milestone nodes, within the frame. Node 1: {year_1} '{event_1}' with small wild habitat icon. Node 2: {year_2} '{event_2}' with research/laboratory icon. Node 3: {year_3} '{event_3}' with home pet icon. Node 4 (optional): {year_4} '{event_4}' with modern house icon. Each node has a small Chinese description. Bottom right: small real {breed_name_en} head photo. Background: oat with small paw print decorations. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum timeline illustration + healing watercolor + vintage specimen card.
```

> **3 vs 4 节点处理**:如果 history.timeline 只有 3 个,模板里 Node 4 删掉;有 5 个的画 4 个最重要的。

---

## 第 5 张 · 养护指南

**结构**:
- 整图有暖棕画框
- 页码 5/6 + 标题「养护指南 · Care」
- **2×2 卡片**:
  - 饮食 Diet
  - 运动 Exercise
  - 医疗 Health
  - 环境 Environment(小型哺乳专有:笼舍/温度/湿度)

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{diet}`, `{exercise}`, `{health}`, `{environment}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '5 / 6' in warm brown, section title '养护指南 · Care Guide' in rounded Chinese. Main: 4 cards in 2x2 grid, within the frame. Card 1: '饮食 Diet' with bowl icon, text '{diet}'. Card 2: '运动 Exercise' with running small animal icon, text '{exercise}'. Card 3: '医疗 Health' with stethoscope icon, text '{health}'. Card 4: '环境 Environment' with cage/habitat icon, text '{environment}'. Each card has a soft watercolor background. Bottom: small real {breed_name_en} photo, within the frame. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor.
```

> **小型哺乳 4 卡片差异**:
> - ❌ 不要 `training` 训练卡(小型哺乳训练不突出)
> - ✅ 用 `environment` 环境卡(笼舍大小/温度/湿度/垫料是核心)
> - 注意单位:温度用 ℃,湿度用 %,笼舍用 cm

---

## 第 6 张 · 名场面

**结构**:
- 整图有暖棕画框
- 页码 6/6 + 标题「名场面 · Famous」
- 4 拼贴趣闻(动漫/网络梗/科研/历史)
- 装饰元素:小型 paw print + 食物/坚果(品种专属)

**Prompt 模板**(替换 `{breed_name_zh}`, `{breed_name_en}`, `{famous_1..4}`):

```text
A vintage museum specimen card aesthetic, 9:16 vertical. Healing hand-drawn style with watercolor illustration + flat info graphic. Subtle paper texture background (oat) with a decorative frame border in warm brown. Top: small dot indicator '6 / 6' in warm brown, section title '名场面 · Famous Moments' in rounded Chinese. Main: collage of 4 hand-drawn watercolor vignettes, within the frame. Vignette 1: '{famous_1}' with icon. Vignette 2: '{famous_2}' with icon. Vignette 3: '{famous_3}' with icon. Vignette 4: '{famous_4}' with icon. Each has a small Chinese handwritten caption. Bottom: real {breed_name_en} photo. Background: oat with small paw print (mini size) decorations. Palette: oat, sand, warm brown, mint only — no hex codes, color labels, or color swatches visible in the image. Style: museum specimen card + healing watercolor.
```

> **小型哺乳著名场面的类型**:
> - 动漫/电影角色(哈姆太郎、豚鼠特派员、龙猫 Totoro)
> - 网络梗(仓鼠轮子跑不停、雪貂 war dance)
> - 科研(1930 叙利亚仓鼠野外捕获 → 全球家宠祖先)
> - 历史趣闻(维多利亚女王养安哥拉兔)

---

## 批量执行流程

1. 选品种(从 `content/pets/{breed}.json` 读)
2. 验证 `template === 3`(避免跟犬猫混)
3. 从 JSON 抽字段填到 prompt 模板的 `{...}` 占位
4. 用 image_synthesize 6 张同时跑
5. 文件名:`art/small-mammal/{breed}/01-cover.png` 等
6. 同步到 `web/public/small-mammal/{breed}/`

## 当前状态

- ⏳ 模板 3 · 12 个小型哺乳待跑(叙利亚仓鼠/中国仓鼠/罗伯罗夫斯基仓鼠/冬白仓鼠/荷兰垂耳兔/道奇兔/安哥拉兔/迷你垂耳兔/迷你雷克斯/荷兰猪/龙猫/雪貂/刺猬)
- ✅ 模板基准:`_shared-style-guide.md` 加 vintage paper 关键字
- ✅ 命名规范:已用 `art/small-mammal/{slug}/XX-{key}.png` 英文 key

## 跑前 checklist

- [ ] 验证 `content/pets/{slug}.json` 的 `template === 3`
- [ ] 验证 `history.timeline` 是 3-4 个节点(不是 5 个)
- [ ] `personality` 有 nocturnal + social 字段(没有要从 5 维适配)
- [ ] `care` 有 environment 字段(没有要从 training 适配)
- [ ] `physical.weightKg` 是克/千克混合(仓鼠是 0.12-0.2,兔是 1-2)
