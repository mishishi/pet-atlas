/**
 * web/lib/tcbSync.ts · TCB 数据库同步适配器 (M2.5)
 *
 * 策略:last-write-wins
 * - 写: localStorage 即时 → fire-and-forget TCB (失败容忍,下次拉新覆盖)
 * - 读: localStorage 优先 → 拉 TCB → 若 TCB 较新,合并到 localStorage
 * - 冲突: TCB record._updateTime vs localStorage record.lastUpdatedAt
 *        取较新的那个
 *
 * 数据集合结构 (TCB):
 * - pet_stats
 *   { _id, deviceId, hunger, energy, happiness, lastFedAt,
 *     lastPlayedAt, lastRestedAt, lastUpdatedAt, _updateTime }
 * - cloud_pets
 *   { _id, deviceId, petId, petName, breedSlug, breedZh, breedCategory,
 *     personality, colorPreference, variantIndex, tcbUrl,
 *     createdAt, _updateTime }
 *
 * deviceId 作为查询主键(每个设备只存一条自己的记录)
 *
 * 升级路径: 未来加 userId 时,改 where 条件为 { $or: [{deviceId}, {userId}] } 即可
 */

import { getDeviceId } from "./deviceId";
import { getDatabase, isTcbConfigured } from "./tcb";
import type { PetStats } from "./petStats";
import type { CloudPet } from "./cloudPet";

/** 同步状态(给 UI 用) */
export type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";

let _status: SyncStatus = "idle";
const _listeners = new Set<(s: SyncStatus) => void>();

export function getSyncStatus(): SyncStatus {
  return _status;
}

export function onSyncStatusChange(fn: (s: SyncStatus) => void): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function setStatus(s: SyncStatus) {
  if (_status === s) return;
  _status = s;
  for (const fn of _listeners) {
    try {
      fn(s);
    } catch (err) {
      console.warn("[tcbSync] listener 失败", err);
    }
  }
}

// ===== 内部:统一 try wrapper =====

async function tryDb() {
  if (!isTcbConfigured()) return null;
  try {
    const db = await getDatabase();
    return db;
  } catch (err) {
    console.warn("[tcbSync] db 失败", err);
    return null;
  }
}

// ===== pet_stats 同步 =====

/**
 * 拉取 TCB 上的 pet_stats(按 deviceId)
 * 返回 null 表示: TCB 没配/没记录/失败
 */
export async function fetchPetStatsFromTcb(): Promise<PetStats | null> {
  const db = await tryDb();
  if (!db) return null;
  const deviceId = getDeviceId();
  if (!deviceId) return null;
  try {
    const res = await db
      .collection("pet_stats")
      .where({ deviceId })
      .limit(1)
      .get();
    const list = res?.data || [];
    if (list.length === 0) return null;
    const r = list[0];
    return {
      hunger: r.hunger,
      energy: r.energy,
      happiness: r.happiness,
      lastFedAt: r.lastFedAt || 0,
      lastPlayedAt: r.lastPlayedAt || 0,
      lastRestedAt: r.lastRestedAt || 0,
      lastUpdatedAt: r.lastUpdatedAt || 0,
    };
  } catch (err) {
    console.warn("[tcbSync] fetch pet_stats 失败", err);
    return null;
  }
}

/**
 * 上传 pet_stats 到 TCB
 * 智能 upsert: 已有 deviceId 记录则 update,否则 add
 */
export async function pushPetStatsToTcb(stats: PetStats): Promise<boolean> {
  const db = await tryDb();
  if (!db) return false;
  const deviceId = getDeviceId();
  if (!deviceId) return false;
  try {
    setStatus("syncing");
    // 先查 _id(若有则 update,若无则 add)
    const existing = await db
      .collection("pet_stats")
      .where({ deviceId })
      .limit(1)
      .get();
    const payload = {
      deviceId,
      hunger: stats.hunger,
      energy: stats.energy,
      happiness: stats.happiness,
      lastFedAt: stats.lastFedAt,
      lastPlayedAt: stats.lastPlayedAt,
      lastRestedAt: stats.lastRestedAt,
      lastUpdatedAt: stats.lastUpdatedAt,
    };
    if (existing?.data?.length > 0) {
      const id = existing.data[0]._id;
      await db.collection("pet_stats").doc(id).update(payload);
    } else {
      await db.collection("pet_stats").add(payload);
    }
    setStatus("synced");
    return true;
  } catch (err) {
    console.warn("[tcbSync] push pet_stats 失败", err);
    setStatus("error");
    return false;
  }
}

