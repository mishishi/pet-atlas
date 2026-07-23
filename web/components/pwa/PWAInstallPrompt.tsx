/**
 * web/components/pwa/PWAInstallPrompt.tsx · PWA 安装引导浮窗
 *
 * 触发条件:
 * - Chrome / Edge / Samsung: 监听 beforeinstallprompt event
 * - iOS Safari: 检测 userAgent + standalone 模式
 *
 * 关闭后策略:
 * - 立即 dismiss → localStorage 记录 30 天不再显示
 * - 7 天后自动重试(用户可能改变主意)
 *
 * 视觉:右下角浮窗,跟整体 oat + warm brown 调色一致
 * "use client" 因为要用 useState / useEffect
 */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const DISMISS_KEY = "pet-atlas-pwa-install-dismissed";
const DISMISS_DAYS = 30; // 关闭后 30 天不显示
const SHOW_DELAY_MS = 5000; // 页面加载 5s 后才弹(避免突兀)

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error iOS Safari standalone
    navigator.standalone === true
  );
}

function isDismissed() {
  if (typeof localStorage === "undefined") return true;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = parseInt(raw, 10);
  if (!ts || Date.now() - ts > DISMISS_DAYS * 24 * 60 * 60 * 1000) return false;
  return true;
}

function markDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {}
}

export function PWAInstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [iosMode, setIosMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return; // 已安装,不再提示
    if (isDismissed()) return; // 30 天内已关闭

    // iOS:没有 beforeinstallprompt,直接显示引导
    if (isIOS()) {
      const t = setTimeout(() => setIosMode(true), SHOW_DELAY_MS);
      return () => clearTimeout(t);
    }

    // Chromium 系:监听 beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
      const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
      // 清理 timeout
      return () => clearTimeout(t);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // 监听安装完成
    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;
  if (!visible && !iosMode) return null;

  const handleInstall = async () => {
    if (!event) return;
    setVisible(false);
    try {
      await event.prompt();
      const { outcome } = await event.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
      } else {
        markDismissed();
      }
    } catch (err) {
      console.warn("[PWA] install prompt failed:", err);
      markDismissed();
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setIosMode(false);
    markDismissed();
  };

  return (
    <div
      role="dialog"
      aria-label="加到主屏幕"
      className="fixed bottom-20 right-4 left-4 sm:left-auto sm:max-w-sm z-40 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div
        className="rounded-2xl p-5 shadow-[var(--shadow-paper-lg)] border-2 border-warm-brown/40"
        style={{
          background: "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 100%)",
        }}
      >
        {/* 顶部图标 + 标题 */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-warm-brown/40"
            style={{ background: "#F5EFE0" }}
            aria-hidden
          >
            <span className="text-2xl" style={{ filter: "saturate(0.9)" }}>
              🐾
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-brick mb-1">
              PWA · 加到主屏
            </div>
            <h3 className="font-serif text-lg font-bold text-brown-900 leading-tight">
              像 App 一样浏览宠物大百科
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="关闭"
            className="shrink-0 w-6 h-6 rounded-full hover:bg-brown-100 flex items-center justify-center text-brown-500 hover:text-brown-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 内容 */}
        {iosMode ? (
          <div className="text-sm text-brown-700 leading-relaxed mb-4 space-y-2">
            <p>iOS 用户请按下面步骤加到主屏:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>点击底部的"分享"按钮 ⬆️</li>
              <li>选择"添加到主屏幕"</li>
              <li>点"添加"完成</li>
            </ol>
          </div>
        ) : (
          <p className="text-sm text-brown-700 leading-relaxed mb-4">
            安装到主屏,离线也能翻图鉴。原生 App 体验,无需下载。
          </p>
        )}

        {/* 按钮 */}
        {!iosMode && (
          <div className="flex gap-2">
            <Button onClick={handleInstall} variant="primary" size="md" className="flex-1">
              安装
            </Button>
            <Button onClick={handleDismiss} variant="ghost" size="md">
              稍后
            </Button>
          </div>
        )}
        {iosMode && (
          <Button onClick={handleDismiss} variant="ghost" size="md" className="w-full">
            知道了
          </Button>
        )}
      </div>
    </div>
  );
}
