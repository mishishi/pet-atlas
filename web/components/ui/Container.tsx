/**
 * Container · 居中容器,统一 max-width + 水平 padding
 */
import { type HTMLAttributes } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  as?: "div" | "section" | "article" | "header" | "footer" | "nav";
}

const sizeMap = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-[1400px]",
};

export function Container({
  size = "xl",
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full ${sizeMap[size]} px-4 sm:px-6 md:px-8 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
