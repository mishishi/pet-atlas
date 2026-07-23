/**
 * web/lib/favorites.ts · 收藏管理 (M4 stage 2.5)
 *
 * localStorage 主 + TCB 跨设备同步
 * - write: localStorage 即时 → 防抖 2s 后 fire-and-forget push TCB
 * - read 入口: 客户端组件首次 mount 时,如果 TCB 有更新版本,merge 到 localStorage
 *
 * 升级路径:
 * - M4 stage 1 已用 _openid 主键,user / device 模式兼容
 */

const KEY_FAVORITES = "pet-atlas:favorites:v1";
const SYNC_DEBOUNCE_MS = 2000;

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

let _syncTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSync(): void {
  if (!isClient()) return;
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(() => {
    _syncTimer = null;
    import("./tcbSync")
      .then((m) => m.pushFavoritesToTcb?.(readRaw()))
      .catch(() => {});
  }, SYNC_DEBOUNCE_MS);
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
  scheduleSync(); // 跨设备同步(防抖)
  return added;
}

export function getFavoritesCount(): number {
  return readRaw().length;
}

/**
 * 首次 mount 拉一次(让其他设备的数据回流)
 * - TCB 有 → 跟 localStorage 合并(取并集,新加的放前面)
 * - TCB 无 → push 当前 localStorage 上传
 *
 * 调用方:AuthMenu / ProfilePage 等 client component mount 时
 */
export async function syncFavoritesFromCloud(): Promise<void> {
  if (!isClient()) return;
  try {
    const m = await import("./tcbSync");
    const remote = await m.fetchFavoritesFromTcb?.();
    if (remote == null) {
      // TCB 还没记录,push 当前 localStorage 上去
      const local = readRaw();
      if (local.length > 0) {
        await m.pushFavoritesToTcb?.(local);
      }
      return;
    }
    // 合并:取并集(新加的优先)
    const local = readRaw();
    const merged = mergeFavorites(local, remote);
    if (JSON.stringify(merged) !== JSON.stringify(local)) {
      writeRaw(merged);
    }
  } catch (err) {
    console.warn("[favorites] sync from cloud 失败", err);
  }
}

function mergeFavorites(a: string[], b: string[]): string[] {
  const set = new Set<string>();
  const result: string[] = [];
  // a 在前(本地最新),b 在后(云端)
  for (const s of [...a, ...b]) {
    if (!set.has(s)) {
      set.add(s);
      result.push(s);
    }
  }
  return result;
}
