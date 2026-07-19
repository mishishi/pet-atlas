# 宠物图集 COS 迁移方案

> 目标:把 300+ 张 PNG 全部上腾讯云 COS,网站从 Vercel 切到 COS,Vercel 部署体积从 ~1GB 降到 <10MB。

**状态:** P0 配置阶段(等用户在腾讯云控制台操作)
**Worktree:** `.worktrees/feat-cos-migration` (branch `feature/cos-migration`)

---

## P0 决策(已拍板)

| 决策点 | 选择 | 理由 |
|---|---|---|
| **云服务商** | 腾讯云 (CloudBase 底层 COS) | 用户用 TCB 环境 `cloud1-d9gv1q8ikad5e9721`,底层走标准 COS,直接调底层 bucket |
| **Region** | ap-shanghai (上海) | 跟 TCB 环境一致 |
| **Bucket** | TCB 底层 bucket(形如 `cloud1-d9gv1q8ikad5e9721-1307xxxxxx`) | 不新建,直接用现有 TCB 环境的存储 |
| **上传方式** | 标准 cos-nodejs-sdk-v5 (CAM 密钥 + bucket) | skill 脚本直接复用,零重写 |
| **访问域名** | 走 TCB 静态网站托管的免费域名(或 COS 默认域名) | 最简方案,免去 DNS 配置 |
| **存储类型** | 标准存储 | TCB 默认 |
| **网站改造深度** | 全部走 COS + Vercel 删 PNG | 降部署体积 + 国内快 + 长期存储 + 跨项目复用 |

---

## 数据盘点

```
303 个 PNG (50 品种 × 6 页 + 3 个 design draft)
957 MB
路径: art/{dog,cat,small-mammal,bird-reptile}/{slug}/0N-*.png
镜像: web/public/{dog,cat,small-mammal,bird-reptile}/{slug}/0N-*.png (已同步)
每张: ~3.16 MB (1536×2752, PNG)
```

---

## 4 阶段实施

### P0 配置 (1h,用户操作)

用户用的是 TCB 环境 `cloud1-d9gv1q8ikad5e9721`,底层是标准 COS bucket。我们要拿到这个底层 bucket 的访问信息。

#### 步骤 1: 拿到底层 COS bucket 名

1. 打开 TCB 控制台 → 存储
2. 创建一个测试文件夹(比如 `test-folder`),在里面随便上传一个文件(比如一个 txt)
3. **点这个文件,看详情/属性** —— 完整路径会显示成:
   ```
   cloud://cloud1-d9gv1q8ikad5e9721.6368-cloud1-d9gv1q8ikad5e9721-1307xxxxxx/test-folder/test.txt
   ```
4. `6368-cloud1-d9gv1q8ikad5e9721-1307xxxxxx` 那一长串就是 **底层 bucket 名**(完整复制给我)

#### 步骤 2: 拿到访问域名(二选一)

**A. 用 TCB 静态网站托管 (推荐,简单)**
- TCB 控制台 → 存储 → 静态网站托管 → 立即开通
- 开通后会给你一个**默认域名**,形如 `cloud1-d9gv1q8ikad5e9721-1307xxxxxx.tcb.qcloud.la`
- 复制这个完整域名给我
- (如果想用自己的域名,可以配 CNAME,但默认域名够用了)

**B. 用 COS 默认公有读域名**
- COS 控制台 → 选这个 bucket → 域名管理 → 找到"默认访问域名"
- 形如 `cloud1-d9gv1q8ikad5e9721-1307xxxxxx.cos.ap-shanghai.myqcloud.com`
- 这个域名也走 CDN,直接能用

**选 A 或 B 都行,A 更省事(TCB 自动帮你开 CDN)。**

#### 步骤 3: 配 CORS(允许 Vercel 域名跨域拉图)
- COS 控制台 → 选这个 bucket → 权限管理 → 跨域 CORS 设置
- 添加规则:
  - 来源 Origin: `*` (或 `https://out-three-tan.vercel.app` 限定)
  - 操作 Methods: `GET, HEAD`
  - 允许 Headers: `*`
  - 暴露 Headers: `ETag, Content-Length, Content-Type`

#### 步骤 4: 创建 CAM API 密钥
- 打开 https://console.cloud.tencent.com/cam/capi
- 点 **新建密钥** → **自定义创建**
- 权限:绑 `QcloudCOSFullAccess` (或更窄的自定义策略,只允许这个 bucket,后面再收紧)
- 创建后拿到 **SecretId + SecretKey**(只显示一次!复制保存)
- ⚠️ 不要用 TCB 的"云开发 API 密钥",必须用 CAM 密钥,因为 skill 脚本走标准 COS API

#### 步骤 5: 把 4 个值发给我
1. **TCB 底层 bucket 名** (步骤 1 拿到的)
2. **访问域名** (步骤 2 选的 A 或 B)
3. **SecretId**
4. **SecretKey**

