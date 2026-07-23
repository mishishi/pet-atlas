/**
 * Header · 顶部 sticky 导航 (v1.2 vintage 重设计)
 *
 * 加 vintage 标本卡元素:
 *  - 圆形品牌印章 (含 "PET ATLAS · 1876" 复古风)
 *  - 拉丁/英文 logo 用 IM Fell English (18 世纪印刷机)
 *  - 标本号 N° 数字用 Special Elite 打字机
 *
 * variant:
 *  - "default"  默认 cream 半透明背景
 *  - "overlay"  透明(用于主页 hero 上叠加)
 */
import Link from "next/link";
import { Container } from "../ui/Container";
import { AuthMenu } from "../auth/AuthMenu";

export function Header({
  variant = "default",
}: {
  variant?: "default" | "overlay";
}) {
  const isOverlay = variant === "overlay";

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        isOverlay
          ? "bg-transparent border-transparent"
          : "bg-oat-200/85 backdrop-blur-md border-brown-200/60"
      }`}
    >
      <Container size="xl" className="flex items-center justify-between h-16">
        {/* Logo + vintage 印章 */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          {/* 圆形品牌印章 */}
          <span
            aria-hidden
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border-2 border-warm-brown text-warm-brown shrink-0 transition-transform group-hover:rotate-[-6deg]"
            style={{
              background: "rgba(245, 233, 208, 0.4)",
              boxShadow: "inset 0 0 0 1px rgba(139, 111, 71, 0.2)",
            }}
          >
            <span className="font-display italic text-[10px] leading-none text-center">
              <span className="block">P.A.</span>
              <span className="block text-[8px] tracking-widest mt-px">1876</span>
            </span>
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-brown-900">
              宠物大百科
            </span>
            <span
              className={`font-display italic text-[10px] sm:text-[11px] uppercase tracking-[0.25em] ${
                isOverlay ? "text-brown-700" : "text-brown-500"
              }`}
            >
              Pet Atlas · Museum of Breeds
            </span>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
          <Link
            href="/pets"
            className="font-serif text-brown-700 hover:text-brown-900 transition-colors"
          >
            全部品种
          </Link>
          <Link
            href="/pets#categories"
            className="font-serif text-brown-700 hover:text-brown-900 transition-colors"
          >
            分类
          </Link>
          <Link
            href="/adopt"
            className="font-serif text-brown-700 hover:text-brown-900 transition-colors"
          >
            领养
          </Link>
          <Link
            href="/profile"
            className="font-serif text-brown-700 hover:text-brown-900 transition-colors"
          >
            我的
          </Link>
          <Link
            href="/about"
            className="font-serif text-brown-700 hover:text-brown-900 transition-colors"
          >
            关于
          </Link>
          <a
            href="https://github.com/mishishi/pet-atlas"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-brown-700 hover:text-brown-900 transition-colors"
          >
            GitHub
          </a>
        </nav>

        {/* 标本号 + Auth menu */}
        <div className="flex items-center gap-3">
          <span
            className={`font-display italic text-[10px] uppercase tracking-[0.25em] hidden sm:inline ${
              isOverlay ? "text-brown-700" : "text-brown-500"
            }`}
          >
            Specimen
          </span>
          <span className="font-mono text-sm font-medium text-brick tracking-wider">
            No. 051
          </span>
          <AuthMenu />
        </div>
      </Container>
    </header>
  );
}
