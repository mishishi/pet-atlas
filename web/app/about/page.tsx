/**
 * web/app/about/page.tsx · 关于 / 方法论页
 *
 * 讲清三件事:
 *  1. 这是什么 — pet-atlas 的初心和目标
 *  2. 为什么用 vintage museum specimen card 风格
 *  3. 怎么做的 — AI 图谱 + 手工排版 + 标本卡美学的工艺
 */

import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LeafDivider } from "@/components/brand/BotanicalBorder";

export const metadata = {
  title: "关于 · 宠物大百科",
  description:
    "为爱宠收藏一整套图鉴 — vintage museum specimen card 美学 + AI 图谱 + 51 种动物。",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main
        className="relative w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
        }}
      >
        {/* 纸张噪点 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            mixBlendMode: "multiply",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/></svg>\")",
          }}
        />

        <Container size="lg" className="relative z-10 py-12 md:py-20 px-6 md:px-12">
          {/* 顶部标题 */}
          <div className="text-center mb-12 md:mb-20">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-brick mb-3 flex items-center justify-center gap-3">
              <span className="inline-block w-8 h-px bg-brick" />
              About · 关于
              <span className="inline-block w-8 h-px bg-brick" />
            </div>
            <h1
              className="font-serif font-bold text-brown-900 leading-[0.95] tracking-tight mb-4"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
            >
              为每一只伙伴
              <br />
              留一份<span className="text-brick italic">标本卡</span>
            </h1>
            <div className="flex justify-center my-6">
              <LeafDivider className="w-48 md:w-64 h-auto" />
            </div>
            <p className="font-serif text-lg md:text-xl text-brown-700 max-w-2xl mx-auto leading-relaxed">
              pet-atlas 是一个非商业的视觉收藏项目 —— 把 AI 生成的 100 种
              动物图谱,装进 19 世纪博物馆标本卡的画框里。
            </p>
            <div className="inline-block mt-4 px-4 py-1.5 rounded-full border border-warm-brown/30 bg-oat-50/60">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brick">
                v1.0 · 100 breeds milestone · 2026-07-23
              </span>
            </div>
          </div>

          {/* 三大问题 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-24">
            <ValueCard
              no="I"
              title="标本卡"
              zh="Specimen Card"
              body="19 世纪博物学家在田野里收集样本,带回博物馆编号入册。每张卡片都按固定格式登记:编号、种名、产地、采集者、年份。我们用同样的格式给 100 种动物做了一套'当代标本卡'。"
            />
            <ValueCard
              no="II"
              title="水彩治愈"
              zh="Healing Watercolor"
              body="AI 默认出图偏冷偏工业,我们把所有图谱强制重写成'治愈水彩'美学:暖棕画框、燕麦底色、薄荷点缀、折痕纸背景。让看图谱本身成为休息。"
            />
            <ValueCard
              no="III"
              title="翻页触感 + 养宠"
              zh="Flip Touch + Pet Care"
              body="9:16 竖屏 + CSS 3D 翻页 + 键盘 ←→ + 触摸滑动,像翻精装图鉴。同时支持领养一只 cloud-pet:喂食/抚摸/写日记/解锁 6 段心情试听,把它从立绘养成'朋友'。"
            />
          </div>

          {/* 工艺流程 */}
          <section className="mb-16 md:mb-24">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-3 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-brick" />
              No. 02
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 leading-tight mb-3">
              怎么做的
              <span className="ml-3 font-serif italic text-xl md:text-2xl text-brown-500 font-normal">
                How It's Made
              </span>
            </h2>
            <p className="font-serif text-brown-700 max-w-3xl mb-10 leading-relaxed">
              100 种动物 × 6 张图 = 600 张图谱 + 300 张 1:1 立绘(cloud-pet 用),
              全部由 AI 生成 + 手工 prompt 调教。每张图都有一份同名 .md 文档记录当时的 prompt,方便回溯和复现。
            </p>

            <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl">
              <Step n="01" title="收集元数据">
                <code className="font-mono text-xs text-brick">content/pets/*.json</code>
                记录每种动物的中英文名、原产地、身高/体重/寿命/性格评分/历史时间线/名场面。
              </Step>
              <Step n="02" title="套用模板">
                <code className="font-mono text-xs text-brick">prompts/_template-*.md</code>
                按物种选模板(犬/猫/小哺乳/鸟+爬虫),把元数据填进占位符。
              </Step>
              <Step n="03" title="渲染 prompt">
                <code className="font-mono text-xs text-brick">scripts/render-prompts.mjs</code>
                生成 6 张图各自的最终 prompt,写到 <code className="font-mono text-xs text-brick">art/{'{cat}'}/{'{slug}'}/</code>。
              </Step>
              <Step n="04" title="AI 出图">
                image_synthesize 跑 6 张(2K 1536×2752),强制 vintage museum specimen card
                美学 + 暖棕画框 + 真实品种照片锚定。
              </Step>
              <Step n="05" title="同步 + 上传">
                <code className="font-mono text-xs text-brick">scripts/atlas-finalize.mjs</code>
                同步到 web/public/ + 上传到 TCB CDN + 写 git commit。
              </Step>
              <Step n="06" title="前端渲染">
                Next.js 静态导出,部署到 Vercel,走 TCB 图床。首屏 11MB → 1.4MB(thumb 变体)。
              </Step>
            </ol>
          </section>

          {/* 数字统计 */}
          <section className="mb-16 md:mb-24">
            <div
              className="rounded-2xl p-8 md:p-12"
              style={{
                background: "rgba(245, 233, 208, 0.5)",
                boxShadow: "var(--shadow-paper-md)",
                border: "1px solid rgba(139, 111, 71, 0.15)",
              }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-3 flex items-center gap-3">
                <span className="inline-block w-8 h-px bg-brick" />
                No. 03
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brown-900 leading-tight mb-8">
                数字
                <span className="ml-3 font-serif italic text-lg text-brown-500 font-normal">
                  By the Numbers
                </span>
              </h2>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Stat label="品种" value="100" sub="breeds" />
                <Stat label="图谱" value="600" sub="plates" />
                <Stat label="立绘" value="300" sub="portraits" />
                <Stat label="图床" value="TCB" sub="tencent cloud" />
              </dl>
            </div>
          </section>

          {/* 致谢 */}
          <section className="mb-16 md:mb-24">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-3 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-brick" />
              No. 04
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brown-900 leading-tight mb-3">
              致谢
              <span className="ml-3 font-serif italic text-lg text-brown-500 font-normal">
                Credits
              </span>
            </h2>
            <div className="max-w-3xl space-y-4 text-brown-700 leading-relaxed">
              <p>
                视觉风格参考了 19 世纪鸟类学专著(John Gould《Birds of
                Australia》)、标本馆馆藏图录,以及现代复古风插画师
                Catherine Pearson 的水彩植物图鉴。
              </p>
              <p>
                图谱生成由 LLM image_synthesize 完成,prompt
                工程细节都记录在每个 <code className="font-mono text-xs text-brick">art/{'{cat}'}/{'{slug}'}/*.md</code> 文件里。
              </p>
              <p>
                CDN 资源托管在腾讯云 CloudBase(同一个 bucket 复用了 history-tool
                项目的存储),首屏优化靠 thumb/medium 双变体 + 浏览器原生懒加载。
              </p>
              <p>
                前端用 Next.js 16 + React 19 + Tailwind v4,部署走 Vercel Git 集成,
                一行 <code className="font-mono text-xs text-brick">git push</code> 自动上线。
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-3 flex items-center justify-center gap-3">
              <span className="inline-block w-8 h-px bg-brick" />
              Ready to Start
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brown-900 mb-6">
              准备好翻第一页了吗?
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/pets">
                <Button variant="primary" size="lg">
                  浏览全部 100 个品种
                </Button>
              </Link>
              <Link href="/adopt">
                <Button variant="secondary" size="lg">
                  领养一只 →
                </Button>
              </Link>
              <a
                href="https://github.com/mishishi/pet-atlas"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="lg">
                  GitHub →
                </Button>
              </a>
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500">
              📝 完整 v1.0 release note 见{" "}
              <a
                href="https://github.com/mishishi/pet-atlas/blob/main/docs/RELEASE-NOTES-v1.0.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brick hover:underline"
              >
                GitHub docs/RELEASE-NOTES-v1.0.md
              </a>
            </p>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 内部小组件                                                          */
/* ------------------------------------------------------------------ */

function ValueCard({
  no,
  title,
  zh,
  body,
}: {
  no: string;
  title: string;
  zh: string;
  body: string;
}) {
  return (
    <div
      className="relative p-6 md:p-8 rounded-xl"
      style={{
        background: "rgba(245, 233, 208, 0.5)",
        boxShadow: "var(--shadow-paper-md)",
        border: "1px solid rgba(139, 111, 71, 0.15)",
      }}
    >
      <div
        className="absolute -top-3 -left-3 w-10 h-10 rounded-full font-serif text-base font-bold flex items-center justify-center"
        style={{ background: "var(--brown-700)", color: "var(--oat-100)" }}
      >
        {no}
      </div>
      <h3 className="font-serif text-xl md:text-2xl font-bold text-brown-900 mb-1">
        {title}
      </h3>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brick mb-4">
        {zh}
      </p>
      <p className="text-brown-700 leading-relaxed">{body}</p>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li
      className="relative p-5 rounded-xl"
      style={{
        background: "rgba(245, 233, 208, 0.4)",
        border: "1px solid rgba(139, 111, 71, 0.12)",
      }}
    >
      <div className="flex items-start gap-4">
        <span
          className="shrink-0 w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center"
          style={{ background: "var(--brick)", color: "#F5E9D0" }}
        >
          {n}
        </span>
        <div className="flex-1">
          <h4 className="font-serif text-lg font-bold text-brown-900 mb-2">
            {title}
          </h4>
          <div className="text-sm text-brown-700 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </li>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500 mb-2">
        {label}
      </dt>
      <dd>
        <span className="font-serif text-4xl md:text-5xl font-bold text-brown-900">
          {value}
        </span>
        <span className="ml-2 font-mono text-xs text-brown-500 italic">{sub}</span>
      </dd>
    </div>
  );
}
