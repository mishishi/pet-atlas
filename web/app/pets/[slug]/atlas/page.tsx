import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAllPets, getBreedAtlas, getPetBySlug, hasBreedAtlas } from "@/lib/pets";
import AtlasViewer from "./AtlasViewer";

/** 预渲染所有有图谱的品种 slug(动态扫描 public/) */
export function generateStaticParams() {
  return getAllPets()
    .filter((p) => hasBreedAtlas(p.slug))
    .map((p) => ({ slug: p.slug }));
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
      <AtlasViewer slug={slug} nameZh={pet.name.zh} gallery={atlas.gallery} />
    </Suspense>
  );
}
