/**
 * web/components/brand/PullQuote.tsx · v0.8 排版
 *
 * Pull quote (大号斜体居中引文) + 装饰横线 + 引号 + 拉丁 source。
 * 适合插在文中作为视觉停顿。
 */

interface PullQuoteProps {
  text: string;
  source?: string;     // e.g. "性格速写 · Personal Notae"
  className?: string;
}

export function PullQuote({ text, source, className = "" }: PullQuoteProps) {
  return (
    <blockquote
      className={`pull-quote ${className}`}
      style={{
        textAlign: "center",
        margin: "32px 0",
        padding: "24px 16px",
        position: "relative",
      }}
    >
      <span
        className="quote-mark"
        style={{
          fontFamily: '"IM Fell English", Georgia, serif',
          fontSize: "56px",
          lineHeight: 0.4,
          color: "var(--brown-500)",
          opacity: 0.5,
          verticalAlign: "-16px",
        }}
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <span
        className="quote-text"
        style={{
          display: "block",
          fontFamily: '"IM Fell English", Georgia, serif',
          fontSize: "22px",
          lineHeight: 1.4,
          color: "var(--brown-700)",
          fontStyle: "italic",
          padding: "8px 0",
        }}
      >
        {text}
      </span>
      {source && (
        <span
          className="quote-source"
          style={{
            display: "block",
            fontFamily: '"Special Elite", monospace',
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--brown-500)",
            opacity: 0.7,
            marginTop: "12px",
          }}
        >
          {source}
        </span>
      )}
    </blockquote>
  );
}
