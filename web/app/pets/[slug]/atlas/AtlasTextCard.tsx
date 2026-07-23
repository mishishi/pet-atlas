/**
 * web/app/pets/[slug]/atlas/AtlasTextCard.tsx · Atlas 文字版 v0.5 (PoC)
 *
 * 替代 AI 图,改用纯 HTML 文字卡片(根除 AI 图字体/hex 污染问题)。
 *
 * 设计:
 * - 大画框(vintage museum specimen card 美学)
 * - 顶部:小 dot 指示 + 大标题 + 罗马数字
 * - 6 维性格条形图(HTML 进度条,中文标签 + 数字)
 * - 综合评分(大字)
 * - 性格标签(chip)
 * - 底部:页标 + 中文副标题
 *
 * 视觉:跟 SpecimenFrame 一致(oat + warm brown 调色)
 * 文件大小:~5KB(对比 AI 图 2-3MB)
 * 加载:instant(无图加载)
 * SEO:可被搜索引擎全文索引
 *
 * 适用范围:03-personality / 04-history / 06-famous(后续)
 */

import { LeafDivider } from "@/components/brand/BotanicalBorder";

interface AtlasTextCardProps {
  slug: string;
  nameZh: string;
  nameEn: string;
  slot: "03-personality" | "04-history" | "06-famous";
  pageNumber: number;
  totalPages: number;
  // 03-personality 数据
  personality?: {
    affection: number;
    activity: number;
    obedience: number;
    independence: number;
    vocalization: number;
    intelligence: number;
    summary?: string;
    tags?: string[];
  };
  // 04-history 数据(简化版,history timeline)
  history?: { year: string; event: string }[];
  // 06-famous 数据(支持 string[] 原始数据 + 结构化两种)
  famous?: { title: string; subtitle: string; description: string }[] | string[];
}

const SLOT_META: Record<string, { label: string; en: string; roman: string }> = {
  "03-personality": { label: "性格雷达", en: "Personality", roman: "III" },
  "04-history": { label: "历史时间线", en: "History", roman: "IV" },
  "06-famous": { label: "名场面", en: "Famous Moments", roman: "VI" },
};

const PERSONALITY_LABELS: { key: keyof NonNullable<AtlasTextCardProps["personality"]>; label: string }[] = [
  { key: "affection", label: "亲人度" },
  { key: "activity", label: "活跃度" },
  { key: "obedience", label: "服从度" },
  { key: "independence", label: "独立性" },
  { key: "vocalization", label: "吠叫度" },
  { key: "intelligence", label: "智商" },
];

