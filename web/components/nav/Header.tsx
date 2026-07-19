/**
 * Header · 顶部 sticky 导航
 */
import Link from "next/link";
import { Container } from "../ui/Container";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-oat-200/85 backdrop-blur-md border-b border-brown-200/60">
      <Container size="xl" className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-baseline gap-3 transition-opacity hover:opacity-80"
        >
          <span className="font-serif font-bold text-2xl text-brown-900 tracking-tight">
            宠物大百科
          </span>
          <span className="hidden sm:inline-block font-mono text-xs text-brown-500 uppercase tracking-[0.2em]">
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
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500 hidden sm:inline">
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
