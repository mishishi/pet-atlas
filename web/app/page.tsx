/**
 * web/app/page.tsx · 主页
 *
 * 重设计 (2026-07-19 v2):
 * - 主页 hero 改为标本卡海报风格(参考 hero-poster 视觉稿)
 *   - 3 大画框(中前左右后错位)+ VINTAGE PAPER 飘带
 *   - 侧边植物图鉴(桉树/干花/薰衣草/多肉/谷穗)
 *   - 红色印章 "No. 051 / 050"
 *   - 罗马数字 I / II / III
 *   - 折痕纸背景
 * - 头部 overlay 在 hero 上方(透明)
 * - 下方 FeaturedBreeds + CategoryStrip 保持不变
 * - v0.8 polish: 加 CollectionPassport 段(在 SpecimenStats 跟 FeaturedBreeds 之间)
 */
// import { HeaderWithSearch as Header } from "@/components/nav/HeaderWithSearch"; // moved to root layout
import { Footer } from "@/components/nav/Footer";
import { HeroPoster } from "@/components/brand/HeroPoster";
import { SpecimenStats } from "@/components/brand/SpecimenStats";
import { FeaturedBreeds } from "@/components/brand/FeaturedBreeds";
import { CategoryStrip } from "@/components/brand/CategoryStrip";
import {
  CollectionPassport,
  type SpecimenStamp,
} from "@/components/brand/CollectionPassport";
import { getAllPets } from "@/lib/pets";

export default function Home() {
  const pets = getAllPets();
  const totalBreeds = pets.length;
  const totalPlates = totalBreeds * 6;
  const totalPortraits = totalBreeds * 3;

  // v0.8: 给 passport 准备 stamp 列表 (server-side 算好传到 client component)
  const specimens: SpecimenStamp[] = pets.map((p) => ({
    slug: p.slug,
    category: p.category,
    initial: (p.name.en?.charAt(0) || p.name.zh?.charAt(0) || "·").toUpperCase(),
    nameZh: p.name.zh,
  }));

  return (
    <>
      {/* Header 移到 root layout,这里不重复 */}
      <main>
        <HeroPoster />
        <SpecimenStats
          totalBreeds={totalBreeds}
          totalPlates={totalPlates}
          totalPortraits={totalPortraits}
        />
        {/* v0.8 polish: 收藏护照 (client component, 读 localStorage) */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-10">
          <div className="max-w-md mx-auto">
            <CollectionPassport specimens={specimens} />
          </div>
        </section>
        <FeaturedBreeds />
        <CategoryStrip />
      </main>
      <Footer />
    </>
  );
}