// ===== cloud_pets 同步 =====

export async function fetchCloudPetFromTcb(): Promise<CloudPet | null> {
  const db = await tryDb();
  if (!db) return null;
  const deviceId = getDeviceId();
  if (!deviceId) return null;
  try {
    const res = await db
      .collection("cloud_pets")
      .where({ deviceId })
      .limit(1)
      .get();
    const list = res?.data || [];
    if (list.length === 0) return null;
    const r = list[0];
    return {
      petId: r.petId,
      breedSlug: r.breedSlug,
      breedZh: r.breedZh,
      breedCategory: r.breedCategory,
      petName: r.petName,
      personality: r.personality,
      colorPreference: r.colorPreference,
      variantIndex: r.variantIndex,
      tcbUrl: r.tcbUrl,
      createdAt: r.createdAt,
    };
  } catch (err) {
    console.warn("[tcbSync] fetch cloud_pets 失败", err);
    return null;
  }
}

export async function pushCloudPetToTcb(pet: CloudPet): Promise<boolean> {
  const db = await tryDb();
  if (!db) return false;
  const deviceId = getDeviceId();
  if (!deviceId) return false;
  try {
    setStatus("syncing");
    const existing = await db
      .collection("cloud_pets")
      .where({ deviceId })
      .limit(1)
      .get();
    const payload = {
      deviceId,
      petId: pet.petId,
      breedSlug: pet.breedSlug,
      breedZh: pet.breedZh,
      breedCategory: pet.breedCategory,
      petName: pet.petName,
      personality: pet.personality,
      colorPreference: pet.colorPreference,
      variantIndex: pet.variantIndex,
      tcbUrl: pet.tcbUrl,
      createdAt: pet.createdAt,
    };
    if (existing?.data?.length > 0) {
      const id = existing.data[0]._id;
      await db.collection("cloud_pets").doc(id).update(payload);
    } else {
      await db.collection("cloud_pets").add(payload);
    }
    setStatus("synced");
    return true;
  } catch (err) {
    console.warn("[tcbSync] push cloud_pets 失败", err);
    setStatus("error");
    return false;
  }
}

export async function deleteCloudPetFromTcb(): Promise<boolean> {
  const db = await tryDb();
  if (!db) return false;
  const deviceId = getDeviceId();
  if (!deviceId) return false;
  try {
    const existing = await db
      .collection("cloud_pets")
      .where({ deviceId })
      .limit(1)
      .get();
    if (existing?.data?.length > 0) {
      const id = existing.data[0]._id;
      await db.collection("cloud_pets").doc(id).remove();
    }
    return true;
  } catch (err) {
    console.warn("[tcbSync] delete cloud_pets 失败", err);
    return false;
  }
}

// ===== 在线/离线检测 =====

let _onlineHandler: (() => void) | null = null;
let _offlineHandler: (() => void) | null = null;

export function setupNetworkListeners(): void {
  if (typeof window === "undefined") return;
  if (_onlineHandler) return; // already setup
  _onlineHandler = () => setStatus("idle");
  _offlineHandler = () => setStatus("offline");
  window.addEventListener("online", _onlineHandler);
  window.addEventListener("offline", _offlineHandler);
  // 初始化
  setStatus(navigator.onLine === false ? "offline" : "idle");
}

export function teardownNetworkListeners(): void {
  if (typeof window === "undefined") return;
  if (_onlineHandler) window.removeEventListener("online", _onlineHandler);
  if (_offlineHandler) window.removeEventListener("offline", _offlineHandler);
  _onlineHandler = null;
  _offlineHandler = null;
}
