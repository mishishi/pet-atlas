/**
 * web/app/fonts.ts · vintage 标本卡字体系统 (v1.2)
 *
 * 设计目标:博物馆标本卡 (18-19 世纪老印刷机风) + 治愈水彩
 *
 * 字体组合:
 * - IM Fell English  — 拉丁/英文 display (18 世纪印刷机, 老博物馆标签)
 * - Noto Serif SC    — 中文 display + body 衬线 (像老书/标本说明卡)
 * - Special Elite    — 数字/标签/编号 (打字机风, 标本卡盖章)
 * - 不再用 Noto Sans SC (太现代) 和 JetBrains Mono (太程序员)
 *
 * CSS 变量: --font-serif / --font-sans / --font-mono
 * 在 globals.css @theme inline 里引用。
 */

import {
  IM_Fell_English,
  IM_Fell_English_SC,
  Noto_Serif_SC,
  Special_Elite,
} from "next/font/google";

/** 拉丁/英文 display — 18 世纪印刷机,老博物馆标签 */
const imFellEnglish = IM_Fell_English({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-im-fell-english",
  preload: true,
  fallback: ["Garamond", "Times New Roman", "serif"],
});

/** IM Fell English SC — 拉丁 small caps 变体 (用于 specimen number) */
const imFellEnglishSC = IM_Fell_English_SC({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-im-fell-english-sc",
  preload: true,
  fallback: ["Garamond", "Times New Roman", "serif"],
});

/** 中文 display + body 衬线 (Noto Serif SC) */
const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-serif-sc",
  preload: true,
  fallback: ["Songti SC", "STSong", "STHeiti", "Georgia", "serif"],
});

/** 数字/标签/编号 — 打字机风 */
const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-special-elite",
  preload: true,
  fallback: ["Courier New", "Courier", "monospace"],
});

export const fontVariables = [
  imFellEnglish.variable,
  imFellEnglishSC.variable,
  notoSerifSC.variable,
  specialElite.variable,
].join(" ");
