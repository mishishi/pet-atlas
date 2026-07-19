import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";

const DEFAULT_OG = "https://636c-cloud1-d9gv1q8ikad5e9721-1442530204.tcb.qcloud.la/pet-atlas/atlas/dog/golden-retriever/01-cover.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://out-three-tan.vercel.app"),
  title: {
    default: "宠物大百科 · Pet Atlas",
    template: "%s · 宠物大百科",
  },
  description:
    "为爱宠收藏一整套图鉴 — 51 种动物的 vintage 标本卡图谱,犬、猫、小型哺乳、鸟、爬虫。",
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
  ],
  authors: [{ name: "Jason" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://out-three-tan.vercel.app",
    siteName: "宠物大百科 · Pet Atlas",
    title: "宠物大百科 · Pet Atlas",
    description:
      "为爱宠收藏一整套图鉴 — 51 种动物的 vintage 标本卡图谱。",
    images: [
      {
        url: DEFAULT_OG,
        width: 1536,
        height: 2752,
        alt: "Pet Atlas — 51 种动物 vintage 标本卡图谱",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "宠物大百科 · Pet Atlas",
    description:
      "为爱宠收藏一整套图鉴 — 51 种动物的 vintage 标本卡图谱。",
    images: [DEFAULT_OG],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`h-full antialiased ${fontVariables}`}
    >
      <body className="min-h-full flex flex-col bg-oat-200 text-brown-900">
        {children}
      </body>
    </html>
  );
}
