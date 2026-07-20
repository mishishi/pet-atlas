/**
 * Footer · 主页 + 列表页 footer
 */
import Link from "next/link";
import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-brown-200/60 bg-oat-200">
      <Container size="xl" className="py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* 左侧:logo + 副标 */}
          <div>
            <div className="font-serif text-2xl font-bold text-brown-900 tracking-tight">
              宠物大百科
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-brown-500 mt-1">
              Pet Atlas · Vintage Paper 2026
            </div>
          </div>

          {/* 右侧:links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/pets"
              className="text-brown-700 hover:text-brown-900 transition-colors"
            >
              全部品种
            </Link>
            <Link
              href="/adopt"
              className="text-brown-700 hover:text-brown-900 transition-colors"
            >
              领养云宠物
            </Link>
            <Link
              href="/profile"
              className="text-brown-700 hover:text-brown-900 transition-colors"
            >
              我的宠物
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
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500">
              No. 051 · Vintage
            </span>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-brown-200/40 flex flex-col sm:flex-row justify-between gap-2 text-xs text-brown-500">
          <span>© 2026 宠物大百科 · 由 Mavis & Jason 共同制作</span>
          <span className="font-mono">CC BY-NC-SA 4.0</span>
        </div>
      </Container>
    </footer>
  );
}
