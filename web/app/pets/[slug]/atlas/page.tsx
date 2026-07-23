import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllPets, getBreedAtlas, getPetBySlug, hasBreedAtlas } from "@/lib/pets";
import AtlasViewer from "./AtlasViewer";

/** 预渲染所有有图谱的品种 slug(动态扫描 public/) */
export function generateStaticParams() {
  return getAllPets()
    .filter((p) => hasBreedAtlas(p.slug))
    .map((p) => ({ slug: p.slug }));
}

/** Per-atlas OG meta — 分享 atlas 链接时显示文字版 OG (跟 AtlasTextCard 视觉一致) */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pet = getPetBySlug(slug);
  if (!pet) return {};
  const title = `${pet.name.zh} · 6 页图鉴 · Pet Atlas`;
  const description = `${pet.name.zh} 的 6 页 vintage 标本卡图鉴 —— 性格雷达、6 维评分、性格标签。文字版 Atlas 体验。`;
  // 用预生成的文字版 OG image (build-og-text.mjs prebuild)
  const ogImage = `/og/${slug}-text.png`;
  return {
    title,
    description,
    alternates: {
      canonical: `/pets/${slug}/atlas`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `https://out-three-tan.vercel.app/pets/${slug}/atlas`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${pet.name.zh} 性格雷达图鉴`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function AtlasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pet = getPetBySlug(slug);
  if (!pet) notFound();

  const atlas = getBreedAtlas(slug);
  if (!atlas) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen bg-oat" />}>
      <AtlasViewer
        slug={slug}
        nameZh={pet.name.zh}
        nameEn={pet.name.en}
        gallery={atlas.gallery}
        personality={pet.personality}
        history={pet.history?.timeline}
        famous={pet.famous}
      />
    </Suspense>
  );
}