Region 我已经知道是 `ap-shanghai`,不用你提供。

---

### P1 上传 (1-2h,我执行)

我会:
1. 装 `cos-nodejs-sdk-v5` 依赖(skill 自带)
2. 写 `scripts/upload-pet-atlas.mjs`(基于 `tcb-static-uploader/scripts/upload.mjs` 改)
   - `--local web/public/{dog,cat,small-mammal,bird-reptile}` —— 4 个目录分别跑
   - `--project pet-atlas --type atlas` —— prefix = `pet-atlas/atlas/{category}/{slug}/...`
3. 干跑 (`--dry-run`) 验证路径对不对
4. 真跑(支持断点续传、size 校验)
5. 抽样验证 5 张图能正常访问
6. 报告:上传成功 / 失败数 / 总耗时

上传 prefix 规划:
```
pet-atlas/
  atlas/                          <- --type atlas
    dog/                          <- category
      labrador-retriever/         <- slug
        01-cover.png
        02-traits.png
        03-personality.png
        04-history.png
        05-care.png
        06-fun-facts.png
    cat/ ...
    small-mammal/ ...
    bird-reptile/ ...
```

最终 URL 形如:
```
https://atlas.mishishi.com/pet-atlas/atlas/dog/labrador-retriever/01-cover.png
```

---

### P2 改站 (30min,我执行)

1. **Vercel env** 加:
   - `NEXT_PUBLIC_ATLAS_BASE_URL=https://atlas.mishishi.com/pet-atlas/atlas`

2. **`web/lib/atlas-constants.ts`** 改(图片 URL 都加 base 前缀)
   - 所有 hardcoded `/dog/...` 改成 `${process.env.NEXT_PUBLIC_ATLAS_BASE_URL}/dog/...`
   - 注意:`output: 'export'` 下 env 必须在 build time 注入

3. **`web/next.config.ts`** 加 `images.remotePatterns` 允许 COS 域名

4. **本地测试 build**:`cd web && npm run build`
   - 确认生成静态页时图片 URL 全部指向 COS
   - 抽查几个 HTML 文件看 URL 替换对不对

5. **重新部署 Vercel**:`cd web/out && npx vercel --prod --yes`

---

### P3 清理 (15min,我执行)

1. **`.gitignore`** 加:
   ```
   public/dog/*.png
   public/cat/*.png
   public/small-mammal/*.png
   public/bird-reptile/*.png
   ```

2. **从 git untrack**:
   ```bash
   git rm --cached -r web/public/dog web/public/cat \
                       web/public/small-mammal web/public/bird-reptile
   ```

3. **删本地副本** (节省磁盘):
   ```bash
   rm -rf web/public/dog web/public/cat \
          web/public/small-mammal web/public/bird-reptile
   ```

4. **重新部署 Vercel**(现在 `out/` 不再含 957MB PNG,部署会快很多)

5. **commit + push**:
   ```bash
   git add -A
   git commit -m "feat(cdn): 切图到腾讯云 COS,删本地 PNG 副本"
   git push origin feature/cos-migration
   ```
   (PR / merge 到 main 让用户拍)

---

### P4 验证 (15min,我执行)

- 浏览器开 Vercel 站点,逐个 spot-check 5 个不同 category 的品种
- 国内访问速度(用户自测)
- 写一个 `docs/COS-MIGRATION-COMPLETE.md` 收尾文档
- 总结:Vercel 部署 size 对比、CDN 命中率、成本估算

---

## 风险 + 兜底

| 风险 | 兜底 |
|---|---|
| 家里宽带上传 957MB 太慢 | 分批跑,每 50 个一批,sleep 重试 |
| 上传中网络断 | 脚本支持 size 校验,重跑会跳过已存在的 |
| CDN 缓存延迟 | 第一次访问国内慢,5 分钟后 CDN 命中 |
| 改 URL 漏改某处 | grep 全工程 `"/dog/`、`/cat/` 等,确保替换 |
| 本地副本删了想再调 | `scripts/download-pet-atlas.mjs` 反向脚本,从 COS 拉回 |
| Vercel env 拼写错 | build 时校验 URL 必须以 https:// 开头 |
| 后续改图 (重跑 1 个品种) | 单独跑 `--local web/public/dog/<slug> --force` |

---

## 完成后

- Vercel 部署 size: **957MB → <10MB** (-99%)
- 国内访问: Vercel 海外节点 → 腾讯云 CDN 国内节点,首屏 < 200ms
- 跨项目: 任何项目都能引用 `atlas.mishishi.com` 拉图,做 App/小程序/印刷品都行
- 长期存储: COS 3 副本,99.999999999% 持久性

---

## 进度跟踪

- [x] P0 决策(用户拍)
- [ ] P0 配置(用户在腾讯云操作,等 4 个值)
- [ ] P1 上传(我执行)
- [ ] P2 改站(我执行)
- [ ] P3 清理(我执行)
- [ ] P4 验证(我执行)
