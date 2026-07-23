/**
 * web/components/auth/AuthMenu.tsx · 顶栏登录态菜单
 *
 * 显示在 Header 右上角:
 * - 未登录: "登录" 按钮
 * - 已登录: 用户名 chip + 下拉(登出)
 */

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getCurrentUser, logoutUser, notifyAuthChange, onAuthChange } from "@/lib/auth";

export function AuthMenu() {
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    return onAuthChange((u) => setUser(u));
  }, []);

  // 点外面关闭下拉
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login/"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-700 hover:text-brown-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-brown-50"
        >
          登录
        </Link>
        <Link
          href="/register/"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-oat-100 bg-brown-700 hover:bg-brown-800 transition-colors px-3 py-1.5 rounded-lg border border-brown-800"
        >
          注册
        </Link>
      </div>
    );
  }

  const initial = user.displayName.slice(0, 1).toUpperCase();
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-brown-50 transition-colors"
        aria-label="账号菜单"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-serif font-bold border-2"
          style={{ background: "#F5EFE0", borderColor: "#8B6F47", color: "#8B6F47" }}
        >
          {initial}
        </div>
        <span className="hidden sm:inline font-serif text-sm text-brown-800">
          {user.displayName}
        </span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-[var(--shadow-paper-md)] border-2 border-warm-brown/30 z-50 overflow-hidden"
          style={{ background: "rgba(245, 233, 208, 0.97)" }}
        >
          <div className="px-4 py-3 border-b border-brown-200/50">
            <div className="font-serif text-sm font-bold text-brown-900 truncate">
              {user.displayName}
            </div>
            <div className="font-mono text-[10px] text-brown-500 truncate">
              {user.email}
            </div>
          </div>
          <Link
            href="/profile/"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-brown-800 hover:bg-brown-50 transition-colors"
          >
            我的主页
          </Link>
          <Link
            href="/pets/"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-brown-800 hover:bg-brown-50 transition-colors"
          >
            浏览图鉴
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              logoutUser();
              notifyAuthChange();
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-brick hover:bg-brown-50 transition-colors border-t border-brown-200/50"
          >
            登出
          </button>
        </div>
      )}
    </div>
  );
}
