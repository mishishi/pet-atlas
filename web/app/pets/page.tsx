/**
 * web/app/pets/page.tsx · 品种列表页 (server)
 *
 * Server component:从 content/pets 读取所有品种 (fs OK)
 * → 传给 <PetsBrowser> (client) 做实时搜索 + 分类筛选
 *
 * 为什么拆开:lib/pets.ts 用了 fs / path 只能在 server 跑;
 * 客户端 bundle 拉到 fs 会构建失败。
 *
 * Suspense 包裹原因:PetsBrowser 用了 useSearchParams() (?filter=favorites),
 * Next.js 16 + static export 要求 useSearchParams() 必须包在 <Suspense> 里,
 * 否则 build 报 'missing-suspense-with-csr-bailout'。
 */

import { Suspense } from "react";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { PetsBrowser } from "@/components/pets/PetsBrowser";
import { getAllPets } from "@/lib/pets";

function PetsBrowserFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="font-mono text-sm text-brown-500">载入品种列表…</div>
    </div>
  );
}

export default function PetsListPage() {
  const pets = getAllPets();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PetsBrowserFallback />}>
          <PetsBrowser pets={pets} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
