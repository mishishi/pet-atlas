/**
 * Header · 顶部 sticky 导航
 *
 * variant:
 *  - "default"  默认 cream 半透明背景(详情页等)
 *  - "overlay"  透明(用于主页 hero 上叠加)
 */
import Link from "next/link";
import { Container } from "../ui/Container";

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
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-baseline gap-3 transition-opacity hover:opacity-80"
        >
          <span className="font-serif font-bold text-2xl tracking-tight text-brown-900">
            宠物大百科
          </span>
          <span
            className={`hidden sm:inline-block font-mono text-xs uppercase tracking-[0.2em] ${
              isOverlay ? "text-brown-700" : "text-brown-500"
            }`}
          >
            Pet Atlas
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            href="/pets"
            className="text-brown-700 hover:text-brown-900 transition-colors"
          >
            全部品种
          </Link>
          <Link
            href="/pets#categories"
            className="text-brown-700 hover:text-brown-900 transition-colors"
          >
            分类
          </Link>
          <Link
            href="/about"
            className="text-brown-700 hover:text-brown-900 transition-colors"
          >
            关于
          </Link>
          <a
            href="https://github.com/mishishi/pet-atlas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brown-700 hover:text-brown-900 transition-colors"
          >
            GitHub
          </a>
        </nav>

        {/* Specimen number */}
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.2em] hidden sm:inline ${
              isOverlay ? "text-brown-700" : "text-brown-500"
            }`}
          >
            Specimen
          </span>
          <span className="font-mono text-sm font-medium text-brick tracking-wider">
            No. 051
          </span>
        </div>
      </Container>
    </header>
  );
}
