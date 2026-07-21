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
import { useEffect, useState } from "react";

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

  // ⭐ src 变化时(翻牌 / 选变体 / URL 切换),重置所有状态 + 换 currentSrc
  // 不然 useState 只 init 一次,新 src 进来 currentSrc 还是旧的,图不换
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasErrored(false);
    setFullyFailed(false);
  }, [src]);

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
        key={src}
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
