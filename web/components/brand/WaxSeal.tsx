/**
 * web/components/brand/WaxSeal.tsx · v0.8 蜡封印章
 *
 * 给详情页 breed 名旁的圆形蜡封,按 category 选不同 icon + color,
 * 加 ink-bleed 滤镜 + 随机微旋(基于 slug 算稳定角度),像手盖的印章。
 *
 * 每个品种一个独特"印记",跟现有 Tabula Prima 印章 + N° 编号 构成完整体系。
 */

import type { PetCategory } from "@/lib/types";

interface WaxSealProps {
  category: PetCategory;
  slug: string;
  size?: number;       // 默认 64
  className?: string;
}

interface SealConfig {
  color: string;       // background
  fg: string;          // icon / text color
  latin: string;       // 底部 Latin 词
  iconKey: "paw" | "feather" | "scales" | "tooth";
}

const SEAL_MAP: Record<PetCategory, SealConfig> = {
  dog: { color: "#A44A3F", fg: "#F5E9D0", latin: "CANIS", iconKey: "paw" },
  cat: { color: "#523E24", fg: "#F5EFE0", latin: "FELIS", iconKey: "paw" },
  "small-mammal": { color: "#A07A48", fg: "#FCFAF4", latin: "MICRO", iconKey: "tooth" },
  bird: { color: "#A8C5A0", fg: "#2A2520", latin: "AVES", iconKey: "feather" },
  reptile: { color: "#6E5635", fg: "#F5EFE0", latin: "REPTILIA", iconKey: "scales" },
};

/** 稳定 hash 算 -5° ~ +5° 倾斜,确保同一个 breed 永远同一个角度 */
function stableRotation(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  // -5° ~ +5° 之间
  return ((Math.abs(h) % 11) - 5);
}

/** 不同 category 的 icon SVG (viewBox 0 0 100 100,围绕中心 50,50) */
function SealIcon({ kind, fg }: { kind: SealConfig["iconKey"]; fg: string }) {
  switch (kind) {
    case "paw":
      return (
        <g fill={fg} opacity="0.95">
          <ellipse cx="50" cy="58" rx="11" ry="9" />
          <ellipse cx="36" cy="42" rx="5" ry="6" />
          <ellipse cx="64" cy="42" rx="5" ry="6" />
          <ellipse cx="28" cy="54" rx="4.5" ry="5.5" />
          <ellipse cx="72" cy="54" rx="4.5" ry="5.5" />
        </g>
      );
    case "feather":
      return (
        <g fill={fg} opacity="0.88" transform="rotate(-15 50 50)">
          <path d="M50 28 Q56 38 56 50 Q56 62 50 72 Q44 62 44 50 Q44 38 50 28 Z" />
          <line x1="50" y1="32" x2="50" y2="70" stroke="#FCFAF4" strokeWidth="0.6" opacity="0.4" />
        </g>
      );
    case "scales":
      return (
        <g fill={fg} opacity="0.9">
          <polygon points="42,40 48,40 51,44 48,48 42,48 39,44" />
          <polygon points="52,40 58,40 61,44 58,48 52,48 49,44" />
          <polygon points="47,48 53,48 56,52 53,56 47,56 44,52" />
          <polygon points="42,56 48,56 51,60 48,64 42,64 39,60" />
          <polygon points="52,56 58,56 61,60 58,64 52,64 49,60" />
        </g>
      );
    case "tooth":
      return (
        <g fill={fg} opacity="0.95">
          <path d="M44 38 L48 38 L49 50 Q48 56 46 56 Q44 56 43 50 Z" />
          <path d="M52 38 L56 38 L57 50 Q56 56 54 56 Q52 56 51 50 Z" />
          <path d="M48 60 L52 60 L51 66 Q50 68 50 68 Q50 68 49 66 Z" />
        </g>
      );
  }
}

export function WaxSeal({ category, slug, size = 64, className = "" }: WaxSealProps) {
  const config = SEAL_MAP[category];
  const rotation = stableRotation(slug);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{
        transform: `rotate(${rotation}deg)`,
        filter: "url(#wax-ink-bleed)",
      }}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" fill={config.color} />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke={config.fg}
        strokeWidth="0.8"
        strokeDasharray="2,1.5"
        opacity="0.7"
      />
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke={config.fg}
        strokeWidth="1"
        opacity="0.5"
      />
      <SealIcon kind={config.iconKey} fg={config.fg} />
      <text
        x="50"
        y="86"
        textAnchor="middle"
        fontFamily="IM Fell English, serif"
        fontSize="6"
        fill={config.fg}
        opacity="0.7"
        letterSpacing="0.2em"
      >
        {config.latin}
      </text>
    </svg>
  );
}

/** 全局 SVG filter,需要在 layout 或 inline 引用 */
export const WaxSealFilter = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <filter id="wax-ink-bleed">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.92 0"
        />
      </filter>
    </defs>
  </svg>
);
