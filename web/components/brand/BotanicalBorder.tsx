/**
 * BotanicalBorder · 侧边植物图鉴(SVG)
 *
 * 参考参考图(标本卡海报)的侧边装饰:
 *  - 桉树枝 (eucalyptus): 圆形/弯月形叶片对生,sage green 水彩
 *  - 干花 (dried flowers): 分叉茎 + 圆形种荚,brown/beige
 *  - 薰衣草 (lavender): 竖直茎 + 顶部小紫花
 *  - 多肉 (succulent): 莲座状,sage green
 *  - 稻穗/谷物 (grain): 顶部弯折的芒,warm brown
 *
 * 风格:低透明度 + 软笔触,水彩感(用 SVG filter blur 模拟晕染)
 * 全部 inline,不依赖外部图
 */

// 主色板(取自 globals.css)
const SAGE = "#A8C5A0";
const SAGE_DEEP = "#7B9D78";
const BROWN = "#8B6F47";
const BROWN_LIGHT = "#B8956A";
const LAVENDER = "#B8A5C0";
const LAVENDER_DEEP = "#9C85A6";
const DRIED = "#B8956A";
const DRIED_LIGHT = "#D4B584";
const DRIED_DARK = "#8B6F47";

/* ------------------------------------------------------------------ */
/* 单个植物单元                                                         */
/* ------------------------------------------------------------------ */

/** 桉树枝 (eucalyptus): 主茎 + 多组对生小叶 */
function EucalyptusBranch({
  className = "",
  rotate = 0,
  flip = false,
  scale = 1,
}: {
  className?: string;
  rotate?: number;
  flip?: boolean;
  scale?: number;
}) {
  return (
    <svg
      viewBox="0 0 120 320"
      className={className}
      style={{
        transform: `rotate(${rotate}deg) scaleX(${flip ? -1 : 1} * ${scale})`,
        transformOrigin: "top center",
      }}
      aria-hidden="true"
    >
      {/* 主茎 */}
      <path
        d="M 60 0 C 58 60, 62 140, 60 220 S 56 300, 60 320"
        stroke={BROWN}
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
      {/* 侧茎 */}
      <path
        d="M 60 30 C 40 40, 25 55, 15 70 M 60 30 C 80 40, 95 55, 105 70"
        stroke={BROWN}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 60 90 C 38 100, 22 115, 10 135 M 60 90 C 82 100, 98 115, 110 135"
        stroke={BROWN}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 60 150 C 35 160, 18 180, 8 200 M 60 150 C 85 160, 102 180, 112 200"
        stroke={BROWN}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 60 215 C 40 225, 25 245, 18 265 M 60 215 C 80 225, 95 245, 102 265"
        stroke={BROWN}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />

      {/* 叶片 - 用椭圆近似桉树叶 */}
      {[
        { cx: 12, cy: 68, rx: 14, ry: 8, rot: -50 },
        { cx: 108, cy: 68, rx: 14, ry: 8, rot: 50 },
        { cx: 7, cy: 132, rx: 16, ry: 9, rot: -45 },
        { cx: 113, cy: 132, rx: 16, ry: 9, rot: 45 },
        { cx: 5, cy: 198, rx: 15, ry: 9, rot: -40 },
        { cx: 115, cy: 198, rx: 15, ry: 9, rot: 40 },
        { cx: 15, cy: 262, rx: 13, ry: 7, rot: -35 },
        { cx: 105, cy: 262, rx: 13, ry: 7, rot: 35 },
        { cx: 60, cy: 5, rx: 9, ry: 5, rot: 0 },
        { cx: 60, cy: 318, rx: 8, ry: 4, rot: 0 },
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.rx}
          ry={leaf.ry}
          transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
          fill={SAGE}
          opacity="0.55"
          filter="url(#watercolor)"
        />
      ))}

      {/* 水彩晕染 filter */}
      <defs>
        <filter id="watercolor" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>
    </svg>
  );
}

