# 宠物品种元数据规范

> 50 个品种的元数据文件都在这个目录,每个品种一个 `.json`。
> 模板设计原则:**所有信息"为图谱服务"**——字段是 6 张图谱要展示的内容,不是百科全书的全部信息。

---

## 文件命名

- 犬: `{breed-slug}.json` → `labrador-retriever.json`、`shiba-inu.json`
- 猫: `{breed-slug}.json` → `british-shorthair.json`、`ragdoll.json`
- 异宠: `{breed-slug}.json` → `syrian-hamster.json`、`ball-python.json`

slug 全部小写,英文,连字符分隔。中文名放 `name.zh`。

---

## Schema 字段说明

### 1. 基础标识

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `slug` | string | ✅ | 英文短横线,作为 URL 路径 |
| `name.zh` | string | ✅ | 中文名(如「拉布拉多寻回犬」) |
| `name.en` | string | ✅ | 英文名(如「Labrador Retriever」) |
| `name.alias.zh` | string[] | ⭕ | 中文别名(如「拉拉」「拉布拉多」) |
| `category` | enum | ✅ | `dog` / `cat` / `small-mammal` / `bird` / `reptile` |
| `template` | string | ✅ | `1` / `2` / `3` / `4`(对应 4 套图谱模板) |
| `status` | enum | ✅ | `published` / `draft` / `archived` |
| `publishedAt` | ISO date | ✅ | 首次发布日期 |

### 2. 来源(用于历史页 + 地图可视化)

| 字段 | 类型 | 说明 |
|------|------|------|
| `origin.country` | string | 国家(如「加拿大」) |
| `origin.region` | string | 地区/省(如「纽芬兰」) |
| `origin.coordinates` | [lat, lng] | 可选,用于地图页 |

### 3. 形态特征(对应 atlas-02-traits.png)

| 字段 | 类型 | 说明 |
|------|------|------|
| `physical.sizeGroup` | enum | `toy` / `small` / `medium` / `large` / `giant` |
| `physical.heightCm` | string | 范围(如「54-62」) |
| `physical.weightKg` | string | 范围(如「25-32」) |
| `physical.lifespanYears` | string | 范围(如「10-12」) |
| `physical.coat` | string | 被毛描述(如「双层短毛/防水」) |
| `physical.coatColors` | string[] | 主色列表 |
| `physical.eyeColors` | string[] | 眼睛色列表 |

### 4. 性格(对应 atlas-03-personality.png)

**6 维评分(1-10)**:
- `affection` 亲人度
- `activity` 活跃度
- `obedience` 服从度
- `independence` 独立性
- `vocalization` 吠叫度
- `intelligence` 智商值

**附加字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `personality.summary` | string | 综合评分副标题(如「家庭友好犬」) |
| `personality.tags` | string[] | 性格标签 4-6 个 |

### 5. 历史(对应 atlas-04-history.png)

| 字段 | 类型 | 说明 |
|------|------|------|
| `history.timeline` | array | 4-5 个节点,每节点 `{ year, event }` |

### 6. 养护(对应 atlas-05-care.png)

| 字段 | 类型 | 说明 |
|------|------|------|
| `care.diet` | string | 饮食要点 |
| `care.exercise` | string | 运动要点 |
| `care.health` | string | 健康注意(常见病) |
| `care.training` | string | 训练要点 |

### 7. 名场面(对应 atlas-06-famous.png)

| 字段 | 类型 | 说明 |
|------|------|------|
| `famous` | string[] | 4 个趣闻/影视/历史梗 |

### 8. 标签 & 资产

| 字段 | 类型 | 说明 |
|------|------|------|
| `tags` | string[] | 主题聚合用(如「大型犬」「家庭友好」「导盲犬」) |
| `coverImage` | string | `art/atlas-01-cover.png` 之类 |
| `gallery` | string[] | 6 张图谱文件名(顺序固定) |

### 9. 元信息(运营用)

| 字段 | 类型 | 说明 |
|------|------|------|
| `meta.views` | number | 浏览数 |
| `meta.favorites` | number | 收藏数 |
| `meta.completeness` | number | 0-100,数据完整度(用于内部 QA) |

---

## 模板对照(决定字段是否必填)

| 模板 | 适用 | 形态字段 | 历史字段 |
|------|------|---------|---------|
| 1 | 犬 | 必填 | 必填(犬有完整繁育史) |
| 2 | 猫 | 必填 | 必填 |
| 3 | 小型哺乳(兔/仓鼠/龙猫) | 必填 | 可选(可只填 origin) |
| 4 | 鸟+爬宠 | 必填 | 可选 |

**`meta.completeness` 自动计算**:
- 犬/猫:`physical + personality + history + care + famous + tags` 全有 = 100
- 异宠:`physical + personality + care + tags` 全有 = 100,`history + famous` 可空

---

## 引用方式(开发时)

```ts
// lib/pets.ts
import fs from 'fs';
import path from 'path';

const PETS_DIR = path.join(process.cwd(), 'content/pets');

export function getAllPets() {
  return fs.readdirSync(PETS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(PETS_DIR, f), 'utf-8')))
    .filter(p => p.status === 'published');
}

export function getPetBySlug(slug: string) {
  // ...
}
```

---

## 进度

- ✅ Schema 设计
- ✅ 示例:labrador-retriever.json
- ⏳ 批量 50 个(待用户确认 schema 后用 LLM 一次性生成)
