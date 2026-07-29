"use client";

/**
 * NavLink · Header 当前页高亮 (P2 polish, 2026-07-29)
 *
 * 设计:
 *  - 复用 Header 的 primary nav 链接 (全部品种 / 分类 / 领养 / 我的 / 关于)
 *  - 用 usePathname 判断当前路由
 *  - 活跃页加 brick underline + bold 字体
 *  - 完全匹配 = 高亮, /pets 嵌套匹配 = 半高亮
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  // 完全匹配 / 前缀匹配 (忽略 hash/query)
  const isActive =
    pathname === href ||
    (href !== "/" && pathname?.startsWith(href + "/")) ||
    // 主页特殊: 主页路径 "/" 也算全部品种 active
    (href === "/pets" && pathname === "/");

  return (
    <Link
      href={href}
      className={`relative font-serif transition-colors ${
        isActive
          ? "text-brown-900 font-semibold"
          : "text-brown-700 hover:text-brown-900"
      } ${className}`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
      {isActive && (
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-brick"
          style={{ borderRadius: 1 }}
        />
      )}
    </Link>
  );
}
