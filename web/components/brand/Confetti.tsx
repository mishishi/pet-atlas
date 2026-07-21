/**
 * web/components/brand/Confetti.tsx · 庆祝粒子(纯 CSS 实现)
 *
 * M3 polish · 2026-07-21
 *
 * 不依赖外部库,使用纯 CSS 动画 + 随机方向。
 *
 * 用法:
 *   <Confetti count={40} />  // 撒 40 个粒子,自动 2.5s 后消失
 */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";

// 暖色调的标本卡配色
const COLORS = [
  "#A44A3F", // brick
  "#C9A14A", // amber
  "#8B6F47", // warm brown
  "#A8C5A0", // mint
  "#C68A8A", // rose
  "#4A5D3A", // forest
];

interface Piece {
  id: number;
  startX: number; // 0-100% 相对容器
  startY: number;
  tx: number; // 终点 x 偏移
  ty: number; // 终点 y 偏移
  rot: number; // 旋转角度
  duration: number; // 秒
  delay: number; // 秒
  width: number;
  height: number;
  color: string;
}

export function Confetti({ count = 40 }: { count?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [visible, setVisible] = useState(true);
  const counterRef = useRef(0);

  const fire = useCallback(() => {
    counterRef.current += 1;
    const runId = counterRef.current;
    const newPieces: Piece[] = Array.from({ length: count }, () => ({
      id: Math.random(),
      startX: 50 + (Math.random() - 0.5) * 20, // 中间 ±10%
      startY: 50 + (Math.random() - 0.5) * 10,
      tx: (Math.random() - 0.5) * 600, // 横向散开
      ty: 200 + Math.random() * 400, // 向下落
      rot: (Math.random() - 0.5) * 720,
      duration: 1.2 + Math.random() * 0.8,
      delay: Math.random() * 0.2,
      width: 6 + Math.random() * 8,
      height: 10 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setPieces(newPieces);
    setVisible(true);
    // 2.5s 后自动卸载
    setTimeout(() => {
      if (counterRef.current === runId) setVisible(false);
    }, 2500);
  }, [count]);

  // 首次 mount 触发
  useEffect(() => {
    fire();
  }, [fire]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={
            {
              "--startX": `${p.startX}%`,
              "--startY": `${p.startY}%`,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              "--rot": `${p.rot}deg`,
              "--w": `${p.width}px`,
              "--h": `${p.height}px`,
              "--color": p.color,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
