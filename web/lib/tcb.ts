/**
 * web/lib/tcb.ts · 腾讯云 CloudBase (TCB) 浏览器 SDK 封装
 *
 * 用途:
 * - M2.5+ 把 localStorage 数据备份到 TCB 数据库,实现匿名跨设备同步
 * - 静态站 (output: export) 唯一可用方案 = 浏览器匿名 auth + Web SDK
 *
 * 工作流:
 * 1. getAuth() 懒加载 SDK(只在客户端)
 * 2. 第一次调用时 init,匿名 signIn
 * 3. 后续调用复用同一 app
 *
 * 环境变量:
 * - NEXT_PUBLIC_TCB_ENV_ID    TCB envId(控制台拿)
 *                            若未设,所有 sync 操作都 no-op,localStorage 继续工作
 *
 * 数据集合 (需在 TCB 控制台预先创建):
 * - pet_stats                 键: deviceId
 * - cloud_pets                键: deviceId
 *
 * 重要: 避免顶层 import "@cloudbase/js-sdk",会导致 Next.js SSR 时拉 Node 版
 * (带 ws/web-streams-polyfill polyfill),浏览器 bundle 报错。必须 dynamic import。
 */

const TCB_ENV_ID = process.env.NEXT_PUBLIC_TCB_ENV_ID || "";

let appPromise: Promise<any> | null = null;

/** 是否配了 envId(没配就走纯 localStorage 模式) */
export function isTcbConfigured(): boolean {
  return Boolean(TCB_ENV_ID);
}

/**
 * 拿已 init 的 CloudBase app(单例,懒加载)
 * SSR 时返回 null(只在 client 端能跑)
 */
async function getApp(): Promise<any | null> {
  if (!isTcbConfigured()) return null;
  if (typeof window === "undefined") return null; // SSR guard
  if (appPromise) return appPromise;

  appPromise = (async () => {
    try {
      // 动态 import 避免 SSR 时拉 Node 版
      const { default: cloudbase } = await import("@cloudbase/js-sdk");
      const a = cloudbase.init({ env: TCB_ENV_ID });
      // 立即匿名登录
      const auth = a.auth();
      const loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.signInAnonymously();
      }
      return a;
    } catch (err) {
      console.warn("[tcb] init/auth 失败:", err);
      appPromise = null; // 下次重试
      return null;
    }
  })();
  return appPromise;
}

/** 拿 database 实例(供 sync 层使用) */
export async function getDatabase(): Promise<any | null> {
  const a = await getApp();
  if (!a) return null;
  try {
    return a.database();
  } catch (err) {
    console.warn("[tcb] database 失败:", err);
    return null;
  }
}

/** 重置 SDK 状态(调试用) */
export function resetTcb(): void {
  appPromise = null;
}
