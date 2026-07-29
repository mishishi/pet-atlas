/**
 * Header · 顶部 sticky 导航 (v1.2 vintage 重设计)
 *
 * 加 vintage 标本卡元素:
 *  - 圆形品牌印章 (含 "PET ATLAS · 1876" 复古风)
 *  - 拉丁/英文 logo 用 IM Fell English (18 世纪印刷机)
 *  - 标本号 N° 数字用 Special Elite 打字机
 *
 * v0.9 polish: 加 HeaderSearch 全局搜索(150 个品种全可搜)
 *  - ⌘K 打开 / ESC 关闭
 *
 * Top3-2: 加 HeaderMobileMenu 汉堡包 (md 以下抽屉式菜单)
 *  - 桌机不动,移动端把 5 nav + 5 category 全塞进 drawer
 *  - SPECIMEN 装饰在 mobile 隐藏
 *
 * 注意:searchPets 从外部传入(由 root layout / page 准备好)
 *       Header 自己不拉 pets.ts,避免 client component 链路把 fs 拉进 client bundle
 *
 * variant:
 *  - "default"  默认 cream 半透明背景
 *  - "overlay"  透明(用于主页 hero 上叠加)
 */
import Link from "next/link";
import { Container } from "../ui/Container";
import { AuthMenu } from "../auth/AuthMenu";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { NavLink } from "./NavLink";
import type { SearchPet } from "@/lib/search-pets";

/** Top3-2: 5 个主导航 (HeaderMobileMenu 复用) */
const PRIMARY_NAV = [
  { href: "/pets", label: "全部品种" },
  { href: "/pets?category=dog", label: "分类" },
  { href: "/adopt", label: "领养" },
  { href: "/profile", label: "我的" },
  { href: "/about", label: "关于" },
] as const;

/** Top3-2: 5 个 category 快捷入口 (drawer 内) */
const CATEGORY_NAV = [
  { href: "/pets?category=dog", label: "犬", latin: "Canis" },
  { href: "/pets?category=cat", label: "猫", latin: "Felis" },
  { href: "/pets?category=small-mammal", label: "小型哺乳", latin: "Mammalia" },
  { href: "/pets?category=bird", label: "鸟", latin: "Aves" },
  { href: "/pets?category=reptile", label: "爬虫", latin: "Reptilia" },
] as const;

export function Header({
  variant = "default",
  searchPets = [],
}: {
  variant?: "default" | "overlay";
  searchPets?: SearchPet[];
}) {
  const isOverlay = variant === "overlay";
  const allPets = searchPets;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        isOverlay
          ? "bg-transparent border-transparent"
          : "bg-oat-200/85 backdrop-blur-md border-brown-200/60"
      }`}
    >
      <Container size="xl" className="flex items-center justify-between gap-2 h-16">
        {/* Logo + vintage 印章 */}
        <Link
          href="/"
          className="group flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-80 min-w-0"
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
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-serif font-bold text-base sm:text-2xl tracking-tight text-brown-900 truncate">
              宠物大百科
            </span>
            <span
              className={`font-display italic text-[9px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] truncate ${
                isOverlay ? "text-brown-700" : "text-brown-500"
              }`}
            >
              Pet Atlas · Museum of Breeds
            </span>
          </div>
        </Link>

        {/* Center nav (desktop only) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          <a
            href="https://github.com/mishishi/pet-atlas"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-brown-700 hover:text-brown-900 transition-colors"
          >
            GitHub
          </a>
          {/* v0.9 polish: 全局搜索 (desktop) */}
          <HeaderSearch pets={allPets} />
        </nav>

        {/* 右侧:移动端 [search + hamburger] / 桌机 [SPECIMEN + auth + 全 nav] */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* v0.9 polish: 移动端搜索 (sm 以下) */}
          <div className="md:hidden">
            <HeaderSearch pets={allPets} />
          </div>
          {/* 桌机装饰:标本号 */}
          <div className="hidden md:flex items-center gap-2">
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
          </div>
          {/* 桌机 auth menu */}
          <div className="hidden md:block">
            <AuthMenu />
          </div>
          {/* Top3-2: 移动端汉堡包菜单 (drawer 包含 auth + 5 nav + 5 category) */}
          <HeaderMobileMenu
            primaryNav={PRIMARY_NAV as unknown as { href: string; label: string }[]}
            categoryNav={CATEGORY_NAV as unknown as { href: string; label: string; latin: string }[]}
          />
        </div>
      </Container>
    </header>
  );
}
