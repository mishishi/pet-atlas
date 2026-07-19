/**
 * web/lib/cloud-pet-urls.ts · 云宠物图片 URL 构造(纯函数)
 *
 * 云宠物图片路径:
 * - 本地: /cloud-pets/pool/{slug}-v{n}.png  (在 web/public/cloud-pets/pool/)
 * - TCB:  {NEXT_PUBLIC_CLOUD_PET_BASE_URL}/cloud-pets/pool/{slug}-v{n}.png
 *
 * 用法:
 *   import { buildCloudPetPoolUrl, isCloudPetTcbMode } from "@/lib/cloud-pet-urls";
 *   buildCloudPetPoolUrl("labrador-retriever", 1);
 */

const CLOUD_PET_BASE_URL = (
  process.env.NEXT_PUBLIC_CLOUD_PET_BASE_URL || ""
).replace(/\/$/, "");

/** 单个池子变体 URL(variantIndex 1-based) */
export function buildCloudPetPoolUrl(slug: string, variantIndex: number): string {
  const path = `/cloud-pets/pool/${slug}-v${variantIndex}.png`;
  return CLOUD_PET_BASE_URL
    ? `${CLOUD_PET_BASE_URL}${path}`
    : path;
}

/** 某品种全部 3 个变体 URL(预生成池固定 3 张/品种) */
export function getBreedVariants(slug: string): string[] {
  return [1, 2, 3].map((v) => buildCloudPetPoolUrl(slug, v));
}

/** TCB 模式判断 */
export function isCloudPetTcbMode(): boolean {
  return Boolean(CLOUD_PET_BASE_URL);
}
