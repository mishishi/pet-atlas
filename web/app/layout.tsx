import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "宠物大百科",
  description: "为爱宠收藏一整套图鉴 — 拉布拉多、英短与更多品种的 6 页知识图谱。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-oat text-ink">{children}</body>
    </html>
  );
}
