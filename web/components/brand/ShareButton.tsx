"use client";

/**
 * ShareButton · 分享当前页 (P2 polish, 2026-07-30)
 *
 * 平台兼容:
 * - 移动端 (iOS Safari / Android Chrome): navigator.share() 全屏分享面板
 * - 桌面 (Chrome / Firefox / Safari): navigator.share() (Chrome 89+/Safari 12.1+) 优先
 * - 兜底: 复制链接到剪贴板 + 短暂 toast 提示
 *
 * 分享内容:
 * - title: 品种名 + Tab 标识
 * - text: 一句卖点 + URL
 * - url: 当前页完整 URL
 *
 * 设计:
 * - 跟整体 vintage 美学一致 (brown border + cream bg)
 * - 大尺寸点击区, 移动友好
 * - 复制成功后短暂 flash "已复制" 提示
 */

import { useEffect, useState } from "react";

export interface ShareButtonProps {
  /** 分享的标题 (品种名 / Atlas 章节 / 主页 等) */
  title: string;
  /** 分享文案 (1-2 句) */
  text: string;
  /** 额外的类名 */
  className?: string;
  /** 按钮变体: 默认 / outline */
  variant?: "default" | "outline";
}

export function ShareButton({
  title,
  text,
  className = "",
  variant = "default",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleClick = async () => {
    if (typeof window === "undefined") return;
    const url = shareUrl || window.location.href;
    const fullText = `${text}\n${url}`;

    // 优先 Web Share API (mobile / Chrome 桌面)
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text, url });
        return; // 成功, 不再复制
      } catch (e) {
        // 用户取消 (AbortError) 或不支持 — 走兜底
        if ((e as DOMException)?.name === "AbortError") return;
      }
    }

    // 兜底: 复制 URL 到剪贴板
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 极旧浏览器 fallback: 用 textarea
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        // 静默失败
      }
      document.body.removeChild(ta);
    }
  };

  if (!mounted) {
    // SSR / 还未 mount: 渲染一个等大的占位按钮 (没 mount 时点击 no-op)
    // 不用 visibility: hidden 是为了 SSR 截图能拍到, 真实浏览器没差异
    return (
      <button
        type="button"
        aria-label="分享"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-warm-brown/60 text-warm-brown bg-transparent hover:bg-warm-brown/10 font-serif text-sm transition-all ${className}`}
        title="分享"
      >
        <ShareIcon />
        <span>分享</span>
      </button>
    );
  }

  const baseStyles =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full font-serif text-sm transition-all active:scale-95";
  const variantStyles =
    variant === "outline"
      ? "border border-warm-brown/60 text-warm-brown bg-transparent hover:bg-warm-brown/10"
      : "border-2 border-brown-700 text-brown-50 bg-brown-700 hover:bg-brown-800 hover:border-brown-800";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="分享当前页"
      title={copied ? "已复制" : "分享"}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {copied ? <CheckIcon /> : <ShareIcon />}
      <span>{copied ? "已复制" : "分享"}</span>
    </button>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
