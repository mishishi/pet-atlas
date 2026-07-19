# Contributing to pet-atlas

Pet Atlas 是一个个人项目,但欢迎任何形式的反馈和建议。

## 提建议 / 报错

最简单的方式:在 GitHub 上开 [Issue](https://github.com/mishishi/pet-atlas/issues)。

适合开 Issue 的:
- 🐛 页面 bug(图片 404、按钮不灵、移动端排版错)
- 🎨 视觉不一致(图谱风格跑偏、品种混淆)
- 📝 内容错误(品种数据、性格评分)
- 💡 新功能建议(分类筛选、搜索、社交分享)

不适合 Issue 的(自己改就行):
- 个性化主题色
- 私有品种数据

## 提 PR(代码改动)

### 1. 准备

```bash
git clone https://github.com/mishishi/pet-atlas.git
cd pet-atlas
cd web && npm install && cd ..
```

### 2. 新建分支

```bash
git checkout -b feature/your-feature
```

### 3. 改代码

主要改动点:
- `content/pets/*.json` — 加新品种
- `prompts/_template-*.md` — 改 prompt 模板
- `web/app/` — UI 改
- `web/components/` — 组件改
- `web/lib/` — 工具函数

**新增品种**的话:
1. `content/pets/<slug>.json` — 按 README schema 填
2. `web/lib/pets.ts` 里的 `VINTAGE_PAPER_DONE` Set 加 slug
3. 用 `scripts/atlas-pipeline.mjs` 跑 6 张图
4. `scripts/atlas-finalize.mjs` 收尾(同步 + 上传 TCB + 提交)

### 4. 验

```bash
cd web
npm run build
# 浏览 out/ 看效果,或 python3 -m http.server 8080 启本地服务
```

CI 会自动跑 `npm run build`,看 PR 状态就知有没有 break。

### 5. 推 + 开 PR

```bash
git push origin feature/your-feature
# 在 GitHub 上点 "Compare & pull request"
```

PR 描述里说清楚:
- 改了什么
- 为什么改
- 截图(UI 改)

## 风格

- 提交信息用中文(项目主语言)
- 代码注释用中文
- 变量名 / 文件名用英文
- 一类改动一个 commit,别一锅端
- 大改动先开 Issue 讨论,别直接开 PR

## 致谢

贡献者会列在 README 致谢区(自愿)。
