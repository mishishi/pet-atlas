/**
 * SafeImage · 带 fallback 的 next/image 包装
 *
 * 用法:
 *   <SafeImage src={thumb} fallback={full} alt="..." fill sizes="..." />
 *
 * 行为:
 *  - 默认加载 src
 *  - src 404 / error 时自动 swap 到 fallback
 *  - fallback 也失败就保持 fallback URL(浏览器显示 broken icon)
 *
 * 为什么需要:next/image 是 client component,但调用方(page.tsx)是 server component,
 * 不能直接传 onError 函数(handler 不序列化)。
 * 包一层 client component 解决。
 */

"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

export interface SafeImageProps
  extends Omit<ImageProps, "src" | "onError"> {
  src: string;
  fallback?: string;
  alt: string;
}

export function SafeImage({
  src,
  fallback,
  alt,
  ...rest
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  // 关键:如果 src 跟 fallback 不一样,且没触发过 fallback,就监听 onError
  const handleError = () => {
    if (!hasErrored && fallback && fallback !== currentSrc) {
      setCurrentSrc(fallback);
      setHasErrored(true);
    }
  };

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt}
      onError={handleError}
    />
  );
}
