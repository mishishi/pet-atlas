# GitHub Auto-Deploy

Vercel 项目 `pet-receiver` 已连接 GitHub repo `mishishi/pet-atlas`。

## 触发方式
- `git push origin main` → Vercel 自动 build + 部署到 `out-three-tan.vercel.app`
- 每次 commit 都会触发;build 失败会标 Error,旧部署保持运行
- Vercel 自动把生产别名(`out-three-tan.vercel.app` 等)指到最新 READY 的 production deployment

## 项目配置
- Root Directory: `web/`
- Build: `npm run build` (Next.js `output: "export"` 静态导出 → `out/`)
- Output: `out/`
- Framework: `nextjs` (兼容静态导出)
- 环境变量 `NEXT_PUBLIC_ATLAS_BASE_URL`: TCB CDN URL

## Vercel 项目 ID
- `pet-receiver`: `prj_PchVOOdr5hyDpcQhzq05Ttrgwg2U`

## 限制 / 优势
- ✅ 没有 5000 upload/天 限制(git push 不算 upload)
- ✅ 不需要 CLI 登录(走 GitHub webhook)
- ✅ Build 失败不影响旧部署运行
- ⚠️ 每次 push 都 build,频繁 commit 浪费配额 — 重要改动再 push
- ⚠️ Vercel free plan 每月 100 GB 带宽 + 100 GB-hours serverless(我们用静态导出,serverless = 0)

## 文件
- `vercel.json`: 顶层配置(framework/buildCommand/installCommand/outputDirectory)
- 注意:`rootDirectory` 必须在 Vercel 项目设置里,不能写在 `vercel.json`
