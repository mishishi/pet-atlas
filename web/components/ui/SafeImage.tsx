/**
 * SafeImage · 带 fallback + loading skeleton 的 next/image 包装
 *
 * 用法:
 *   <div className="relative aspect-[9/16]">
 *     <SafeImage src={thumb} fallback={full} alt="..." fill sizes="..." />
 *   </div>
 *
 * 行为:
 *  - 加载中:叠加 shimmer skeleton(同形覆盖)
 *  - src 加载成功:隐藏 skeleton,显示图片
 *  - src 404 / error:swap 到 fallback(重新走 loading 流程)
 *  - fallback 也失败:显示纯文字 fallback(🐾 + alt)
 *
 * 为什么需要:next/image 是 client component,但调用方(page.tsx)是 server component,
 * 不能直接传 onError / onLoad 函数(handler 不序列化)。
 * 包一层 client component 解决。
 */

"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

export interface SafeImageProps
  extends Omit<ImageProps, "src" | "onError" | "onLoad"> {
  src: string;
  fallback?: string;
  alt: string;
}

export function SafeImage({
  src,
  fallback,
  alt,
  className,
  ...rest
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasErrored, setHasErrored] = useState(false);
  const [fullyFailed, setFullyFailed] = useState(false);

  // src 变化时(比如 fallback swap),重置 loading 状态
  // 用 useEffect 监听 currentSrc 变化,避免无限循环
  // (简化:handleError 会显式调用 setIsLoading(true),这里不重复)

  const handleError = () => {
    if (!hasErrored && fallback && fallback !== currentSrc) {
      // 第一次失败:swap 到 fallback,重新走 loading
      setCurrentSrc(fallback);
      setHasErrored(true);
      setIsLoading(true);
    } else {
      // fallback 也失败(或没有 fallback):显示占位
      setIsLoading(false);
      setFullyFailed(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (fullyFailed) {
    return (
      <div
        className={"img-fallback " + (className || "")}
        role="img"
        aria-label={alt}
      >
        <span className="img-fallback-paw" aria-hidden>🐾</span>
        <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <>
      <Image
        {...rest}
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
      />
      {isLoading && (
        <div
          className="img-skeleton absolute inset-0 pointer-events-none"
          aria-hidden
        />
      )}
    </>
  );
}
