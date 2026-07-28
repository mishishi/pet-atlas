/**
 * web/components/brand/CollectionPassport.tsx · v0.8 收藏护照
 *
 * 主页/详情页右上,展示"已翻开 N / 150" 进度 + 完整护照 modal。
 *
 * Props:
 *  - specimens: server-side 传的 [{slug, category, initial}] 列表 (150 条)
 *  - 进度用 useCollection() hook 读 localStorage
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCollection } from "@/lib/useCollection";

export interface SpecimenStamp {
  slug: string;
  category: "dog" | "cat" | "small-mammal" | "bird" | "reptile";
  initial: string;        // 拉丁/英文首字母,大写
  nameZh: string;
}

interface CollectionPassportProps {
  specimens: SpecimenStamp[];
  compact?: boolean;        // compact mode: 小卡片,不展示 stamp grid
  className?: string;
}

const CATEGORY_COLOR: Record<SpecimenStamp["category"], string> = {
  dog: "#A44A3F",
  cat: "#523E24",
  "small-mammal": "#A07A48",
  bird: "#A8C5A0",
  reptile: "#6E5635",
};

const CATEGORY_FG: Record<SpecimenStamp["category"], string> = {
  dog: "#F5E9D0",
  cat: "#F5EFE0",
  "small-mammal": "#FCFAF4",
  bird: "#2A2520",
  reptile: "#F5EFE0",
};

export function CollectionPassport({
  specimens,
  compact = false,
  className = "",
}: CollectionPassportProps) {
  const { collection, recent } = useCollection();
  const [open, setOpen] = useState(false);

  // ESC 关闭 modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // 锁滚动
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const visitedCount = collection.size;
  const total = specimens.length;
  const pct = total > 0 ? (visitedCount / total) * 100 : 0;
  const recentSpecimens = recent
    .map((slug) => specimens.find((s) => s.slug === slug))
    .filter((s): s is SpecimenStamp => Boolean(s));

  return (
    <>
      <div
        className={`passport-card ${className}`}
        style={{
          background: "var(--oat-100)",
          border: "2px solid var(--brown-500)",
          padding: "16px 20px",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(74, 51, 28, 0.1)",
        }}
      >
        <div
          className="label"
          style={{
            fontFamily: '"Special Elite", monospace',
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--brown-500)",
            marginBottom: 4,
          }}
        >
          My Atlas
        </div>
        <div
          className="title"
          style={{
            fontFamily: '"IM Fell English", serif',
            fontSize: 16,
            color: "var(--brown-900)",
            marginBottom: 10,
          }}
        >
          标本收藏护照
        </div>
        <div
          className="progress-text"
          style={{
            fontFamily: '"Special Elite", monospace',
            fontSize: 13,
            color: "var(--brown-700)",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 18, color: "var(--brick)", fontWeight: "bold" }}>
            {visitedCount}
          </span>{" "}
          <span style={{ color: "var(--brown-500)" }}>/ {total}</span> 已翻开
        </div>
        {visitedCount === 0 && (
          <p
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 11,
              color: "var(--brown-500)",
              marginTop: 4,
              marginBottom: 4,
              fontStyle: "italic",
            }}
          >
            翻开你的第一张标本卡,开始计数
          </p>
        )}
        <div
          className="passport-bar"
          style={{
            height: 8,
            background: "var(--oat-300)",
            border: "1px solid var(--brown-400)",
            borderRadius: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, var(--brown-500) 0%, var(--brick) 100%)",
              transition: "width 400ms ease-out",
            }}
          />
        </div>
        {recentSpecimens.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                fontFamily: '"Special Elite", monospace',
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "var(--brown-500)",
                marginBottom: 6,
              }}
            >
              最近翻开
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {recentSpecimens.slice(0, 5).map((s) => (
                <Link
                  key={s.slug}
                  href={`/pets/${s.slug}`}
                  title={s.nameZh}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: '"IM Fell English", serif',
                    fontSize: 12,
                    color: CATEGORY_FG[s.category],
                    background: CATEGORY_COLOR[s.category],
                    textDecoration: "none",
                  }}
                >
                  {s.initial}
                </Link>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setOpen(true)}
          className="open-modal-btn"
          style={{
            marginTop: 12,
            width: "100%",
            padding: "8px 12px",
            background: "transparent",
            border: "1px solid var(--brown-500)",
            color: "var(--brown-700)",
            fontFamily: '"Special Elite", monospace',
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: 1,
            transition: "all 200ms ease",
          }}
        >
          翻开完整护照
        </button>
      </div>

      {/* === Modal === */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(45, 37, 32, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--oat-200)",
              border: "2px solid var(--brown-500)",
              borderRadius: 4,
              maxWidth: 900,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              padding: 24,
              boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
            }}
          >
            {/* header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: '"IM Fell English", serif',
                    fontSize: 22,
                    color: "var(--brown-900)",
                    marginBottom: 4,
                  }}
                >
                  MY ATLAS · COLLECTION
                </h3>
                <div
                  style={{
                    fontFamily: '"IM Fell English", italic',
                    fontSize: 13,
                    color: "var(--warm-brown)",
                  }}
                >
                  — Collectio mea —
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="关闭"
                style={{
                  background: "transparent",
                  border: "1px solid var(--brown-400)",
                  color: "var(--brown-700)",
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  cursor: "pointer",
                  fontFamily: '"Special Elite", monospace',
                  fontSize: 14,
                }}
              >
                ✕
              </button>
            </div>

            {/* summary */}
            <div
              style={{
                fontFamily: '"Special Elite", monospace',
                fontSize: 12,
                color: "var(--brown-700)",
                marginBottom: 16,
                padding: "8px 12px",
                background: "rgba(139, 111, 71, 0.08)",
                border: "1px solid var(--brown-300)",
                borderRadius: 1,
              }}
            >
              {visitedCount} of {total} specimens collected ·{" "}
              {pct.toFixed(1)}% complete
            </div>

            {/* stamp grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
                gap: 6,
                padding: 8,
                background: "var(--oat-100)",
                border: "1px solid var(--brown-300)",
                borderRadius: 2,
              }}
            >
              {specimens.map((s) => {
                const isVisited = collection.has(s.slug);
                return (
                  <Link
                    key={s.slug}
                    href={isVisited ? `/pets/${s.slug}` : "#"}
                    title={
                      isVisited
                        ? `${s.nameZh} · 已翻开`
                        : `${s.nameZh} · 未翻开`
                    }
                    onClick={(e) => {
                      if (!isVisited) e.preventDefault();
                    }}
                    style={{
                      aspectRatio: "1",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: '"IM Fell English", serif',
                      fontSize: 11,
                      textDecoration: "none",
                      transition: "all 200ms ease",
                      ...(isVisited
                        ? {
                            background: CATEGORY_COLOR[s.category],
                            color: CATEGORY_FG[s.category],
                            cursor: "pointer",
                          }
                        : {
                            border: "1px dashed var(--brown-400)",
                            color: "var(--brown-400)",
                            opacity: 0.4,
                            cursor: "default",
                          }),
                    }}
                  >
                    {isVisited ? s.initial : "·"}
                  </Link>
                );
              })}
            </div>

            <p
              style={{
                textAlign: "center",
                fontFamily: '"IM Fell English", italic',
                fontSize: 12,
                color: "var(--brown-500)",
                marginTop: 16,
              }}
            >
              Continue exploring — each specimen awaits discovery.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/** 详情页用的小型 client 组件:在 mount 时 mark visited,无 UI */
export function CollectionTracker({ slug }: { slug: string }) {
  const { markVisited } = useCollection();
  useEffect(() => {
    markVisited(slug);
    // 只跑一次 (slug 通常不变)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
