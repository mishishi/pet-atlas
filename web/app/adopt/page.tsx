/**
 * web/app/adopt/page.tsx · 领养云宠物
 *
 * 流程(单页 3 步):
 * 1. 选品种:50 个 grid,按品类分组
 * 2. 配置:起名 + 性格 + 颜色 + 显示 3 个变体
 * 3. 确认:展示最终选择,点"领养" → 写 localStorage → 跳 /profile
 *
 * M1 数据来源:预生成池(web/public/cloud-pets/pool/) 3 个变体
 */

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { BottomNav } from "@/components/nav/BottomNav";
import {
  BREED_FEATURES,
  type BreedCategory,
  type BreedFeatures,
} from "@/lib/breedFeatures";
import { getBreedVariants } from "@/lib/cloud-pet-urls";
import {
  saveAdoptedPet,
  generatePetId,
  type CloudPet,
  type Personality,
  type ColorPreference,
  PERSONALITY_LABEL,
  COLOR_LABEL,
} from "@/lib/cloudPet";

const CATEGORY_LABELS: Record<BreedCategory, string> = {
  dog: "犬",
  cat: "猫",
  "small-mammal": "小型哺乳",
  bird: "鸟",
  reptile: "爬宠",
};

const CATEGORY_EMOJI: Record<BreedCategory, string> = {
  dog: "🐕",
  cat: "🐈",
  "small-mammal": "🐹",
  bird: "🦜",
  reptile: "🦎",
};