/** 干花 (dried flowers with seed pods) */
function DriedFlowerStem({
  className = "",
  rotate = 0,
  scale = 1,
}: {
  className?: string;
  rotate?: number;
  scale?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 280"
      className={className}
      style={{
        transform: `rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "center",
      }}
      aria-hidden="true"
    >
      {/* 主茎 */}
      <path
        d="M 50 280 C 48 220, 52 160, 50 100 S 46 40, 50 0"
        stroke={DRIED_DARK}
        strokeWidth="1"
        fill="none"
        opacity="0.65"
      />
      {/* 侧茎 */}
      <path
        d="M 50 240 C 30 230, 18 215, 12 200 M 50 240 C 70 230, 82 215, 88 200"
        stroke={DRIED_DARK}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 50 170 C 28 160, 15 145, 8 130 M 50 170 C 72 160, 85 145, 92 130"
        stroke={DRIED_DARK}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 50 100 C 32 90, 20 78, 15 65 M 50 100 C 68 90, 80 78, 85 65"
        stroke={DRIED_DARK}
        strokeWidth="0.7"
        fill="none"
        opacity="0.55"
      />

      {/* 圆形种荚(seed pods) */}
      {[
        { cx: 12, cy: 200, r: 8 },
        { cx: 88, cy: 200, r: 8 },
        { cx: 8, cy: 130, r: 7 },
        { cx: 92, cy: 130, r: 7 },
        { cx: 15, cy: 65, r: 6 },
        { cx: 85, cy: 65, r: 6 },
        { cx: 50, cy: 5, r: 5 },
      ].map((pod, i) => (
        <g key={i}>
          <ellipse
            cx={pod.cx}
            cy={pod.cy}
            rx={pod.r}
            ry={pod.r * 0.7}
            fill={DRIED_LIGHT}
            opacity="0.7"
          />
          <ellipse
            cx={pod.cx - pod.r * 0.2}
            cy={pod.cy - pod.r * 0.2}
            rx={pod.r * 0.5}
            ry={pod.r * 0.35}
            fill={DRIED}
            opacity="0.5"
          />
        </g>
      ))}

      {/* 小叶子 */}
      {[
        { x: 30, y: 220 },
        { x: 70, y: 215 },
        { x: 28, y: 155 },
        { x: 72, y: 150 },
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.x}
          cy={leaf.y}
          rx="6"
          ry="3"
          transform={`rotate(${i % 2 ? 30 : -30} ${leaf.x} ${leaf.y})`}
          fill={DRIED}
          opacity="0.5"
        />
      ))}
    </svg>
  );
}

/** 薰衣草 (lavender) */
function LavenderStem({
  className = "",
  rotate = 0,
  scale = 1,
}: {
  className?: string;
  rotate?: number;
  scale?: number;
}) {
  return (
    <svg
      viewBox="0 0 60 240"
      className={className}
      style={{
        transform: `rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "bottom center",
      }}
      aria-hidden="true"
    >
      <path
        d="M 30 240 C 28 200, 32 160, 30 120 S 28 60, 30 0"
        stroke={BROWN}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      {/* 顶部花穗 - 一串小点表示 */}
      {Array.from({ length: 14 }).map((_, i) => (
        <ellipse
          key={i}
          cx={30 + (i % 2 ? 2 : -2)}
          cy={6 + i * 6}
          rx="4"
          ry="3"
          fill={LAVENDER}
          opacity={0.45 + (i % 3) * 0.1}
        />
      ))}
      {/* 花穗底部最深 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <ellipse
          key={`d-${i}`}
          cx={30 + (i % 2 ? -1.5 : 1.5)}
          cy={4 + i * 5}
          rx="3"
          ry="2.5"
          fill={LAVENDER_DEEP}
          opacity="0.7"
        />
      ))}
      {/* 茎上小叶 */}
      {[60, 100, 140, 180].map((y, i) => (
        <g key={i}>
          <ellipse
            cx={20}
            cy={y}
            rx="8"
            ry="2.5"
            transform={`rotate(-30 20 ${y})`}
            fill={SAGE}
            opacity="0.55"
          />
          <ellipse
            cx={40}
            cy={y + 5}
            rx="8"
            ry="2.5"
            transform={`rotate(30 40 ${y + 5})`}
            fill={SAGE}
            opacity="0.55"
          />
        </g>
      ))}
    </svg>
  );
}

