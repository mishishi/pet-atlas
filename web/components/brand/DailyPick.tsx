/**
 * web/components/brand/DailyPick.tsx · 详情页底部"今日份"随机推荐
 *
 * - server-side 算今天日期 hash → 选一个稳定 slug (所有人今天看到的同一个)
 * - 客户端 reroll 按钮:换个随机 (不持久化,刷新回到今日份)
 * - 视觉:大封面 + breed 名 + category 印章 + "翻一张" 按钮
 *
 * Props:
 *  - todaySlug: server-side 算好的今日 slug
 *  - candidates: server-side 传的所有 specimens (passport 同样的数据格式)
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import type { SpecimenStamp } from "@/components/brand/CollectionPassport";

interface DailyPickProps {
  todaySlug: string;
  todayDate: string;     // 格式 "2026-07-28"
  candidates: SpecimenStamp[];
}

function pickRandom(slug: string, candidates: SpecimenStamp[]): SpecimenStamp {
  let h = 0;
  const seed = slug + Date.now();
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(h) % candidates.length;
  return candidates[idx];
}

/** category → public 目录 */
function categoryDir(cat: string): string {
  if (cat === "bird" || cat === "reptile") return "bird-reptile";
  return cat; // cat / dog / small-mammal 都直接是目录名
}

export function DailyPick({ todaySlug, todayDate, candidates }: DailyPickProps) {
  const initialSpec = candidates.find((s) => s.slug === todaySlug) ?? candidates[0];
  const [spec, setSpec] = useState<SpecimenStamp>(initialSpec);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    // 400ms 动画后换
    setTimeout(() => {
      let next: SpecimenStamp = spec;
      // 保证不重复
      let tries = 0;
      while (next.slug === spec.slug && tries < 10) {
        next = pickRandom(todaySlug + tries, candidates);
        tries++;
      }
      setSpec(next);
      setRolling(false);
    }, 400);
  };

  return (
    <section
      className="mt-12 md:mt-16"
      style={{
        background: "var(--oat-100)",
        border: "2px solid var(--brown-500)",
        borderRadius: 4,
        padding: "24px 20px",
        boxShadow: "0 6px 16px -4px rgba(74, 51, 28, 0.15)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 装饰角 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 120,
          height: 120,
          background: "radial-gradient(circle at 100% 0%, rgba(164, 74, 63, 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 100,
          height: 100,
          background: "radial-gradient(circle at 0% 100%, rgba(139, 111, 71, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* header */}
      <div className="text-center mb-4 relative">
        <div
          style={{
            fontFamily: '"Special Elite", monospace',
            fontSize: 10,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--brown-500)",
            marginBottom: 4,
          }}
        >
          — Tabula Fortuita · {todayDate} —
        </div>
        <h3
          style={{
            fontFamily: '"IM Fell English", serif',
            fontSize: 26,
            color: "var(--brown-900)",
            marginBottom: 4,
            fontWeight: 600,
          }}
        >
          今日份
        </h3>
        <div
          style={{
            fontFamily: '"IM Fell English", italic',
            fontSize: 14,
            color: "var(--warm-brown)",
          }}
        >
          翻一翻,看今天命运推荐了哪只
        </div>
      </div>

      {/* featured card */}
      <div
        className="flex items-center gap-4 max-w-xl mx-auto"
        style={{
          padding: 12,
          background: "rgba(245, 233, 208, 0.5)",
          border: "1px solid var(--brown-300)",
          borderRadius: 3,
          opacity: rolling ? 0.4 : 1,
          transition: "opacity 400ms ease",
        }}
      >
        <Link
          href={`/pets/${spec.slug}`}
          className="shrink-0"
          aria-label={`查看 ${spec.nameZh}`}
        >
          <div
            style={{
              width: 96,
              height: 96,
              border: "2px solid var(--brown-500)",
              borderRadius: 3,
              overflow: "hidden",
              background: "var(--oat-200)",
              position: "relative",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/${categoryDir(spec.category)}/${spec.slug}/01-cover-thumb.jpg`}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                // 退化:用 medium
                const img = e.currentTarget;
                if (!img.src.includes("-medium")) {
                  img.src = `/${categoryDir(spec.category)}/${spec.slug}/01-cover-medium.jpg`;
                }
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 4,
                left: 4,
                background: "var(--brick)",
                color: "var(--oat-100)",
                fontSize: 9,
                fontFamily: '"Special Elite", monospace',
                padding: "1px 6px",
                borderRadius: 2,
                letterSpacing: "0.1em",
              }}
            >
              {categoryLabel(spec.category)}
            </div>
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontFamily: '"Special Elite", monospace',
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--brown-500)",
              marginBottom: 4,
            }}
          >
            {spec.initial}
          </div>
          <Link
            href={`/pets/${spec.slug}`}
            className="block"
          >
            <h4
              style={{
                fontFamily: '"IM Fell English", serif',
                fontSize: 20,
                color: "var(--brown-900)",
                fontWeight: 600,
                marginBottom: 2,
                lineHeight: 1.2,
              }}
            >
              {spec.nameZh}
            </h4>
          </Link>
          <div
            style={{
              fontFamily: '"IM Fell English", italic',
              fontSize: 12,
              color: "var(--brown-600)",
            }}
          >
            Specimen of the day
          </div>
        </div>
        <button
          onClick={roll}
          disabled={rolling}
          aria-label="翻一张"
          className="shrink-0"
          style={{
            background: "var(--brown-700)",
            color: "var(--oat-100)",
            border: "none",
            padding: "10px 16px",
            borderRadius: 2,
            fontFamily: '"Special Elite", monospace',
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: rolling ? "wait" : "pointer",
            transition: "all 200ms ease",
            minHeight: 44,
            minWidth: 80,
          }}
        >
          {rolling ? "..." : "翻一张"}
        </button>
      </div>

      <p
        className="text-center mt-4"
        style={{
          fontFamily: '"IM Fell English", italic',
          fontSize: 12,
          color: "var(--brown-500)",
        }}
      >
        所有人今天看到的都是同一只 — 命运之选
      </p>
    </section>
  );
}

function categoryLabel(cat: string): string {
  return {
    dog: "犬",
    cat: "猫",
    "small-mammal": "小型哺乳",
    bird: "鸟",
    reptile: "爬虫",
  }[cat] || cat;
}
