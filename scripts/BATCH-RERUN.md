# Vintage Paper 批量跑图

> 2026-07-18 决定:全部 50 品种统一到 `vintage museum specimen card` 风格(带暖棕画框 + 治愈水彩 + 平面信息图)。
> 当前已完成 4 个(british-shorthair, labrador-retriever, golden-retriever, pembroke-welsh-corgi),还有 **46 个 × 6 张 = 276 张**待生成。

---

## 清单

`vintage-paper-batch.mjs` 自动从 `content/pets/*.json` 扫描生成,数据真相在 `vintage-paper-batch.json`。

| Action | 数量 | 说明 |
|--------|------|------|
| `skip` | 4 | 已经统一到 vintage paper,不动 |
| `rerun` | 12 | 已有图但是早期风格(2026-07-18 11:15 之前),**重跑覆盖** |
| `new` | 34 | 完全没图,**新生成** |
| **合计** | **50** | 待生成 **276 张** |

按 category 分组:
- `dog` 12 (11 rerun + 1 new=chihuahua)
- `cat` 11 (1 rerun=abyssinian + 10 new)
- `small-mammal` 12 (12 new)
- `bird` 4 (4 new)
- `reptile` 7 (7 new)

---

## 跑前 checklist

- [ ] **Token Plan 限额已恢复**(用 image_synthesize 试 1 张能跑通)
- [ ] `_shared-style-guide.md` 已包含 `vintage museum specimen card` 关键字(2026-07-18 11:15 加的)
- [ ] 4 个 template 都已写好(模板 1/2 已有,模板 3/4 在 `prompts/_template-{3,4}-*.md`)
- [ ] 跑图 batch 用对应模板:dog→1, cat→2, small-mammal→3, bird/reptile→4
- [ ] bird/reptile 走 template 4,**记得填 speciesBranch** (bird 或 reptile)
- [ ] 输出路径:`art/{category-dir}/{slug}/01-cover.png` 等(`category-dir` 规则:bird+reptile 都用 `bird-reptile`)

---

## 跑法

### 1. 单独跑 1 个品种(测试用)

```js
// 在 Mavis 根 session 里(就是这次)
const entry = {
  slug: "shiba-inu",
  category: "dog",
  template: 1,
  name: { zh: "柴犬", en: "Shiba Inu" },
  origin: { country: "日本", region: "本州中部" },
  physical: { /* ... */ },
  personality: { /* ... */ },
  history: { timeline: [/* ... */] },
  care: { /* ... */ },
  famous: [/* ... */],
};

// 用 image_synthesize 一次性跑 6 张,prompt 来自 _template-1-dog.md
// 替换 {breed_name_zh} = "柴犬", {breed_name_en} = "Shiba Inu", {origin} = "日本 本州中部", ...
image_synthesize({
  requests: [
    { prompt: fillCoverPrompt(entry), output_file_path: "art/dog/shiba-inu/01-cover.png", aspect_ratio: "9:16", resolution: "2K" },
    { prompt: fillTraitsPrompt(entry), output_file_path: "art/dog/shiba-inu/02-traits.png", aspect_ratio: "9:16", resolution: "2K" },
    // ... 4 more
  ],
});
```

### 2. 批量跑(用 batch 脚本)

`scripts/vintage-paper-batch.mjs` 只生成清单 + 统计,**不直接调 image_synthesize**(那是 Mavis tool)。

真正跑的时候,按 `vintage-paper-batch.json` 顺序读,每 5-10 个品种一组并发跑(每组 30-60 张图,token 一次能用 1 组)。

### 3. 跑完更新

每次跑完一个品种:
1. **复制到 web/public**:`cp art/dog/shiba-inu/*.png web/public/dog/shiba-inu/`
2. **追加到 VINTAGE_PAPER_DONE**:`web/lib/pets.ts` 的白名单
3. **下次 build 自动生效**

### 4. 全部跑完

- [ ] 50 个品种都在 `VINTAGE_PAPER_DONE`
- [ ] `LEGACY_ATLAS_BREEDS` 清空(可选,可以保留作为历史记录)
- [ ] `npm run build` 通过
- [ ] Vercel 部署新版本
- [ ] 抽检 5 个品种页 → 都没有 legacy banner
- [ ] 抽检 5 张图 → 都带暖棕画框 + vintage paper 风格

---

## 失败处理

**单张图失败**:
- `image_synthesize` 偶尔返回空文件或不正确结果
- 重试 1 次;还是失败 → 标记到 `vintage-paper-batch.json` 的 `failed` 字段,跳过该张,继续跑其他
- 失败的图后续单独补

**Token 限额再次耗尽**:
- 立即停止当前 batch
- 记录已完成的 slug 到 `VINTAGE_PAPER_DONE`(避免下次重跑)
- 重设 cron,继续等恢复

**某品种 6 张风格不统一**:
- 不太可能(每次 6 张都是同 prompt base)
- 如果发生:整组重跑该品种

---

## 时间估算(参考)

| 阶段 | 单张耗时 | 6 张/品种 | 46 品种 |
|------|---------|-----------|--------|
| 单并发 | ~30-50s | ~3-5 min | ~2-3.5 h |
| 5 并发 | ~10-15s/张 | ~1-2 min/品种 | ~46-92 min |
| 10 并发(batch 上限) | ~6-8s/张 | ~30-50s/品种 | ~23-38 min |

按 10 并发约 25-40 分钟(假设 token 不再次耗尽)。

---

## 模板对应表

| 模板 | 适用 | 文件 |
|------|------|------|
| 1 | 犬(15 个) | `prompts/_template-1-dog.md` |
| 2 | 猫(12 个) | `prompts/_template-2-cat.md` |
| 3 | 小型哺乳(12 个) | `prompts/_template-3-small-mammal.md` |
| 4 | 鸟+爬虫(11 个) | `prompts/_template-4-bird-reptile.md` |

**风格基准**: `prompts/_shared-style-guide.md` 必读(色板 + 装饰规则 + 红线)

---

## 修订历史

- 2026-07-18 15:50 创建(用户在 12 个旧版 + 34 个新版需要统一到 vintage paper 时)
