/**
 * web/lib/useCollection.ts · v0.8 收藏 client hook
 *
 * 用 localStorage 跟踪用户访问过的 breed slug 集合。
 * 详情页 mount 时 markVisited,首页/详情页用 progress 展示。
 *
 * ⚠️ 客户端 hook,不能在 server component 用。
 */

"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pet-atlas-collection";

function readCollection(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function writeCollection(set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* quota / private mode */
  }
}

/** 收藏 hook:返回当前 collection set + markVisited 函数 */
export function useCollection() {
  // 初始空 set,等 mount 后读 localStorage (避免 SSR hydration mismatch)
  const [collection, setCollection] = useState<Set<string>>(() => new Set());
  const [recent, setRecent] = useState<string[]>([]);

  // Mount 后读 localStorage
  useEffect(() => {
    const set = readCollection();
    setCollection(set);
    try {
      const raw = window.localStorage.getItem(`${STORAGE_KEY}:recent`);
      if (raw) setRecent(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  const markVisited = useCallback((slug: string) => {
    setCollection((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      writeCollection(next);
      // recent 加到队首,保留最近 5 个
      setRecent((r) => {
        const without = r.filter((s) => s !== slug);
        const nextRecent = [slug, ...without].slice(0, 5);
        try {
          window.localStorage.setItem(
            `${STORAGE_KEY}:recent`,
            JSON.stringify(nextRecent)
          );
        } catch {
          /* ignore */
        }
        return nextRecent;
      });
      return next;
    });
  }, []);

  return { collection, recent, markVisited };
}
