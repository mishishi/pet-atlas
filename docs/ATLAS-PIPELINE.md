# 宠物图谱自动生成 pipeline

> 端到端流程:输入 1 个 pet slug → 自动渲染 prompt → 调 image_synthesize → 同步镜像 → 上传 TCB → commit → push。
> 一条命令跑完一个品种(或批量)。

## 3 个触发方式

### 1. 单个品种(适合"现在给我跑 X")
```bash
node scripts/atlas-pipeline.mjs labrador-retriever
```
输出 JSON,包含 6 个 prompt + image_synthesize 模板 + copy_to 路径。
agent 据此跑 6 次 image_synthesize,然后:
```bash
node scripts/atlas-finalize.mjs labrador-retriever
```
自动同步 + 上传 + commit + push。

### 2. 批量
```bash
node scripts/atlas-pipeline.mjs labrador-retriever golden-retriever
# 或
node scripts/atlas-pipeline.mjs --remaining   # VINTAGE_PAPER_DONE 之外
# 或
node scripts/atlas-pipeline.mjs --all         # 全部 50 个
```
agent 跑 N×6 次 image_synthesize(会很慢 + 烧 token),然后:
```bash
node scripts/atlas-finalize.mjs labrador-retriever,golden-retriever
```

### 3. Cron 后台(适合凌晨)
mavis cron 调 agent session,接受指令"跑 --remaining,token 见底就停"。

## agent 完整工作流

当用户说"跑下一个品种 / 跑 X"时,agent 走 3 步:

### Step 1: 拿 prompt 清单
```bash
cd /Users/zhurenbao/Jason/codex-workspace/pet-receiver
node scripts/atlas-pipeline.mjs <slug> [slug2 ...] > /tmp/atlas-pipeline.json
```
读 `/tmp/atlas-pipeline.json`,得到结构:
```json
{
  "total_breeds": 1,
  "breeds": [
    {
      "slug": "labrador-retriever",
      "category": "dog",
      "prompts": [
        {
          "slot": "01-cover", "key": "cover",
          "prompt": "vintage museum specimen card ...",
          "output_path": "art/dog/labrador-retriever/01-cover.png",
          "copy_to": "web/public/dog/labrador-retriever/01-cover.png"
        },
        ... (6 项)
      ]
    }
  ]
}
```

### Step 2: 顺序调 image_synthesize
对每个 `breeds[i].prompts[j]`:
```
image_synthesize({
  prompt: prompts[j].prompt,
  output_file_path: prompts[j].output_path,
})
```
然后 `cp prompts[j].output_path prompts[j].copy_to`(同步 web/public 镜像)。

**注意:**
- 6 张图 aspect_ratio=9:16 resolution=2K(与已上传一致)
- 不要 input_file_path(纯 text-to-image)
- 失败重试 1-2 次,再失败就 skip 这张继续

### Step 3: 收尾
```bash
node scripts/atlas-finalize.mjs <slug> [<slug2> ...]
```
自动做:
1. **同步** PNG art/ → web/public/(防止 web/public 旧文件)
2. **上传 TCB** `node web/scripts/upload-atlas-tcb.mjs <category>`(size 校验,新文件才传)
3. **git add** art/{cat}/{slug} + web/public/{cat}/{slug}
4. **commit** `feat(atlas): 生成 <slug> vintage paper 图谱`
5. **push** origin main

跳过选项:
- `--no-upload` 跳过 TCB(只想本地生成本地)
- `--no-commit` 跳过 git(想让用户手动 commit)

## 当前 50 品种状态

`VINTAGE_PAPER_DONE` 已经是 50 个(7/18 vintage paper 重做后)。
`--remaining` 现在返回空(全跑完了)。

`--all` 也是空。

新增品种时:
- 加 `content/pets/{slug}.json`(带 template 1-4)
- 加 50 个品种不在 VINTAGE_PAPER_DONE 时,`--remaining` 会自动 pick up

## 失败重试

| 失败点 | 行为 |
|---|---|
| image_synthesize 单张失败 | agent 重试 2 次,仍失败 skip 这张,跑完其他 5 张,提交时缺 1 张 |
| cp art → web/public 失败 | finalize 中止(同步必须成功) |
| upload 部分失败 | finalize 继续,commit 时不强求所有图上传成功 |
| git commit 失败(没 staged) | 跳过(可能图已存在,没新东西可 commit) |
| git push 失败 | 中止,commit 留在本地,等手动 `git push` |

## 已有脚本复用

- `scripts/render-prompts.mjs` — 渲染 6 个 prompt 模板(给 atlas-pipeline.mjs 调)
- `web/scripts/upload-atlas-tcb.mjs` — 批量上传到 TCB(给 atlas-finalize.mjs 调)
- `web/scripts/vintage-paper-batch.mjs` — 扫 50 品种生成 batch 清单(P0 阶段的旧脚本,可退役)

## Token 预算

- 每张图 ~1 信用(2K, 9:16)
- 每品种 6 张 = 6 信用
- 50 品种全跑 = 300 信用
- 假设 daily limit 100 信用,1 天跑 16 个品种(3-4 天跑完全部)

## 适用

- pet-atlas 添加新品种
- 重做某些图(改 prompt 模板后)
- 大批量回填历史图谱
