/**
 * web/components/cloud-pet/BreedReadTracker.tsx · 读图鉴追踪(无 UI)
 *
 * 用途:嵌到 /pets/[slug] 页面里,用户访问某品种时:
 * 1. 记录"该品种被阅读了 1 次"
 * 2. 解锁 1 次 reroll(累计上限 3)
 *
 * 没有可见 UI,纯 side effect。
 * 客户端组件(用 localStorage)。
 *
 * 用法:
 *   <BreedReadTracker slug={slug} />
 */

"use client";

import { useEffect, useRef } from "react";
import { recordBreedRead } from "@/lib/cloudPet";

export function BreedReadTracker({ slug }: { slug: string }) {
  const recorded = useRef(false);
  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    recordBreedRead(slug);
  }, [slug]);
  return null;
}
