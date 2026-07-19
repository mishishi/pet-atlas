/**
 * web/app/profile/reroll/page.tsx · 换一只
 *
 * 展示当前品种的 3 个变体,用户选一张。
 * 选完 → 更新 CloudPet.variantIndex + tcbUrl,扣 reroll 次数,跳回 /profile
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { BottomNav } from "@/components/nav/BottomNav";
import {
  getAdoptedPet,
  saveAdoptedPet,
  consumeReroll,
  canReroll,
  remainingRerolls,
  type CloudPet,
} from "@/lib/cloudPet";
import { getBreedVariants } from "@/lib/cloud-pet-urls";

export default function RerollPage() {
  const router = useRouter();
  const [pet, setPet] = useState<CloudPet | null>(null);
  const [picked, setPicked] = useState<1 | 2 | 3 | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const p = getAdoptedPet();
    setPet(p);
  }, []);

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="pb-24 md:pb-12 min-h-screen flex items-center justify-center">
          <div className="text-brown-500">载入中...</div>
        </main>
        <BottomNav />
      </>
    );
  }

  if (!pet) {
    return (
      <>
        <Header />
        <main className="pb-24 md:pb-12 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-brown-600 mb-4">还没有领养宠物</p>
            <Link
              href="/adopt"
              className="px-6 py-2 rounded-lg bg-warm-brown text-white"
            >
              去领养
            </Link>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  if (!canReroll()) {
    return (
      <>
        <Header />
        <main className="pb-24 md:pb-12 min-h-screen">
          <div
            className="relative w-full"
            style={{
              background:
                "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
            }}
          >
            <div className="max-w-md mx-auto px-6 py-16 text-center">
              <div className="text-5xl mb-4">🦴</div>
              <h1 className="font-serif text-2xl font-bold text-brown-900 mb-2">
                换一只次数用完了
              </h1>
              <p className="text-brown-600 mb-2">
                读 1 篇新图鉴可以解锁 1 次换一只
              </p>
              <p className="text-xs text-brown-500 mb-6">
                剩余 {remainingRerolls()} / 共 3 次
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/pets"
                  className="px-6 py-3 rounded-lg bg-warm-brown text-white font-medium"
                >
                  去看图鉴 →
                </Link>
                <Link
                  href="/profile"
                  className="px-6 py-3 rounded-lg border-2 border-warm-brown text-warm-brown font-medium"
                >
                  返回
                </Link>
              </div>
            </div>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  const variants = getBreedVariants(pet.breedSlug);

  function handleConfirm() {
    if (!pet || !picked) return;
    const ok = consumeReroll();
    if (!ok) return;
    const newPet: CloudPet = {
      ...pet,
      variantIndex: picked,
      tcbUrl: variants[picked - 1],
    };
    saveAdoptedPet(newPet);
    router.push("/profile");
  }

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-12 min-h-screen">
        <div
          className="relative w-full"
          style={{
            background:
              "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
          }}
        >
          <div className="max-w-2xl mx-auto px-4 py-8">
            <Link
              href="/profile"
              className="text-sm text-brown-600 hover:text-warm-brown mb-4 inline-block"
            >
              ← 返回
            </Link>

            <div className="text-center mb-6">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-brown-900 mb-2">
                给 {pet.petName} 换一只
              </h1>
              <p className="text-sm text-brown-600">
                选 3 个变体里的 1 个 · 用掉 1 次换一只
                (剩余 {remainingRerolls()})
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
              {variants.map((url, idx) => {
                const v = (idx + 1) as 1 | 2 | 3;
                const isCurrent = pet.variantIndex === v;
                return (
                  <button
                    key={v}
                    onClick={() => setPicked(v)}
                    disabled={isCurrent}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      isCurrent
                        ? "border-brown-300 opacity-50 cursor-not-allowed"
                        : picked === v
                        ? "border-warm-brown ring-2 ring-warm-brown/30 scale-[0.98]"
                        : "border-brown-300/60 hover:border-brown-400"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${pet.breedZh} 变体 ${v}`}
                      className="w-full h-full object-cover"
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="text-white text-xs font-mono">
                          当前
                        </span>
                      </div>
                    )}
                    {picked === v && !isCurrent && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-warm-brown text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!picked}
              className="w-full py-3 rounded-lg bg-warm-brown text-white font-medium disabled:bg-brown-300 disabled:cursor-not-allowed hover:bg-warm-brown/90 transition-colors"
            >
              {picked ? "确认换成这只" : "选 1 张变体"}
            </button>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
