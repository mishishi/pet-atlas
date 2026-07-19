"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ATLAS_PAGE_COUNT, ATLAS_SLOTS } from "@/lib/atlas-constants";

interface AtlasViewerProps {
  slug: string;
  nameZh: string;
  gallery: string[];
}

function clamp(n: number): number {
  if (!Number.isFinite(n) || n < 1) return 1;
  if (n > ATLAS_PAGE_COUNT) return ATLAS_PAGE_COUNT;
  return n;
}

export default function AtlasViewer({ slug, nameZh, gallery }: AtlasViewerProps) {
  const sp = useSearchParams();
  const raw = sp?.get("page") ?? "1";
  const page = clamp(parseInt(raw, 10));

  const total = ATLAS_PAGE_COUNT;
  const imageUrl = gallery[page - 1];
  const label = ATLAS_SLOTS[page - 1] ?? `图 ${page}`;
  const detailHref = `/pets/${slug}`;
  const prevHref = page > 1 ? `/pets/${slug}/atlas?page=${page - 1}` : null;
  const nextHref = page < total ? `/pets/${slug}/atlas?page=${page + 1}` : null;

  return (
    <main className="flex-1 w-full bg-oat min-h-screen">
      <div className="mx-auto max-w-md min-h-screen flex flex-col px-4 py-6 sm:py-8">
        {/* Top bar: title + page indicator */}
        <header className="flex items-center justify-between">
          <Link href={detailHref} className="text-sm text-ink-soft hover:text-ink">
            ← {nameZh}
          </Link>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={`/pets/${slug}/atlas?page=${n}`}
                aria-label={`跳到第 ${n} 页`}
                className={`h-1.5 rounded-full transition-all ${
                  n === page
                    ? "w-6 bg-ink"
                    : "w-1.5 bg-ink-soft/40 hover:bg-ink-soft"
                }`}
              />
            ))}
            <span className="ml-2 text-xs text-ink-soft font-mono">
              {page} / {total}
            </span>
          </div>
        </header>

        {/* Page label */}
        <div className="mt-6 text-center">
          <span className="text-[11px] tracking-[0.4em] text-ink-soft uppercase">
            Page {page}
          </span>
          <h1 className="mt-1 text-lg font-bold">{label}</h1>
        </div>

        {/* Atlas image 9:16 */}
        <div className="mt-4 flex-1 flex items-center justify-center">
          <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-sm bg-oat-deep">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`${nameZh} · ${label} · 第 ${page} 页`}
              className="w-full h-full object-cover"
              key={imageUrl}
            />
          </div>
        </div>

        {/* Page nav */}
        <nav className="mt-6 grid grid-cols-3 gap-3">
          {prevHref ? (
            <Link
              href={prevHref}
              className="rounded-full bg-white/70 border border-oat-deep/50 px-4 py-3 text-center text-sm font-medium hover:bg-white"
            >
              ← 上一张
            </Link>
          ) : (
            <span className="rounded-full bg-oat-deep/40 px-4 py-3 text-center text-sm text-ink-soft/50">
              ← 上一张
            </span>
          )}

          <Link
            href={detailHref}
            className="rounded-full bg-ink text-oat px-4 py-3 text-center text-sm font-medium hover:bg-ink/85"
          >
            返回详情
          </Link>

          {nextHref ? (
            <Link
              href={nextHref}
              className="rounded-full bg-white/70 border border-oat-deep/50 px-4 py-3 text-center text-sm font-medium hover:bg-white"
            >
              下一张 →
            </Link>
          ) : (
            <span className="rounded-full bg-oat-deep/40 px-4 py-3 text-center text-sm text-ink-soft/50">
              下一张 →
            </span>
          )}
        </nav>

        {/* Thumbnail strip (quick jump) */}
        <ol className="mt-6 grid grid-cols-6 gap-1.5">
          {gallery.map((url, i) => {
            const n = i + 1;
            const isActive = n === page;
            return (
              <li key={url}>
                <Link
                  href={`/pets/${slug}/atlas?page=${n}`}
                  aria-label={`跳到第 ${n} 页`}
                  className={`block aspect-[9/16] rounded-md overflow-hidden transition-all ${
                    isActive
                      ? "ring-2 ring-ink"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
