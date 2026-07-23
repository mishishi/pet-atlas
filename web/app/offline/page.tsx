/**
 * web/app/offline/page.tsx · 离线 fallback 页
 */

import Link from "next/link";

export const metadata = {
  title: "离线 · 宠物大百科",
  description: "当前没有网络连接,请检查 Wi-Fi 或移动数据。",
};

export default function OfflinePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        background: "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 100%)",
      }}
    >
      <div className="text-center max-w-md">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-brick mb-3">
          Offline · 离线
        </div>
        <h1
          className="font-serif font-bold text-brown-900 leading-tight mb-4"
          style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
        >
          当前没有网络
          <br />
          <span className="text-brick italic">离线模式</span>
        </h1>
        <p className="font-serif text-brown-700 mb-8 leading-relaxed">
          你浏览过的图谱已经缓存到本地,可以从下方入口继续翻阅。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-[var(--radius)] font-medium bg-brown-700 text-oat-100 hover:bg-brown-800 transition-all"
          >
            返回首页
          </Link>
          <Link
            href="/pets"
            className="px-6 py-3 rounded-[var(--radius)] font-medium bg-transparent text-brown-700 border border-brown-400 hover:bg-brown-50 transition-all"
          >
            浏览图鉴
          </Link>
        </div>
      </div>
    </main>
  );
}
