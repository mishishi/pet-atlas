/**
 * web/lib/auth.ts · M4 用户系统 (客户端邮箱+密码)
 *
 * ⚠️ MVP 阶段:所有用户数据存 localStorage(模拟后端)
 * 后续会接 TCB `users` collection 做跨设备 sync
 *
 * 安全:
 * - 密码 PBKDF2-SHA256 100k iterations + per-user salt(浏览器 Web Crypto API)
 * - session token = base64url(random 32 bytes),无 JWT
 * - localStorage 隔离,不会被 XSS 偷到明文密码(只存 hash)
 *
 * 关联:
 * - 登录成功后,userId 绑到当前 deviceId(1:1)
 * - 旧 deviceId 数据保留,新数据走 userId
 * - getOwnerId() 抽象层统一返回 userId || deviceId
 */

const KEY_USERS = "pet-atlas:auth-users:v1";
const KEY_SESSION = "pet-atlas:auth-session:v1";
const KEY_OWNER = "pet-atlas:owner-mapping:v1";
const PBKDF2_ITERATIONS = 100_000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 天

/* ---------- types ---------- */

export interface User {
  userId: string;
  email: string;
  displayName: string;
  salt: string; // base64
  hash: string; // base64 (PBKDF2 derived)
  createdAt: number;
}

export interface Session {
  userId: string;
  token: string;
  expiresAt: number;
}

interface OwnerMapping {
  userId: string;
  deviceId: string;
  boundAt: number;
}

/* ---------- helpers ---------- */

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function fromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function randomToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return toBase64(arr.buffer);
}

/* ---------- password hashing ---------- */

async function pbkdf2(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
}

async function hashPassword(password: string): Promise<{ salt: string; hash: string }> {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const derivedBits = await pbkdf2(password, saltBytes);
  return { salt: toBase64(saltBytes.buffer), hash: toBase64(derivedBits) };
}

async function verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
  const saltBytes = fromBase64(salt);
  const derivedBits = await pbkdf2(password, saltBytes);
  const computed = toBase64(derivedBits);
  return constantTimeEqual(computed, expectedHash);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ---------- user store (localStorage) ---------- */

function readUsers(): User[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEY_USERS);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}

function writeUsers(users: User[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  } catch {}
}

/* ---------- session ---------- */

function readSession(): Session | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(KEY_SESSION);
    if (!raw) return null;
    const s: Session = JSON.parse(raw);
    if (s.expiresAt < Date.now()) {
      localStorage.removeItem(KEY_SESSION);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

function writeSession(s: Session | null): void {
  if (!isClient()) return;
  if (!s) {
    localStorage.removeItem(KEY_SESSION);
    return;
  }
  try {
    localStorage.setItem(KEY_SESSION, JSON.stringify(s));
  } catch {}
}

/* ---------- owner mapping (userId -> deviceId) ---------- */

function readOwner(): OwnerMapping | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(KEY_OWNER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeOwner(m: OwnerMapping | null): void {
  if (!isClient()) return;
  if (!m) {
    localStorage.removeItem(KEY_OWNER);
    return;
  }
  try {
    localStorage.setItem(KEY_OWNER, JSON.stringify(m));
  } catch {}
}

/* ---------- public API ---------- */

export function isAuthAvailable(): boolean {
  if (!isClient()) return false;
  return typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined";
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getCurrentUser(): User | null {
  const s = readSession();
  if (!s) return null;
  const users = readUsers();
  return users.find((u) => u.userId === s.userId) ?? null;
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

/** 注册: 邮箱 + 密码 + 显示名 */
export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  if (!isAuthAvailable()) return { ok: false, error: "浏览器不支持加密" };
  email = email.trim().toLowerCase();
  displayName = displayName.trim();
  if (!isValidEmail(email)) return { ok: false, error: "邮箱格式不对" };
  if (password.length < 6) return { ok: false, error: "密码至少 6 位" };
  if (displayName.length < 1) return { ok: false, error: "请输入显示名" };
  if (displayName.length > 20) return { ok: false, error: "显示名太长 (≤20)" };

  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "该邮箱已注册" };
  }

  const { salt, hash } = await hashPassword(password);
  const user: User = {
    userId: uuid(),
    email,
    displayName,
    salt,
    hash,
    createdAt: Date.now(),
  };
  writeUsers([...users, user]);

  // 立即开 session
  const session: Session = {
    userId: user.userId,
    token: randomToken(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  writeSession(session);

  return { ok: true, user };
}

/** 登录: 邮箱 + 密码 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  if (!isAuthAvailable()) return { ok: false, error: "浏览器不支持加密" };
  email = email.trim().toLowerCase();
  const users = readUsers();
  const u = users.find((x) => x.email === email);
  if (!u) return { ok: false, error: "邮箱未注册" };

  const ok = await verifyPassword(password, u.salt, u.hash);
  if (!ok) return { ok: false, error: "密码错" };

  writeSession({
    userId: u.userId,
    token: randomToken(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  return { ok: true, user: u };
}

/** 登出 */
export function logoutUser(): void {
  writeSession(null);
}

/** 把当前 deviceId 绑到当前 user(如果未登录则 no-op) */
export function bindDeviceToCurrentUser(deviceId: string): boolean {
  const u = getCurrentUser();
  if (!u) return false;
  writeOwner({ userId: u.userId, deviceId, boundAt: Date.now() });
  return true;
}

/** 解除绑定(解绑后数据回到 deviceId 模式) */
export function unbindDevice(): void {
  writeOwner(null);
}

export function getOwnerMapping(): OwnerMapping | null {
  return readOwner();
}

/** 订阅 session 变化(登出/登录时触发) */
export function onAuthChange(fn: (user: User | null) => void): () => void {
  if (!isClient()) return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === KEY_SESSION || e.key === KEY_USERS) fn(getCurrentUser());
  };
  window.addEventListener("storage", handler);
  // 同一 tab 内手动 dispatch
  const local = () => fn(getCurrentUser());
  window.addEventListener("pet-atlas-auth-change", local as EventListener);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("pet-atlas-auth-change", local as EventListener);
  };
}

export function notifyAuthChange(): void {
  if (!isClient()) return;
  window.dispatchEvent(new Event("pet-atlas-auth-change"));
}
