"use client";

/**
 * EmptyState · 0 状态空状态组件 (Top3-3, 2026-07-28)
 *
 * 设计:
 *  - 跟 vintage museum 风格一致 (老纸 + 棕边 + 拉丁小标)
 *  - 大图形占位 + 行动召唤按钮
 *  - 可选 secondary 链接
 *
 * 用法:
 *   <EmptyState
 *     illustration="🤍"   // emoji 或 icon
 *     title="还没有收藏"
 *     subtitle="进图鉴点 ♡ 收藏喜欢的品种"
 *     primaryCta={{ label: "去逛品种 →", href: "/pets" }}
 *     secondaryCta={{ label: "了解收藏功能", href: "/about" }}
 *     variant="warm"  // "warm" | "minimal"
 *   />
 */

import Link from "next/link";

interface EmptyStateProps {
  /** 大图形 (emoji, 文字, 或 JSX) */
  illustration?: React.ReactNode;
  /** 主标题 (中文, 居中) */
  title: string;
  /** 副标题/描述 (可选) */
  subtitle?: string;
  /** 拉丁小标 (可选) */
  latin?: string;
  /** 主 CTA 按钮 */
  primaryCta?: {
    label: string;
    href: string;
  };
  /** 次要 CTA (可选) */
  secondaryCta?: {
    label: string;
    href: string;
  };
  /** 视觉变体 */
  variant?: "warm" | "minimal";
  /** 装饰用 */
  decoration?: React.ReactNode;
}

export function EmptyState({
  illustration,
  title,
  subtitle,
  latin,
  primaryCta,
  secondaryCta,
  variant = "warm",
  decoration,
}: EmptyStateProps) {
  return (
    <div
      className="empty-state"
      style={{
        background:
          variant === "warm"
            ? "linear-gradient(180deg, rgba(245, 233, 208, 0.6) 0%, rgba(239, 224, 190, 0.4) 100%)"
            : "rgba(245, 233, 208, 0.3)",
        border: "1px solid rgba(139, 111, 71, 0.2)",
        borderRadius: "var(--radius)",
        padding: "40px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {decoration}

      {/* 装饰上横线 + 拉丁小标 */}
      {latin && (
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-block h-px w-8 bg-brown-500 opacity-40" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-brown-500">
            {latin}
          </span>
          <span className="inline-block h-px w-8 bg-brown-500 opacity-40" />
        </div>
      )}

      {/* 大图形占位 */}
      {illustration && (
        <div
          className="empty-state-illustration"
          style={{
            fontSize: 56,
            lineHeight: 1.2,
            marginBottom: 12,
            opacity: 0.5,
            filter: variant === "minimal" ? "grayscale(0.4)" : undefined,
          }}
          aria-hidden
        >
          {illustration}
        </div>
      )}

      {/* 主标题 */}
      <h3
        className="font-serif font-bold text-brown-900"
        style={{
          fontSize: "20px",
          lineHeight: 1.3,
          marginBottom: 6,
        }}
      >
        {title}
      </h3>

      {/* 副标题 */}
      {subtitle && (
        <p
          className="text-brown-600 mx-auto"
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            maxWidth: 320,
            marginBottom: 20,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* CTA 按钮组 */}
      {(primaryCta || secondaryCta) && (
        <div
          className="empty-state-cta-group"
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {primaryCta && (
            <Link
              href={primaryCta.href}
              className="empty-state-cta-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                background: "var(--brown-700)",
                color: "var(--oat-100)",
                border: "1px solid var(--brown-900)",
                fontFamily: "var(--font-serif, serif)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textDecoration: "none",
                transition: "all 0.2s ease",
                minHeight: 44,
                boxShadow: "0 2px 0 var(--brown-900)",
              }}
            >
              {primaryCta.label}
            </Link>
          )}
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="empty-state-cta-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                background: "transparent",
                color: "var(--brown-700)",
                border: "1px solid var(--brown-500)",
                fontFamily: "var(--font-serif, serif)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.05em",
                textDecoration: "none",
                transition: "all 0.2s ease",
                minHeight: 44,
              }}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
