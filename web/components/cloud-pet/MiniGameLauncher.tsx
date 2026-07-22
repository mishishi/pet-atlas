/**
 * web/components/cloud-pet/MiniGameLauncher.tsx · M2.5 互动小游戏入口
 *
 * 包装 MiniGame 组件,管理 open 状态
 * 客户端组件
 */

"use client";

import { useState } from "react";
import { MiniGame } from "./MiniGame";

export function MiniGameLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="bg-oat-100/60 rounded-xl p-4 border border-brown-200/70 mb-4"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/></svg>\")",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-widest text-brown-700 mb-1">
              🎮 互动游戏
            </h2>
            <p className="text-[11px] text-brown-600">
              30s 点对 pet 拿 xp + 心情 · 让它陪你玩一会儿
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-lg bg-warm-brown text-white text-sm font-medium hover:opacity-90 active:scale-[0.97]"
            type="button"
          >
            开始玩
          </button>
        </div>
      </div>
      {open && <MiniGame onClose={() => setOpen(false)} />}
    </>
  );
}
