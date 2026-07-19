/**
 * web/app/page.tsx · 主页
 *
 * 重设计 (2026-07-19):
 * - HeroEditorial (大标题 + 3 张大封面 + CTA)
 * - FeaturedBreeds (精选 4 个品种)
 * - CategoryStrip (5 个分类入口)
 * - Footer
 */
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { HeroEditorial } from "@/components/brand/HeroEditorial";
import { FeaturedBreeds } from "@/components/brand/FeaturedBreeds";
import { CategoryStrip } from "@/components/brand/CategoryStrip";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroEditorial />
        <FeaturedBreeds />
        <CategoryStrip />
      </main>
      <Footer />
    </>
  );
}