export function AtlasTextCard(props: AtlasTextCardProps) {
  const meta = SLOT_META[props.slot];
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{
        background: "linear-gradient(180deg, #F5EFE0 0%, #EFE0BE 100%)",
        boxShadow: "var(--shadow-paper-lg)",
        aspectRatio: "9 / 16",
        maxWidth: "100%",
      }}
    >
      {/* 装饰角: 暖棕画框 */}
      <div className="absolute inset-3 sm:inset-4 border-2 border-warm-brown/40 rounded-lg pointer-events-none" />
      <div className="absolute inset-5 sm:in-6 border border-warm-brown/20 rounded-lg pointer-events-none" />

      {/* 顶部装饰水渍 */}
      <div
        className="absolute top-0 left-0 w-40 h-40 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(139, 111, 71, 0.18) 0%, transparent 70%)",
        }}
      />

      {/* 内容 */}
      <div className="relative h-full p-6 sm:p-8 md:p-10 flex flex-col">
        {/* 顶部: dot indicator + 罗马数字 */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-brick">
            {props.pageNumber} / {props.totalPages}
          </span>
          <span
            className="font-serif text-3xl sm:text-4xl font-bold text-warm-brown/60 leading-none"
            aria-hidden
          >
            {meta.roman}
          </span>
        </div>

        {/* 标题 */}
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brown-900 leading-tight mb-1">
          {meta.label}
        </h1>
        <p className="font-serif italic text-sm sm:text-base text-brown-500 mb-3">
          {meta.en} · {props.nameZh}
        </p>

        <div className="mb-4">
          <LeafDivider className="w-32 sm:w-40 h-auto opacity-60" />
        </div>

        {/* 主体内容: 根据 slot 类型 */}
        <div className="flex-1 overflow-y-auto">
          {props.slot === "03-personality" && props.personality && (
            <PersonalityContent personality={props.personality} />
          )}
          {props.slot === "04-history" && props.history && (
            <HistoryContent history={props.history} />
          )}
          {props.slot === "06-famous" && props.famous && (
            <FamousContent famous={props.famous} />
          )}
        </div>

        {/* 底部:页标 + breed 副标题 */}
        <div className="mt-4 pt-3 border-t border-warm-brown/15 flex items-center justify-between">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-brown-500">
              Plate {String(props.pageNumber).padStart(2, "0")} /{" "}
              {String(props.totalPages).padStart(2, "0")}
            </div>
            <div className="font-serif text-xs text-brown-700 truncate">
              {props.nameEn}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-brown-500">
              Pet Atlas · v1.0
            </div>
            <div className="font-mono text-[10px] text-brick font-bold">v0.5 文字版</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalityContent({ personality }: { personality: NonNullable<AtlasTextCardProps["personality"]> }) {
  // 综合评分 = 6 维平均
  const scores = [
    personality.affection,
    personality.activity,
    personality.obedience,
    personality.independence,
    personality.vocalization,
    personality.intelligence,
  ];
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return (
    <div className="space-y-4">
      {/* 综合评分大数字 */}
      <div className="text-center py-3 px-4 rounded-lg bg-oat-50/60 border border-warm-brown/15">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500 mb-1">
          综合评分
        </div>
        <div className="flex items-baseline justify-center gap-1">
          <span className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 leading-none">
            {avg.toFixed(1)}
          </span>
          <span className="font-serif text-base text-brown-500">/ 10</span>
        </div>
        {personality.summary && (
          <p className="mt-1 font-serif italic text-sm text-warm-brown">
            {personality.summary}
          </p>
        )}
      </div>

      {/* 6 维条形图 */}
      <div className="space-y-2">
        {PERSONALITY_LABELS.map(({ key, label }) => {
          const v = personality[key] as number;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-14 sm:w-16 font-serif text-sm text-brown-800 shrink-0">
                {label}
              </span>
              <div className="flex-1 h-5 bg-oat-200/70 rounded-full overflow-hidden border border-warm-brown/15">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${v * 10}%`,
                    background:
                      "linear-gradient(90deg, #C9A876 0%, #8B6F47 100%)",
                  }}
                />
              </div>
              <span className="w-8 text-right font-mono text-sm text-brown-900 font-bold">
                {v}
              </span>
            </div>
          );
        })}
      </div>

      {/* 性格标签 */}
      {personality.tags && personality.tags.length > 0 && (
        <div className="pt-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500 mb-1.5">
            性格标签
          </div>
          <div className="flex flex-wrap gap-1.5">
            {personality.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full font-serif text-xs text-brown-800 border border-warm-brown/30"
                style={{ background: "rgba(245, 233, 208, 0.7)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryContent({ history }: { history: { year: string; event: string }[] }) {
  return (
    <ol className="space-y-3 relative pl-6">
      {/* 时间线竖线 */}
      <div
        className="absolute left-2 top-0 bottom-0 w-px"
        style={{ background: "linear-gradient(180deg, #8B6F47 0%, transparent 100%)" }}
        aria-hidden
      />
      {history.map((node, i) => (
        <li key={i} className="relative">
          <span
            className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-warm-brown bg-oat-50"
            aria-hidden
          />
          <div className="font-mono text-xs text-brick font-bold tracking-wider">
            {node.year}
          </div>
          <p className="font-serif text-sm text-brown-800 leading-relaxed mt-0.5">
            {node.event}
          </p>
        </li>
      ))}
    </ol>
  );
}

function FamousContent({ famous }: { famous: { title: string; subtitle: string; description: string }[] | string[] }) {
  // 适配 string[]:每个 string 当 title,subtitle 用统一标签
  const items = famous.map((m) =>
    typeof m === "string"
      ? { title: m, subtitle: "名场面", description: "" }
      : m
  );
  return (
    <div className="space-y-3">
      {items.map((m, i) => (
        <div
          key={i}
          className="rounded-lg p-3 border border-warm-brown/20"
          style={{ background: "rgba(245, 233, 208, 0.5)" }}
        >
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-serif text-base font-bold text-brown-900">{m.title}</span>
            {m.subtitle && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-brick">
                {m.subtitle}
              </span>
            )}
          </div>
          {m.description && (
            <p className="font-serif text-sm text-brown-700 leading-relaxed">
              {m.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