/** 多肉 (succulent rosette) */
function Succulent({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {/* 外层叶 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const r2 = 22;
        return (
          <ellipse
            key={`o-${i}`}
            cx={50 + Math.cos(angle) * r2}
            cy={50 + Math.sin(angle) * r2}
            rx="14"
            ry="6"
            transform={`rotate(${i * 30 + 90} ${50 + Math.cos(angle) * r2} ${
              50 + Math.sin(angle) * r2
            })`}
            fill={SAGE}
            opacity="0.7"
          />
        );
      })}
      {/* 中层叶 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 + 22) * (Math.PI / 180);
        const r = 14;
        return (
          <ellipse
            key={`m-${i}`}
            cx={50 + Math.cos(angle) * r}
            cy={50 + Math.sin(angle) * r}
            rx="10"
            ry="4.5"
            transform={`rotate(${i * 45 + 22 + 90} ${50 + Math.cos(angle) * r} ${
              50 + Math.sin(angle) * r
            })`}
            fill={SAGE_DEEP}
            opacity="0.75"
          />
        );
      })}
      {/* 中心 */}
      <circle cx="50" cy="50" r="4" fill={SAGE_DEEP} opacity="0.85" />
    </svg>
  );
}

/** 稻穗/谷物 (grain head) */
function GrainHead({
  className = "",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <svg
      viewBox="0 0 80 200"
      className={className}
      style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "center" }}
      aria-hidden="true"
    >
      <path
        d="M 40 200 C 38 160, 42 120, 40 80 S 38 30, 40 0"
        stroke={BROWN_LIGHT}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      {/* 弯折的芒 - 左右交错 */}
      {Array.from({ length: 10 }).map((_, i) => {
        const cy = 8 + i * 7;
        return (
          <g key={i}>
            <line
              x1={40}
              y1={cy}
              x2={28}
              y2={cy - 4}
              stroke={DRIED_DARK}
              strokeWidth="0.6"
              opacity="0.7"
            />
            <line
              x1={40}
              y1={cy}
              x2={52}
              y2={cy - 4}
              stroke={DRIED_DARK}
              strokeWidth="0.6"
              opacity="0.7"
            />
            <ellipse
              cx={28}
              cy={cy - 4}
              rx="2.5"
              ry="1.2"
              fill={DRIED_LIGHT}
              opacity="0.7"
            />
            <ellipse
              cx={52}
              cy={cy - 4}
              rx="2.5"
              ry="1.2"
              fill={DRIED_LIGHT}
              opacity="0.7"
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4 个角的组合                                                         */
/* ------------------------------------------------------------------ */

export function BotanicalBorder() {
  return (
    <>
      {/* 左上:大桉树 + 一小束干花 */}
      <div
        className="absolute -left-4 -top-2 w-28 md:w-40 lg:w-48 pointer-events-none z-10"
        aria-hidden="true"
      >
        <EucalyptusBranch className="w-full h-auto" rotate={8} />
        <div className="absolute left-2 top-1/2 w-20 md:w-28 opacity-90">
          <DriedFlowerStem className="w-full h-auto" rotate={-15} scale={0.7} />
        </div>
      </div>

      {/* 右上:桉树镜像 */}
      <div
        className="absolute -right-4 -top-2 w-28 md:w-40 lg:w-48 pointer-events-none z-10"
        aria-hidden="true"
      >
        <EucalyptusBranch className="w-full h-auto" rotate={-8} flip />
        <div className="absolute right-2 top-1/3 w-20 md:w-28 opacity-90">
          <DriedFlowerStem className="w-full h-auto" rotate={15} scale={0.7} />
        </div>
      </div>

      {/* 左下:干花 + 多肉 */}
      <div
        className="absolute -left-4 bottom-4 w-24 md:w-36 lg:w-44 pointer-events-none z-10"
        aria-hidden="true"
      >
        <DriedFlowerStem className="w-full h-auto" rotate={6} scale={0.95} />
        <div className="absolute right-0 -top-2 w-16 md:w-20 lg:w-24">
          <Succulent className="w-full h-auto" />
        </div>
      </div>

      {/* 右下:薰衣草 + 谷穗 + 多肉 */}
      <div
        className="absolute -right-4 bottom-4 w-24 md:w-36 lg:w-44 pointer-events-none z-10"
        aria-hidden="true"
      >
        <div className="absolute left-2 top-0 w-16 md:w-20 lg:w-24">
          <LavenderStem className="w-full h-auto" rotate={5} />
        </div>
        <div className="absolute right-2 bottom-2 w-14 md:w-16 lg:w-20">
          <GrainHead className="w-full h-auto" rotate={-8} />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 w-14 md:w-18 lg:w-20">
          <Succulent className="w-full h-auto" />
        </div>
      </div>

      {/* 左侧中部:小一束干花 */}
      <div
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-14 md:w-20 lg:w-24 pointer-events-none z-10 hidden md:block"
        aria-hidden="true"
      >
        <DriedFlowerStem className="w-full h-auto" rotate={-8} scale={0.8} />
      </div>

      {/* 右侧中部:小一束薰衣草 */}
      <div
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-14 md:w-20 lg:w-24 pointer-events-none z-10 hidden md:block"
        aria-hidden="true"
      >
        <LavenderStem className="w-full h-auto" rotate={8} scale={0.85} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 标题下的叶片装饰(代替原"装饰线")                                     */
/* ------------------------------------------------------------------ */

export function LeafDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 40"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* 中央花朵 */}
      <g transform="translate(160 20)">
        {/* 5 瓣花 */}
        {[0, 72, 144, 216, 288].map((rot) => (
          <ellipse
            key={rot}
            cx="0"
            cy="-9"
            rx="5"
            ry="9"
            transform={`rotate(${rot})`}
            fill={BROWN}
            opacity="0.75"
          />
        ))}
        <circle cx="0" cy="0" r="3" fill={BROWN_LIGHT} opacity="0.9" />
      </g>

      {/* 左侧延伸:叶片 + 小花 */}
      <g>
        <path
          d="M 30 22 C 70 18, 100 22, 140 20"
          stroke={BROWN}
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
        />
        <ellipse cx="50" cy="16" rx="6" ry="3" transform="rotate(-20 50 16)" fill={SAGE} opacity="0.7" />
        <ellipse cx="80" cy="22" rx="6" ry="3" transform="rotate(15 80 22)" fill={SAGE} opacity="0.7" />
        <ellipse cx="110" cy="16" rx="6" ry="3" transform="rotate(-20 110 16)" fill={SAGE} opacity="0.7" />
        <ellipse cx="130" cy="22" rx="5" ry="2.5" transform="rotate(15 130 22)" fill={SAGE} opacity="0.7" />
        <circle cx="30" cy="22" r="3" fill={BROWN} opacity="0.6" />
        <circle cx="140" cy="20" r="2" fill={BROWN} opacity="0.6" />
      </g>

      {/* 右侧延伸:镜像 */}
      <g>
        <path
          d="M 290 22 C 250 18, 220 22, 180 20"
          stroke={BROWN}
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
        />
        <ellipse cx="270" cy="16" rx="6" ry="3" transform="rotate(20 270 16)" fill={SAGE} opacity="0.7" />
        <ellipse cx="240" cy="22" rx="6" ry="3" transform="rotate(-15 240 22)" fill={SAGE} opacity="0.7" />
        <ellipse cx="210" cy="16" rx="6" ry="3" transform="rotate(20 210 16)" fill={SAGE} opacity="0.7" />
        <ellipse cx="190" cy="22" rx="5" ry="2.5" transform="rotate(-15 190 22)" fill={SAGE} opacity="0.7" />
        <circle cx="290" cy="22" r="3" fill={BROWN} opacity="0.6" />
        <circle cx="180" cy="20" r="2" fill={BROWN} opacity="0.6" />
      </g>
    </svg>
  );
}
