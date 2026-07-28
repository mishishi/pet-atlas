/**
 * web/lib/daily-pick.ts · server-only 今日份 hash 工具
 *
 * 用日期做 seed 算一个稳定的 slug,所有人今天看到的同一个。
 * (注意:不是"当天第一个访问的人决定",而是按日期确定 — 命运之选)
 *
 * Server-only (不要在 client component import,会触发 "client function from server" 错误)
 */

/** 字符串 hash → unsigned int */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** 今日 hash → slug (从候选里选一个) */
export function getTodaySlug(slugs: string[]): string {
  if (slugs.length === 0) return "";
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return slugs[hashStr(dateStr) % slugs.length];
}

/** 今日日期 (YYYY-MM-DD) for display */
export function getTodayDate(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}
