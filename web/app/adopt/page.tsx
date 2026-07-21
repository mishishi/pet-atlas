/**
 * web/app/adopt/page.tsx · 领养云宠物
 *
 * 设计原则(2026-07-21 视觉大改版):
 * 1. 视觉先行 — Step 1 直接展示 70 张立绘大卡,用户看图选宠
 * 2. 翻牌彩蛋 — 顶部"随机一只"按钮,挑出 3 个变体之一当 hero
 * 3. 分类过滤 — 犬/猫/小型哺乳/鸟/爬宠 5 个 tab 快速缩范围
 * 4. 选完 hero — Step 2 把选中宠的大图当 hero,下方才是表单
 * 5. 3 变体选择 — 点 v1/v2/v3 切换立绘,所见即所得
 *
 * 流程:
 * 1. 选品种:大图 grid + 翻牌
 * 2. 配置:hero + 名字 + 性格 + 颜色 + 切变体
 * 3. 确认:领养 → localStorage → /profile
 */

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { BottomNav } from "@/components/nav/BottomNav";
import { Confetti } from "@/components/brand/Confetti";
import { SafeImage } from "@/components/ui/SafeImage";
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

const CATEGORY_FULL: Record<BreedCategory, string> = {
  dog: "犬 · Canis",
  cat: "猫 · Felis",
  "small-mammal": "小型哺乳 · Mammalia",
  bird: "鸟 · Aves",
  reptile: "爬宠 · Reptilia",
};

type CategoryFilter = BreedCategory | "all";

const FILTERS: Array<{ key: CategoryFilter; label: string; emoji?: string }> = [
  { key: "all", label: "全部" },
  { key: "dog", label: "犬", emoji: "🐕" },
  { key: "cat", label: "猫", emoji: "🐈" },
  { key: "small-mammal", label: "小型哺乳", emoji: "🐹" },
  { key: "bird", label: "鸟", emoji: "🦜" },
  { key: "reptile", label: "爬宠", emoji: "🦎" },
];

