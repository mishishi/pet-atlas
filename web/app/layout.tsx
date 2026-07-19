import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: "宠物大百科 · Pet Atlas",
  description:
    "为爱宠收藏一整套图鉴 — 50 种动物的 vintage 标本卡图谱,犬、猫、小型哺乳、鸟、爬虫。",
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
