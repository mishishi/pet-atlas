import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { HeaderWithSearch } from "@/components/nav/HeaderWithSearch";
import { CollectionCompleteModal } from "@/components/brand/CollectionCompleteModal";

const DEFAULT_OG = "/og/home.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://out-three-tan.vercel.app"),
  title: {
    default: "宠物大百科 · Pet Atlas",
    template: "%s · 宠物大百科",
  },
  description:
    "为爱宠收藏一整套图鉴 — 150 种动物的 vintage 标本卡图谱,犬、猫、小型哺乳、鸟、爬虫。每只宠物 6 张图谱 + 3 张立绘。",
  keywords: [
    "宠物",
    "宠物百科",
    "标本卡",
    "vintage",
    "犬",
    "猫",
    "仓鼠",
    "鹦鹉",
    "守宫",
    "图鉴",
    "云宠物",
  ],
  authors: [{ name: "Jason" }],
  applicationName: "宠物大百科",
  generator: "Next.js",
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://out-three-tan.vercel.app",
    siteName: "宠物大百科 · Pet Atlas",
    title: "宠物大百科 · Pet Atlas",
    description:
      "为爱宠收藏一整套图鉴 — 150 种动物的 vintage 标本卡图谱,每只 6 张图谱 + 3 张立绘。",
    images: [
      {
        url: DEFAULT_OG,
        width: 1200,
        height: 630,
        alt: "Pet Atlas — 150 种动物 vintage 标本卡图谱",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "宠物大百科 · Pet Atlas",
    description:
      "为爱宠收藏一整套图鉴 — 150 种动物的 vintage 标本卡图谱。",
    images: [DEFAULT_OG],
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#8B6F47",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`h-full antialiased ${fontVariables}`} suppressHydrationWarning>
      <head>
        {/* P2 polish: 主题初始化 (避免 FOUC)
         * 读 localStorage pet-atlas-theme, 默认跟随系统 prefers-color-scheme
         * 在 hydration 之前给 <html> 加 .dark class */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('pet-atlas-theme');
                  var sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored || (sysDark ? 'dark' : 'light');
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* JSON-LD: WebSite + Organization,搜索结果富媒体 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://out-three-tan.vercel.app/#website",
                  url: "https://out-three-tan.vercel.app",
                  name: "宠物大百科 · Pet Atlas",
                  description:
                    "为爱宠收藏一整套图鉴 — 150 种动物的 vintage 标本卡图谱。",
                  inLanguage: "zh-CN",
                  potentialAction: {
                    "@type": "SearchAction",
                    target:
                      "https://out-three-tan.vercel.app/pets?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": "https://out-three-tan.vercel.app/#org",
                  name: "Pet Atlas",
                  url: "https://out-three-tan.vercel.app",
                  sameAs: ["https://github.com/mishishi/pet-atlas"],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-oat-200 text-brown-900">
        {/* v0.9 polish: Header 移到 root layout (server) — 各 page 不再单独 import
         * 之前 register/login 是 client component 拉 Header,导致 pets.ts 的 fs 被拉进 client bundle
         * 现在 Header 是 server 渲染,search 数据在 root layout 准备一次 */}
        <HeaderWithSearch />
        {children}
        {/* P2 polish: 集齐 150 弹彩带 (跨过 150 阈值时触发, localStorage 防止重复) */}
        <CollectionCompleteModal />
        {/* PWA 安装引导 — 监听 beforeinstallprompt + iOS 手动引导 */}
        <PWAInstallPrompt />
        {/* Service Worker 注册 — PWA 离线能力 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch((err) => {
                    console.warn('[SW] register failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
