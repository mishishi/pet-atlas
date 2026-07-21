/**
 * web/app/pets/page.tsx · 品种列表页 (server)
 *
 * Server component:从 content/pets 读取所有品种 (fs OK)
 * → 传给 <PetsBrowser> (client) 做实时搜索 + 分类筛选
 *
 * 为什么拆开:lib/pets.ts 用了 fs / path 只能在 server 跑;
 * 客户端 bundle 拉到 fs 会构建失败。
 */

import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { PetsBrowser } from "@/components/pets/PetsBrowser";
import { getAllPets } from "@/lib/pets";

export default function PetsListPage() {
  const pets = getAllPets();

  return (
    <>
      <Header />
      <main className="flex-1">
        <PetsBrowser pets={pets} />
      </main>
      <Footer />
    </>
  );
}
