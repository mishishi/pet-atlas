/**
 * SpecimenFrame · 标本卡木框(可复用)
 *
 * 用在:
 *  - HeroPoster(主页 3 大画框)
 *  - PetDetailPage(详情页主封面)
 *  - PetCard(列表卡片)
 *
 * 视觉:
 *  - 外木框 (135° brown gradient)
 *  - 内木线(1px rgba highlight)
 *  - 内卡纸(cream,inset shadow)
 *  - 9:16 封面图
 *  - 卡片底部名称 (中文 + 英文 italic)
 *  - 可选:VINTAGE PAPER 飘带
 */
import Image from "next/image";
import { getCoverUrl } from "@/lib/pets";

export function SpecimenFrame({
  slug,
  nameZh,
  nameEn,
  rotate = 0,
  scale = 1,
  zIndex = 1,
  width = "clamp(180px, 24vw, 320px)",
  showRibbon = false,
  ribbonText = "Vintage Paper · 2026",
  priority = false,
  shadowLevel = "lg", // "sm" | "md" | "lg"
}: {
  slug: string;
  nameZh: string;
  nameEn: string;
  rotate?: number;
  scale?: number;
  zIndex?: number;
  width?: string;
  showRibbon?: boolean;
  ribbonText?: string;
  priority?: boolean;
  shadowLevel?: "sm" | "md" | "lg";
}) {
  const url = getCoverUrl(slug) || "";
  const shadowMap = {
    sm: "0 6px 16px -4px rgba(74, 51, 28, 0.35), 0 2px 6px -2px rgba(74, 51, 28, 0.25)",
    md: "0 12px 28px -8px rgba(74, 51, 28, 0.45), 0 4px 10px -4px rgba(74, 51, 28, 0.3)",
    lg: "0 18px 40px -12px rgba(74, 51, 28, 0.55), 0 6px 14px -6px rgba(74, 51, 28, 0.4)",
  };

  return (
    <div
      className="relative shrink-0 transition-transform duration-700"
      style={{
        transform: `rotate(${rotate}deg) scale(${scale})`,
        zIndex,
        width,
      }}
    >
      {/* 外木框 */}
      <div
        className="relative p-2 md:p-3"
        style={{
          background:
            "linear-gradient(135deg, #B8956A 0%, #8B6F47 50%, #6E5635 100%)",
          boxShadow: `${shadowMap[shadowLevel]}, inset 0 0 0 1px rgba(255, 240, 200, 0.15)`,
        }}
      >
        {/* 内木线 */}
        <div
          className="absolute inset-1 md:inset-2 pointer-events-none"
          style={{ border: "1px solid rgba(255, 240, 200, 0.25)" }}
        />

        {/* 内卡纸 */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "9 / 16",
            background: "linear-gradient(180deg, #F5E9D0 0%, #EFE0C0 100%)",
            boxShadow: "inset 0 0 30px rgba(139, 111, 71, 0.18)",
          }}
        >
          {/* 内卡纸纸张质感 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, rgba(139,111,71,0.12) 0%, transparent 40%), radial-gradient(circle at 70% 80%, rgba(139,111,71,0.1) 0%, transparent 35%)",
            }}
          />

          {/* 实际图 */}
          {url ? (
            <Image
              src={url}
              alt={nameZh}
              fill
              sizes="(max-width: 768px) 60vw, 30vw"
              className="object-cover"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-brown-400 text-sm">
              {nameZh}
            </div>
          )}

          {/* 卡片底部名称 */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-end justify-between"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(245, 233, 208, 0.6) 60%, rgba(245, 233, 208, 0.95) 100%)",
            }}
          >
            <div>
              <div className="font-serif text-sm md:text-base font-semibold text-brown-900">
                {nameZh}
              </div>
              <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-wider text-brown-600 italic">
                {nameEn}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VINTAGE PAPER 飘带 — 可选 */}
      {showRibbon && (
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-3 md:-bottom-4 pointer-events-none"
          style={{ zIndex: zIndex + 5 }}
        >
          <RibbonBanner text={ribbonText} />
        </div>
      )}
    </div>
  );
}

/* 飘带(两端凹口) */
function RibbonBanner({ text }: { text: string }) {
  return (
    <svg
      viewBox="0 0 220 32"
      className="w-32 md:w-44 lg:w-52 h-auto"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbon-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5E9D0" />
          <stop offset="100%" stopColor="#E8D9B8" />
        </linearGradient>
      </defs>
      <path
        d="M 14 4 L 206 4 L 198 16 L 206 28 L 14 28 L 22 16 Z"
        fill="url(#ribbon-fill)"
        stroke="#8B6F47"
        strokeWidth="0.8"
      />
      <text
        x="110"
        y="20"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="9"
        fontWeight="600"
        letterSpacing="0.15em"
        fill="#6E5635"
        style={{ textTransform: "uppercase" }}
      >
        {text}
      </text>
    </svg>
  );
}
