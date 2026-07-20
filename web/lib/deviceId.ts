/**
 * web/lib/deviceId.ts · 设备匿名 ID (M2.5 TCB 同步主键)
 *
 * 用途:
 * - 每台浏览器首次访问生成一个 UUID
 * - 存 localStorage,永不变
 * - TCB 数据库按 deviceId 分区,实现"匿名跨设备同步"
 *
 * 升级路径:
 * - 未来上 OAuth 登录时,把 deviceId 绑到 userId
 * - 数据迁移:userId 登录后,把 deviceId 名下的记录复制到 userId 下
 * - 旧数据保留,新数据走 userId
 */

const KEY = "pet-atlas:device-id:v1";

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/** 读 deviceId(若没有则生成并存入) */
export function getDeviceId(): string | null {
  if (!isClient()) return null;
  const existing = localStorage.getItem(KEY);
  if (existing) return existing;
  const fresh = generateDeviceId();
  try {
    localStorage.setItem(KEY, fresh);
  } catch (err) {
    console.warn("[deviceId] 写入失败", err);
    return null;
  }
  return fresh;
}

/** 强制重置(调试用,M3 加 OAuth 迁移时也会用到) */
export function resetDeviceId(): string | null {
  if (!isClient()) return null;
  localStorage.removeItem(KEY);
  return getDeviceId();
}

function generateDeviceId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: 32-char base36 from time + random
  return `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
