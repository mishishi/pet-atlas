/**
 * web/components/brand/DropCapParagraph.tsx · v0.8 排版
 *
 * 第一个字符放大做 drop cap (vintage 书本风格)。
 * - 首字符 5-6 倍字号
 * - float: left 文字环绕
 * - 衬线字体加深色
 * - 适合 personality.summary / 描述性段落
 */

interface DropCapParagraphProps {
  text: string;
  className?: string;
}

export function DropCapParagraph({ text, className = "" }: DropCapParagraphProps) {
  if (!text) return null;
  const first = text.charAt(0);
  const rest = text.slice(1);

  return (
    <p
      className={`drop-cap-paragraph ${className}`}
      style={{
        fontSize: "16px",
        color: "var(--brown-800)",
        lineHeight: 1.7,
      }}
    >
      <span
        className="drop-cap"
        style={{
          float: "left",
          fontFamily: '"IM Fell English", Georgia, serif',
          fontSize: "78px",
          lineHeight: 0.85,
          padding: "8px 12px 0 0",
          color: "var(--brown-700)",
          fontWeight: 600,
        }}
        aria-hidden="false"
      >
        {first}
      </span>
      {rest}
    </p>
  );
}
