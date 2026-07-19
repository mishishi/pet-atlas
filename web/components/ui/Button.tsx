/**
 * Button · 标本卡美学按钮
 * - primary: 棕色实心 + 米色文字 + 阴影
 * - outline: 边框 + 棕字 + hover 填色
 * - ghost: 透明 + 棕字 + hover 浅棕底
 */
import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-[var(--radius)] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-brown-500 focus-visible:outline-offset-2 active:scale-[0.98]";

const sizeMap: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-5 py-2.5",
  lg: "text-lg px-7 py-3.5",
};

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-brown-700 text-oat-100 shadow-[var(--shadow-paper-md)] hover:bg-brown-800 hover:shadow-[var(--shadow-paper-lg)] border border-brown-800",
  outline:
    "bg-transparent text-brown-700 border border-brown-400 hover:bg-brown-50 hover:border-brown-600",
  ghost:
    "bg-transparent text-brown-600 hover:bg-brown-50 hover:text-brown-800",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`${base} ${sizeMap[size]} ${variantMap[variant]} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
