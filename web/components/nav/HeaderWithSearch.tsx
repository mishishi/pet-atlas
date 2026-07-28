/**
 * web/components/nav/HeaderWithSearch.tsx · Header server wrapper
 *
 * v0.9 polish:统一在 server 端 prep search 数据,避免 client component 链路拉 pets.ts
 *
 * 用法 (跟之前一样):
 *   <HeaderWithSearch variant="default" />
 */

import { getSearchPets } from "@/lib/search-pets";
import { Header } from "./Header";

export function HeaderWithSearch({
  variant,
}: {
  variant?: "default" | "overlay";
}) {
  const searchPets = getSearchPets();
  return <Header variant={variant} searchPets={searchPets} />;
}
