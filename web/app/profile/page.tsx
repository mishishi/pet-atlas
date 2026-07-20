/**
 * web/app/profile/page.tsx · 个人中心
 *
 * 状态:
 * - 没领养 → 显示"领养一只"入口
 * - 已领养 → 显示云宠物 + 读图鉴进度 + 换一只入口(reroll)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { BottomNav } from "@/components/nav/BottomNav";
import { Footer } from "@/components/nav/Footer";
import {
  getAdoptedPet,
  getRerollState,
  remainingRerolls,
  recordBreedRead,
  type CloudPet,
} from "@/lib/cloudPet";
import { getBreedVariants } from "@/lib/cloud-pet-urls";
import { PERSONALITY_LABEL } from "@/lib/cloudPet";
import { PetStatusCard } from "@/components/cloud-pet/PetStatusCard";

export default function ProfilePage() {
  const [pet, setPet] = useState<CloudPet | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPet(getAdoptedPet());
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
    return <EmptyProfile />;
  }

  const rerolls = remainingRerolls();
  const rerollState = getRerollState();

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-12 min-h-screen">
        <div
          className="relative w-full overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              mixBlendMode: "multiply",
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/></svg>\")",
            }}
          />

          <div className="relative max-w-2xl mx-auto px-4 py-8 md:py-12">
            {/* 标本卡 */}
            <div className="bg-oat-50/80 rounded-2xl p-6 md:p-8 border-2 border-warm-brown/40 shadow-xl">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brown-300/60 bg-oat-100/50 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brown-600">
                    MUSEUM SPECIMEN · No.052
                  </span>
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 mb-1">
                  {pet.petName}
                </h1>
                <p className="text-sm text-brown-600">
                  {pet.breedZh} ·{" "}
                  {PERSONALITY_LABEL[pet.personality]}
                </p>
              </div>

              <div className="aspect-square max-w-md mx-auto rounded-xl overflow-hidden border-2 border-warm-brown/40 shadow-md mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pet.tcbUrl}
                  alt={pet.petName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* M2 · 宠物状态卡(喂食/玩耍/休息) */}
              <PetStatusCard />

              <div className="grid grid-cols-3 gap-2 text-center mb-6">
                <Stat
                  label="已解锁"
                  value={`${rerollState.unlocked}/${rerollState.max}`}
                />
                <Stat
                  label="已使用"
                  value={`${rerollState.used}/${rerollState.max}`}
                />
                <Stat
                  label="剩余换"
                  value={`${rerolls} 次`}
                />
              </div>

              {/* 操作区 */}
              <div className="space-y-2">
                <Link
                  href="/adopt"
                  className="block w-full py-3 text-center rounded-lg bg-warm-brown text-white font-medium hover:bg-warm-brown/90 transition-colors"
                >
                  重新领养
                </Link>
                <RerollButton pet={pet} disabled={rerolls === 0} />
              </div>

              <p className="text-xs text-brown-500 text-center mt-4">
                领养于 {new Date(pet.createdAt).toLocaleDateString("zh-CN")}
                <br />
                数据存在你的浏览器,清缓存会丢失
              </p>
            </div>

            {/* 怎么解锁换一只 */}
            <div className="mt-6 bg-oat-100/50 rounded-xl p-4 border border-brown-200/60">
              <h3 className="font-medium text-brown-900 mb-2 text-sm">
                🦴 怎么解锁换一只?
              </h3>
              <ul className="text-xs text-brown-600 space-y-1">
                <li>• 领养后自带 1 次免费换</li>
                <li>• 读 1 篇新图鉴 + 1 次(累计上限 3 次)</li>
                <li>• 不读图鉴也不扣任何东西,慢慢来</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-oat-100/50 rounded-lg py-2 border border-brown-200/60">
      <div className="text-xs text-brown-600">{label}</div>
      <div className="font-mono font-bold text-warm-brown">{value}</div>
    </div>
  );
}

function RerollButton({
  pet,
  disabled,
}: {
  pet: CloudPet;
  disabled: boolean;
}) {
  if (disabled) {
    return (
      <div className="block w-full py-3 text-center rounded-lg bg-brown-100 text-brown-500 font-medium cursor-not-allowed">
        换一只次数用完了 · 读图鉴解锁
      </div>
    );
  }
  return (
    <Link
      href="/profile/reroll"
      className="block w-full py-3 text-center rounded-lg border-2 border-warm-brown text-warm-brown font-medium hover:bg-warm-brown/5 transition-colors"
    >
      换一只(选另外 2 个变体)
    </Link>
  );
}

function EmptyProfile() {
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-12 min-h-screen flex items-center justify-center">
        <div
          className="relative w-full"
          style={{
            background:
              "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
          }}
        >
          <div className="max-w-md mx-auto px-6 py-16 text-center">
            <div className="text-6xl mb-4">🐾</div>
            <h1 className="font-serif text-2xl font-bold text-brown-900 mb-2">
              你还没有云宠物
            </h1>
            <p className="text-brown-600 mb-6">
              从 50 个品种里挑一只,起个名字,开始你的图鉴之旅
            </p>
            <Link
              href="/adopt"
              className="inline-block px-8 py-3 rounded-lg bg-warm-brown text-white font-bold hover:bg-warm-brown/90 transition-colors shadow-md"
            >
              领养一只 →
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
