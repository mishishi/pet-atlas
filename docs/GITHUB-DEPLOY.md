# GitHub Auto-Deploy

Vercel 项目 `pet-receiver` 已连接 GitHub repo `mishishi/pet-atlas`。

## 触发方式
- `git push origin main` → Vercel 自动 build + deploy 到 `out-three-tan.vercel.app`
- 每次 commit 都会触发,build 失败会标 Error,但不影响旧部署运行

## 项目配置
- Root Directory: `web/`
- Build: `npm run build` (Next.js 静态导出 → `out/`)
- Output: `out/`
- Framework: `nextjs` + `output: "export"` (纯静态)
- 环境变量 `NEXT_PUBLIC_ATLAS_BASE_URL`: TCB CDN URL

## 限制
- Vercel free plan 5000 upload/天限制 — 走 git 不算 upload
- 每个 build 30s 内完成(本地 build 实测 ~10s)
- 每次 push 都 build,频繁 commit 浪费配额 — 重要改动再 push

## 旧 CLI 部署
- `out` 项目已停用,但 alias `out-three-tan.vercel.app` 保留指向新部署
- 需要时可以删除 `out` 项目:`vercel rm out --yes`