export default function AdoptPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [selectedBreed, setSelectedBreed] = useState<BreedFeatures | null>(
    null
  );
  const [petName, setPetName] = useState("");
  const [personality, setPersonality] = useState<Personality>("curious");
  const [colorPreference, setColorPreference] =
    useState<ColorPreference>("classic");
  const [selectedVariant, setSelectedVariant] = useState<1 | 2 | 3>(1);
  // 翻面 hero(随机一只)
  const [shuffleKey, setShuffleKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const filteredBreeds = useMemo(() => {
    if (filter === "all") return BREED_FEATURES;
    return BREED_FEATURES.filter((b) => b.category === filter);
  }, [filter]);

  // 随机翻牌:从全集里抽一个 + 3 个变体里挑 1
  const shufflePet = useMemo(() => {
    const idx = Math.floor(Math.random() * BREED_FEATURES.length);
    const pet = BREED_FEATURES[idx];
    const variants = getBreedVariants(pet.slug);
    const vIdx = Math.floor(Math.random() * variants.length);
    return { pet, variantUrl: variants[vIdx] };
    // shuffleKey 强制重算
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleKey]);

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
    setShowConfetti(true);
    setTimeout(() => {
      router.push("/profile");
    }, 1500);
  }

  return (
    <>
      {showConfetti && <Confetti count={50} />}
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

          <div className="relative max-w-5xl mx-auto px-3 sm:px-4 py-6 md:py-10">
            {/* 标题 */}
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brown-300/60 bg-oat-100/50 mb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-brown-600">
                  MUSEUM COLLECTION · No.052
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brown-900 mb-2 leading-tight">
                领养你的<span className="text-warm-brown">云宠物</span>
              </h1>
              <p className="text-sm md:text-base text-brown-700">
                从 {BREED_FEATURES.length} 个品种里挑一只,起个名字,养一辈子
              </p>
            </div>

            {/* 步骤指示器 */}
            <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2 transition-all min-h-[36px] min-w-[36px] ${
                      s === step
                        ? "border-warm-brown bg-warm-brown text-oat-50 shadow-md"
                        : s < step
                        ? "border-warm-brown bg-warm-brown text-oat-50"
                        : "border-brown-300 text-brown-500"
                    }`}
                  >
                    {s < step ? "✓" : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-10 md:w-14 h-0.5 ${
                        s < step ? "bg-warm-brown" : "bg-brown-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* ============ Step 1: 视觉大爆炸选宠 ============ */}
            {step === 1 && (
              <div className="space-y-5">
                {/* 顶部 2 个 action: 翻牌 + 当前 filter 计数 */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* 翻牌 hero */}
                  <button
                    onClick={() => setShuffleKey((k) => k + 1)}
                    className="group relative flex-1 min-w-[220px] overflow-hidden rounded-2xl border-2 border-warm-brown bg-gradient-to-br from-warm-brown/5 to-oat-100 hover:from-warm-brown/10 hover:to-warm-brown/5 transition-all shadow-md hover:shadow-lg"
                    aria-label="随机翻牌看一只"
                  >
                    <div className="flex items-center gap-3 p-3 sm:p-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-oat-200 border border-warm-brown/40 shrink-0">
                        <SafeImage
                          src={shufflePet.variantUrl}
                          alt={shufflePet.pet.breedZh}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-warm-brown mb-0.5">
                          翻牌 · Shuffle
                        </div>
                        <div className="font-serif text-base sm:text-lg font-bold text-brown-900 truncate">
                          {shufflePet.pet.breedZh}
                        </div>
                        <div className="font-mono text-[10px] text-brown-500 italic truncate">
                          {shufflePet.pet.breedEn}
                        </div>
                      </div>
                      <div className="shrink-0 text-warm-brown group-hover:rotate-180 transition-transform duration-500 text-2xl">
                        ↻
                      </div>
                    </div>
                    {/* hidden 真正的 selector — 点翻牌区任意位置就选这个 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectBreed(shufflePet.pet);
                      }}
                      className="absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-wider text-warm-brown hover:text-brown-900 px-2 py-1 rounded-full bg-warm-brown/10 hover:bg-warm-brown/20 transition-colors"
                    >
                      选它 →
                    </button>
                  </button>

                  {/* 计数 */}
                  <div className="text-xs text-brown-500 font-mono whitespace-nowrap">
                    显示 {filteredBreeds.length} / {BREED_FEATURES.length}
                  </div>
                </div>

                {/* 分类过滤 tab */}
                <div
                  role="tablist"
                  aria-label="品种分类"
                  className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0"
                >
                  {FILTERS.map((f) => (
                    <button
                      key={f.key}
                      role="tab"
                      aria-selected={filter === f.key}
                      onClick={() => setFilter(f.key)}
                      className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-serif text-sm border-2 transition-all min-h-[40px] ${
                        filter === f.key
                          ? "bg-warm-brown text-oat-50 border-warm-brown shadow-sm"
                          : "bg-oat-100/80 text-brown-700 border-brown-200 hover:border-warm-brown hover:text-warm-brown"
                      }`}
                    >
                      {f.emoji && <span aria-hidden>{f.emoji}</span>}
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>

                {/* 品种大图 grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredBreeds.map((b) => (
                    <PetCard
                      key={b.slug}
                      breed={b}
                      onClick={() => handleSelectBreed(b)}
                    />
                  ))}
                </div>

                {filteredBreeds.length === 0 && (
                  <div className="text-center py-12 text-brown-500">
                    这个分类下还没有品种
                  </div>
                )}
              </div>
            )}

            {/* ============ Step 2: Hero + 配置 ============ */}
            {step === 2 && selectedBreed && (
              <div className="space-y-5">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-sm text-brown-600 hover:text-warm-brown transition-colors px-3 py-1.5 rounded-full hover:bg-warm-brown/5"
                >
                  <span aria-hidden>←</span>
                  <span>重选品种</span>
                </button>

                {/* Hero: 大图 + 名字 + 基础信息 */}
                <div
                  className="rounded-2xl overflow-hidden border-2 border-warm-brown/40 shadow-lg bg-oat-50"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    {/* 大图 */}
                    <div className="relative aspect-square sm:aspect-auto sm:min-h-[360px] bg-gradient-to-br from-warm-brown/5 to-oat-200">
                      <SafeImage
                        src={getBreedVariants(selectedBreed.slug)[selectedVariant - 1]}
                        alt={`${selectedBreed.breedZh} 变体 ${selectedVariant}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-ink/80 text-oat font-mono text-[10px] uppercase tracking-wider">
                        v{selectedVariant} / 3
                      </div>
                    </div>

                    {/* 文字 */}
                    <div className="p-5 md:p-6 flex flex-col justify-center">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm-brown mb-1.5 flex items-center gap-2">
                        <span className="inline-block w-6 h-px bg-warm-brown" />
                        {CATEGORY_FULL[selectedBreed.category]}
                      </div>
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-brown-900 leading-tight mb-1">
                        {selectedBreed.breedZh}
                      </h2>
                      <p className="font-serif italic text-base text-brown-600 mb-4">
                        {selectedBreed.breedEn}
                      </p>
                      <p className="text-sm text-brown-700 leading-relaxed mb-4">
                        {selectedBreed.features}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 变体选择 */}
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <label className="text-sm font-medium text-brown-900">
                      选一只立绘
                    </label>
                    <span className="text-xs text-brown-500 font-mono">
                      (每个品种 3 张变体)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {getBreedVariants(selectedBreed.slug).map((url, idx) => {
                      const v = (idx + 1) as 1 | 2 | 3;
                      const isSelected = selectedVariant === v;
                      return (
                        <button
                          key={v}
                          onClick={() => setSelectedVariant(v)}
                          className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all min-h-[80px] ${
                            isSelected
                              ? "border-warm-brown ring-2 ring-warm-brown/30 scale-[0.98]"
                              : "border-brown-200 hover:border-warm-brown/60"
                          }`}
                        >
                          <SafeImage
                            src={url}
                            alt={`${selectedBreed.breedZh} 变体 v${v}`}
                            fill
                            sizes="(max-width: 640px) 30vw, 200px"
                            className="object-cover"
                          />
                          <div
                            className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-ink/75 text-oat font-mono text-[10px]"
                          >
                            v{v}
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-warm-brown text-oat-50 flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 名字 */}
                <div>
                  <label className="block text-sm font-medium text-brown-900 mb-2">
                    给它起个名字 <span className="text-warm-brown">*</span>
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
                          className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition-all min-h-[44px] ${
                            personality === p
                              ? "border-warm-brown bg-warm-brown text-oat-50 shadow-sm"
                              : "border-brown-300/60 bg-oat-50/60 text-brown-700 hover:border-warm-brown"
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
                          className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition-all min-h-[44px] ${
                            colorPreference === c
                              ? "border-warm-brown bg-warm-brown text-oat-50 shadow-sm"
                              : "border-brown-300/60 bg-oat-50/60 text-brown-700 hover:border-warm-brown"
                          }`}
                        >
                          {COLOR_LABEL[c]}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setStep(3)}
                  disabled={petName.trim().length < 2}
                  className="w-full py-3.5 rounded-lg bg-warm-brown text-oat-50 font-medium disabled:bg-brown-300 disabled:cursor-not-allowed hover:bg-brown-700 transition-colors shadow-md min-h-[48px] text-base"
                >
                  下一步 →
                </button>
              </div>
            )}

            {/* ============ Step 3: 确认 ============ */}
            {step === 3 && selectedBreed && (
              <div className="space-y-5">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-sm text-brown-600 hover:text-warm-brown transition-colors px-3 py-1.5 rounded-full hover:bg-warm-brown/5"
                >
                  <span aria-hidden>←</span>
                  <span>返回修改</span>
                </button>

                <div className="rounded-2xl overflow-hidden border-2 border-warm-brown/50 shadow-xl bg-oat-50">
                  <div className="relative aspect-square sm:aspect-[4/3] max-w-2xl mx-auto">
                    <SafeImage
                      src={getBreedVariants(selectedBreed.slug)[selectedVariant - 1]}
                      alt={petName || selectedBreed.breedZh}
                      fill
                      sizes="(max-width: 640px) 100vw, 672px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-ink/85 text-oat font-mono text-[10px] uppercase tracking-wider">
                      MUSEUM SPECIMEN · 2026
                    </div>
                  </div>
                  <div className="p-6 text-center border-t border-warm-brown/20">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-warm-brown mb-1">
                      这是你的云宠物
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 mb-1">
                      {petName}
                    </h2>
                    <p className="font-serif italic text-base text-brown-600">
                      {selectedBreed.breedZh} · {selectedBreed.breedEn}
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <InfoItem label="性格" value={PERSONALITY_LABEL[personality]} />
                  <InfoItem label="颜色" value={COLOR_LABEL[colorPreference]} />
                  <InfoItem label="变体" value={`v${selectedVariant} / 3`} />
                  <InfoItem label="编号" value={generatePreviewId(selectedBreed.slug)} />
                </dl>

                <button
                  onClick={handleConfirm}
                  className="w-full py-4 rounded-lg bg-warm-brown text-oat-50 font-bold text-base hover:bg-brown-700 transition-colors shadow-lg min-h-[52px]"
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

/* ------------------------------------------------------------------ */
/* 内部小组件                                                          */
/* ------------------------------------------------------------------ */

/** 品种大图卡片(Step 1 主体) */
function PetCard({
  breed,
  onClick,
}: {
  breed: BreedFeatures;
  onClick: () => void;
}) {
  const [v1] = getBreedVariants(breed.slug);
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-brown-200 bg-oat-100 hover:border-warm-brown hover:shadow-xl transition-all min-h-[200px] active:scale-[0.98]"
    >
      {/* 主体图 */}
      <div className="absolute inset-0">
        <SafeImage
          src={v1}
          alt={breed.breedZh}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
      </div>
      {/* 渐变底色 */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(45, 35, 22, 0.55) 100%)",
        }}
      />
      {/* 文字 */}
      <div className="absolute inset-x-0 bottom-0 p-3 text-left">
        <div className="font-serif text-base sm:text-lg font-bold text-oat-50 leading-tight drop-shadow-sm">
          {breed.breedZh}
        </div>
        <div className="font-mono text-[10px] italic text-oat-100/80 mt-0.5 truncate">
          {breed.breedEn}
        </div>
      </div>
      {/* hover 暖棕描边 + 微微外发光 */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
        style={{
          boxShadow: "inset 0 0 0 2px rgba(139, 111, 71, 0.6)",
        }}
      />
    </button>
  );
}

/** Step 3 确认页属性块 */
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg p-3 text-center"
      style={{
        background: "rgba(245, 233, 208, 0.6)",
        border: "1px solid rgba(139, 111, 71, 0.15)",
      }}
    >
      <div className="font-mono text-[10px] uppercase tracking-wider text-brown-500">
        {label}
      </div>
      <div className="font-serif text-sm font-medium text-brown-900 mt-1">
        {value}
      </div>
    </div>
  );
}

/** 从 slug 算个稳定的伪 specimen 编号 */
function generatePreviewId(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return `No.${String(Math.abs(h) % 999).padStart(3, "0")}`;
}
