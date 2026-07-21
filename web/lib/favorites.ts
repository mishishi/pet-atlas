/**
 * web/lib/favorites.ts · 收藏管理 (M3 polish · 2026-07-21)
 *
 * localStorage 存收藏品种 slug 列表
 * - 不依赖 userId(deviceId 关联,M3 加 userId 时可平滑迁移)
 * - storage 事件自动同步多 tab
 *
 * 同步到 TCB 留待 M3+ (个人版先不接)
 */

const KEY_FAVORITES = "pet-atlas:favorites:v1";

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readRaw(): string[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEY_FAVORITES);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((s) => typeof s === "string");
  } catch {
    return [];
  }
}

function writeRaw(slugs: string[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEY_FAVORITES, JSON.stringify(slugs));
    // 触发 storage 事件,让其他组件同步
    window.dispatchEvent(
      new StorageEvent("storage", { key: KEY_FAVORITES })
    );
  } catch {
    // 静默失败(localStorage 可能满了)
  }
}

export function getFavorites(): string[] {
  return readRaw();
}

export function isFavorite(slug: string): boolean {
  return readRaw().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  const cur = readRaw();
  let next: string[];
  let added: boolean;
  if (cur.includes(slug)) {
    next = cur.filter((s) => s !== slug);
    added = false;
  } else {
    next = [slug, ...cur]; // 新的放最前
    added = true;
  }
  writeRaw(next);
  return added;
}

export function getFavoritesCount(): number {
  return readRaw().length;
}