export default function AdoptPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBreed, setSelectedBreed] = useState<BreedFeatures | null>(
    null
  );
  const [petName, setPetName] = useState("");
  const [personality, setPersonality] = useState<Personality>("curious");
  const [colorPreference, setColorPreference] =
    useState<ColorPreference>("classic");
  const [selectedVariant, setSelectedVariant] = useState<1 | 2 | 3>(1);

  const groupedBreeds = useMemo(() => {
    const out: Record<BreedCategory, BreedFeatures[]> = {
      dog: [],
      cat: [],
      "small-mammal": [],
      bird: [],
      reptile: [],
    };
    for (const b of BREED_FEATURES) {
      out[b.category].push(b);
    }
    return out;
  }, []);

  function handleSelectBreed(b: BreedFeatures) {
    setSelectedBreed(b);
    setStep(2);
  }

  function handleConfirm() {
    if (!selectedBreed) return;
    if (petName.trim().length < 2 || petName.trim().length > 6) return;

    const variantUrl = getBreedVariants(selectedBreed.slug)[
      selectedVariant - 1
    ];

    const pet: CloudPet = {
      petId: generatePetId(),
      breedSlug: selectedBreed.slug,
      breedZh: selectedBreed.breedZh,
      breedCategory: selectedBreed.category,
      petName: petName.trim(),
      personality,
      colorPreference,
      variantIndex: selectedVariant,
      tcbUrl: variantUrl,
      createdAt: Date.now(),
    };

    saveAdoptedPet(pet);
    router.push("/profile");
  }

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
          {/* 纸张噪点 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              mixBlendMode: "multiply",
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/></svg>\")",
            }}
          />

          <div className="relative max-w-3xl mx-auto px-4 py-8 md:py-12">
            {/* 标题 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brown-300/60 bg-oat-100/50 mb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-brown-600">
                  MUSEUM COLLECTION · No.052
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 mb-2">
                领养你的云宠物
              </h1>
              <p className="text-sm md:text-base text-brown-700">
                从 50 个品种里选一只,起个名字,AI 帮你生成专属立绘
              </p>
            </div>

            {/* 步骤指示器 */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex items-center gap-2 ${
                    s === step ? "text-warm-brown" : "text-brown-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2 ${
                      s === step
                        ? "border-warm-brown bg-warm-brown/10"
                        : s < step
                        ? "border-warm-brown bg-warm-brown text-white"
                        : "border-brown-300"
                    }`}
                  >
                    {s < step ? "✓" : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-12 h-0.5 ${
                        s < step ? "bg-warm-brown" : "bg-brown-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: 选品种 */}
            {step === 1 && (
              <div className="space-y-6">
                {(Object.keys(groupedBreeds) as BreedCategory[]).map((cat) => (
                  <div key={cat}>
                    <h2 className="font-serif text-lg font-bold text-brown-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">{CATEGORY_EMOJI[cat]}</span>
                      {CATEGORY_LABELS[cat]}
                      <span className="text-xs text-brown-500 font-mono">
                        ({groupedBreeds[cat].length})
                      </span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {groupedBreeds[cat].map((b) => (
                        <button
                          key={b.slug}
                          onClick={() => handleSelectBreed(b)}
                          className="group p-3 rounded-lg border border-brown-300/60 bg-oat-50/60 hover:bg-oat-100 hover:border-warm-brown transition-all text-left"
                        >
                          <div className="font-medium text-sm text-brown-900 leading-tight">
                            {b.breedZh}
                          </div>
                          <div className="text-xs text-brown-500 mt-1 font-mono">
                            {b.breedEn}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: 配置 + 选变体 */}
            {step === 2 && selectedBreed && (
              <div className="space-y-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-brown-600 hover:text-warm-brown flex items-center gap-1"
                >
                  ← 重选品种
                </button>

                {/* 名字 */}
                <div>
                  <label className="block text-sm font-medium text-brown-900 mb-2">
                    名字 <span className="text-warm-brown">*</span>
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="2-6 个字,如 豆豆 / 圆圆 / 糖糖"
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-lg border-2 border-brown-300/60 bg-oat-50/80 focus:border-warm-brown focus:outline-none text-brown-900 placeholder:text-brown-400"
                  />
                  <div className="text-xs text-brown-500 mt-1 text-right">
                    {petName.length} / 6
                  </div>
                </div>

                {/* 性格 */}
                <div>
                  <label className="block text-sm font-medium text-brown-900 mb-2">
                    性格倾向
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(PERSONALITY_LABEL) as Personality[]).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPersonality(p)}
                          className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            personality === p
                              ? "border-warm-brown bg-warm-brown/10 text-warm-brown"
                              : "border-brown-300/60 bg-oat-50/60 text-brown-700 hover:border-brown-400"
                          }`}
                        >
                          {PERSONALITY_LABEL[p]}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* 颜色偏好 */}
                <div>
                  <label className="block text-sm font-medium text-brown-900 mb-2">
                    颜色偏好
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(COLOR_LABEL) as ColorPreference[]).map(
                      (c) => (
                        <button
                          key={c}
                          onClick={() => setColorPreference(c)}
                          className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            colorPreference === c
                              ? "border-warm-brown bg-warm-brown/10 text-warm-brown"
                              : "border-brown-300/60 bg-oat-50/60 text-brown-700 hover:border-brown-400"
                          }`}
                        >
                          {COLOR_LABEL[c]}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* 3 个变体 */}
                <div>
                  <label className="block text-sm font-medium text-brown-900 mb-2">
                    选一只立绘
                    <span className="ml-2 text-xs text-brown-500 font-normal">
                      (每个品种 AI 生成 3 张,选最合眼缘的)
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {getBreedVariants(selectedBreed.slug).map((url, idx) => {
                      const v = (idx + 1) as 1 | 2 | 3;
                      return (
                        <button
                          key={v}
                          onClick={() => setSelectedVariant(v)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            selectedVariant === v
                              ? "border-warm-brown ring-2 ring-warm-brown/30 scale-[0.98]"
                              : "border-brown-300/60 hover:border-brown-400"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`${selectedBreed.breedZh} 变体 ${v}`}
                            className="w-full h-full object-cover"
                          />
                          {selectedVariant === v && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-warm-brown text-white flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                            <div className="text-white text-xs font-mono">
                              v{v}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 下一步 */}
                <button
                  onClick={() => setStep(3)}
                  disabled={petName.trim().length < 2}
                  className="w-full py-3 rounded-lg bg-warm-brown text-white font-medium disabled:bg-brown-300 disabled:cursor-not-allowed hover:bg-warm-brown/90 transition-colors"
                >
                  下一步 →
                </button>
              </div>
            )}

            {/* Step 3: 确认 */}
            {step === 3 && selectedBreed && (
              <div className="space-y-6">
                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-brown-600 hover:text-warm-brown flex items-center gap-1"
                >
                  ← 返回修改
                </button>

                <div className="bg-oat-50/80 rounded-2xl p-6 border-2 border-warm-brown/40 shadow-lg">
                  <h2 className="font-serif text-2xl font-bold text-brown-900 mb-1 text-center">
                    确认领养
                  </h2>
                  <p className="text-sm text-brown-600 text-center mb-6">
                    这就是你的云宠物了
                  </p>

                  <div className="aspect-square max-w-sm mx-auto rounded-xl overflow-hidden border-2 border-warm-brown/40 shadow-md mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getBreedVariants(selectedBreed.slug)[
                        selectedVariant - 1
                      ]}
                      alt={petName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <dl className="space-y-2 max-w-sm mx-auto">
                    <div className="flex justify-between border-b border-brown-200 pb-1">
                      <dt className="text-sm text-brown-600">名字</dt>
                      <dd className="font-medium text-brown-900">
                        {petName}
                      </dd>
                    </div>
                    <div className="flex justify-between border-b border-brown-200 pb-1">
                      <dt className="text-sm text-brown-600">品种</dt>
                      <dd className="font-medium text-brown-900">
                        {selectedBreed.breedZh}
                      </dd>
                    </div>
                    <div className="flex justify-between border-b border-brown-200 pb-1">
                      <dt className="text-sm text-brown-600">性格</dt>
                      <dd className="font-medium text-brown-900">
                        {PERSONALITY_LABEL[personality]}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-brown-600">颜色偏好</dt>
                      <dd className="font-medium text-brown-900">
                        {COLOR_LABEL[colorPreference]}
                      </dd>
                    </div>
                  </dl>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full py-4 rounded-lg bg-warm-brown text-white font-bold text-base hover:bg-warm-brown/90 transition-colors shadow-md"
                >
                  领养 {petName} →
                </button>

                <p className="text-xs text-brown-500 text-center">
                  数据存于你的浏览器,清缓存会丢失
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
