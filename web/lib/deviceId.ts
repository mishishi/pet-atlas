/**
 * web/lib/deviceId.ts · 设备匿名 ID (M2.5 TCB 同步主键)
 *
 * 用途:
 * - 每台浏览器首次访问生成一个 UUID
 * - 存 localStorage,永不变
 * - TCB 数据库按 deviceId 分区,实现"匿名跨设备同步"
 *
 * M4 升级:
 * - 登录后,userId 绑到当前 deviceId(1:1)
 * - getOwnerId() 抽象返回 userId(若已登录并绑定) || deviceId
 * - 老 deviceId 数据保留,新数据自动走 userId
 */

import { getCurrentUser, getOwnerMapping, bindDeviceToCurrentUser } from "./auth";

// re-export for convenience
export { bindDeviceToCurrentUser };

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
  // 首次生成时,如果用户已登录,自动绑定
  if (getCurrentUser()) {
    bindDeviceToCurrentUser(fresh);
  }
  return fresh;
}

/**
 * 取当前数据主键(登录后用 userId,否则用 deviceId)
 * 登录 + 绑定后,所有数据走 userId
 */
export function getOwnerId(): string | null {
  const u = getCurrentUser();
  if (u) {
    const mapping = getOwnerMapping();
    if (mapping && mapping.userId === u.userId) {
      return mapping.userId; // user 模式
    }
  }
  return getDeviceId(); // 匿名 fallback
}

/** 强制重置 deviceId(调试用) */
export function resetDeviceId(): string | null {
  if (!isClient()) return null;
  localStorage.removeItem(KEY);
  return getDeviceId();
}

function generateDeviceId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
