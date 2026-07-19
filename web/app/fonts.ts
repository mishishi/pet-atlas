/**
 * web/app/fonts.ts
 *
 * pet-atlas 设计系统字体(全 Google Fonts,自动 CDN + 自托管 subset):
 * - Noto Serif SC (中文衬线,所有 display + 中文标题)
 * - Noto Sans SC (中文无衬线,正文)
 * - JetBrains Mono (数字 / 标签 / 标本编号)
 *
 * CSS 变量: --font-serif / --font-sans / --font-mono
 * 在 globals.css @theme inline 里引用。
 */

import { Noto_Serif_SC, Noto_Sans_SC, JetBrains_Mono } from "next/font/google";

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-serif-sc",
  preload: true,
  fallback: ["Songti SC", "STSong", "Georgia", "serif"],
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-sc",
  preload: true,
  fallback: [
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "system-ui",
    "sans-serif",
  ],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: true,
  fallback: ["SF Mono", "Menlo", "Consolas", "monospace"],
});

export const fontVariables = [
  notoSerifSC.variable,
  notoSansSC.variable,
  jetbrainsMono.variable,
].join(" ");
