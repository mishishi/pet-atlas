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
 */
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { HeroPoster } from "@/components/brand/HeroPoster";
import { SpecimenStats } from "@/components/brand/SpecimenStats";
import { FeaturedBreeds } from "@/components/brand/FeaturedBreeds";
import { CategoryStrip } from "@/components/brand/CategoryStrip";

export default function Home() {
  return (
    <>
      {/* 主页专用:透明 overlay header,叠加在 hero 海报上 */}
      <Header variant="overlay" />
      <main>
        <HeroPoster />
        <SpecimenStats />
        <FeaturedBreeds />
        <CategoryStrip />
      </main>
      <Footer />
    </>
  );
}
