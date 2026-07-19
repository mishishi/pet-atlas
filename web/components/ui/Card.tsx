/**
 * Card · 标本卡容器
 */
import { type HTMLAttributes, forwardRef } from "react";

export type CardVariant = "default" | "bordered" | "paper";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

const variantMap: Record<CardVariant, string> = {
  default:
    "bg-oat-100 border border-brown-200 shadow-[var(--shadow-paper)]",
  bordered: "bg-oat-100 border border-brown-300",
  paper:
    "bg-gradient-to-br from-oat-100 to-oat-200 border border-brown-200 shadow-[var(--shadow-paper)]",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", interactive = false, className = "", children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "rounded-[var(--radius)] overflow-hidden",
          variantMap[variant],
          interactive
            ? "transition-all duration-300 ease-out hover:shadow-[var(--shadow-paper-lg)] hover:-translate-y-1 hover:border-brown-400"
            : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";
