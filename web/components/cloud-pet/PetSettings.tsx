/**
 * web/components/cloud-pet/PetSettings.tsx · 宠物设置
 *
 * 功能:
 * 1. 改名字 (2-6 字)
 * 2. 换 personality (curious/social/independent)
 * 3. 换 color preference (classic/cream/blue)
 * 4. 叫声按钮 (web speech API · 免费,中文 TTS)
 *
 * 关键:用 updatePet(partial) 而非 saveAdoptedPet,保留 reroll + stats
 *
 * 客户端组件(读 localStorage + speech API)
 */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  type CloudPet,
  type Personality,
  type ColorPreference,
  getAdoptedPet,
  updatePet,
  PERSONALITY_LABEL,
  COLOR_LABEL,
} from "@/lib/cloudPet";
import {
  getCurrentStats,
  deriveMood,
  MOOD_META,
  type PetStats,
} from "@/lib/petStats";

const PERSONALITY_OPTIONS: Array<{ key: Personality; emoji: string; desc: string }> = [
  { key: "curious", emoji: "🔍", desc: "好奇心满满,什么都想嗅一嗅" },
  { key: "social", emoji: "🤗", desc: "温顺粘人,喜欢贴贴" },
  { key: "independent", emoji: "🦅", desc: "独立高冷,自己玩也开心" },
];

const COLOR_OPTIONS: Array<{ key: ColorPreference; hex: string }> = [
  { key: "classic", hex: "#C9A14A" },
  { key: "cream", hex: "#E8D9B8" },
  { key: "blue", hex: "#7B9DB8" },
];

/** mood → 预生成音频 URL
 * 优先 TCB (CDN 加速,节省 Vercel build size)
 * 退化 public(本地 fallback,build 打包)
 */
const TCB_VOICE_BASE =
  "https://636c-cloud1-d9gv1q8ikad5e9721-1442530204.tcb.qcloud.la/pet-atlas/pet-voice";
const PUBLIC_VOICE_BASE = "/sounds/pet-voice";

function moodAudioUrls(mood: string): { primary: string; fallback: string } {
  return {
    primary: `${TCB_VOICE_BASE}/${mood}.mp3`,
    fallback: `${PUBLIC_VOICE_BASE}/${mood}.mp3`,
  };
}

/** mood → web speech fallback 短句(用 petName) */
function moodLine(mood: keyof typeof MOOD_META, petName: string): string {
  const lines: Record<string, string> = {
    happy: `${petName}今天心情好好,在阳光下打滚,摇尾巴呢`,
    calm: `${petName}安安静静地陪在你身边`,
    hungry: `${petName}肚子在咕咕叫,想吃点东西~`,
    sleepy: `${petName}有点困了,想找个地方睡觉`,
    bored: `${petName}有点无聊,快陪我玩一会儿吧`,
    sad: `${petName}呜呜... 我有点难过`,
  };
  return lines[mood] || `${petName}在这里呢`;
}

/** web speech fallback(用于 <audio> 加载失败) */
function speakFallback(text: string): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 1.0;
    u.pitch = 1.15;
    u.volume = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(
      (v) => v.lang.startsWith("zh") && /female|xiaoxiao|yunxi|yunyang/i.test(v.name)
    );
    if (zhVoice) u.voice = zhVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  } catch (err) {
    console.warn("[PetSettings] speech fallback 失败", err);
    return false;
  }
}

export function PetSettings() {
  const [pet, setPet] = useState<CloudPet | null>(null);
  const [stats, setStats] = useState<PetStats | null>(null);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [voiceExpanded, setVoiceExpanded] = useState(false);
  const [activeVoice, setActiveVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setPet(getAdoptedPet());
    setStats(getCurrentStats());
    // 多 tab 同步
    const onStorage = () => {
      setPet(getAdoptedPet());
      setStats(getCurrentStats());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 预热 web speech voices(只在 audio 不可用时需要)
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  }, []);

  const handleSaveName = useCallback(() => {
    if (!pet) return;
    const trimmed = nameInput.trim();
    if (trimmed.length < 2 || trimmed.length > 6) {
      flash("名字要 2-6 个字哦");
      return;
    }
    const next = updatePet({ petName: trimmed });
    if (next) {
      setPet(next);
      setEditing(false);
      flash(`已改名为 ${trimmed}`);
    }
  }, [pet, nameInput, flash]);

  const handlePersonality = useCallback(
    (p: Personality) => {
      const next = updatePet({ personality: p });
      if (next) {
        setPet(next);
        flash(`性格改成${PERSONALITY_LABEL[p]}了`);
      }
    },
    [flash]
  );

  const handleColor = useCallback(
    (c: ColorPreference) => {
      const next = updatePet({ colorPreference: c });
      if (next) {
        setPet(next);
        flash(`颜色改成${COLOR_LABEL[c]}`);
      }
    },
    [flash]
  );

  const handleSpeak = useCallback(() => {
    if (!pet) return;
    const mood = stats ? deriveMood(stats) : "calm";
    // 1. 优先用预生成 audio(高质量 + 0 延迟)
    const urls = moodAudioUrls(mood);
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        // 尝试 TCB,失败 fallback 到 public
        const tryPlay = (src: string, onError?: () => void) => {
          if (!audioRef.current) return;
          audioRef.current.src = src;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setSpeaking(true);
                const onEnded = () => {
                  setSpeaking(false);
                  audioRef.current?.removeEventListener("ended", onEnded);
                };
                audioRef.current?.addEventListener("ended", onEnded);
                setTimeout(() => setSpeaking(false), 6000);
              })
              .catch((err) => {
                console.warn("[PetSettings] audio play failed:", src, err);
                if (onError) onError();
                else fallbackSpeak(mood, pet.petName);
              });
          }
        };
        // 第一发 TCB,onError 触发时切到 public
        tryPlay(urls.primary, () => tryPlay(urls.fallback, () => fallbackSpeak(mood, pet.petName)));
        return;
      } catch (err) {
        console.warn("[PetSettings] audio 异常, fallback", err);
      }
    }
    fallbackSpeak(mood, pet.petName);
  }, [pet, stats, flash]);

  const fallbackSpeak = useCallback(
    (mood: keyof typeof MOOD_META, petName: string) => {
      const line = moodLine(mood, petName);
      const ok = speakFallback(line);
      if (ok) {
        setSpeaking(true);
        const ms = Math.max(1500, line.length * 200);
        setTimeout(() => setSpeaking(false), ms);
      } else {
        flash("当前浏览器不支持语音");
      }
    },
    [flash]
  );

  /** 试听 6 段:直接播指定 mood 的预生成音频 */
  const handleTestVoice = useCallback(
    (mood: string) => {
      const urls = moodAudioUrls(mood);
      if (!audioRef.current) return;
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        const tryPlay = (src: string, onError?: () => void) => {
          if (!audioRef.current) return;
          audioRef.current.src = src;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setActiveVoice(mood);
                const onEnded = () => {
                  setActiveVoice((cur) => (cur === mood ? null : cur));
                  audioRef.current?.removeEventListener("ended", onEnded);
                };
                audioRef.current?.addEventListener("ended", onEnded);
                setTimeout(() => {
                  setActiveVoice((cur) => (cur === mood ? null : cur));
                }, 6000);
              })
              .catch((err) => {
                console.warn("[PetSettings] test voice failed:", src, err);
                if (onError) onError();
                else flash("播放失败,请点击页面任意位置再试");
              });
          }
        };
        tryPlay(urls.primary, () => tryPlay(urls.fallback, () => flash("播放失败,请点击页面任意位置再试")));
            })
            .catch((err) => {
              console.warn("[PetSettings] test voice 失败", err);
              flash("播放失败,请点击页面任意位置再试");
            });
        }
      } catch (err) {
        console.warn("[PetSettings] test voice 异常", err);
      }
    },
    [flash]
  );

  if (!pet) return null;

  return (
    <div
      className="bg-oat-100/60 rounded-xl p-4 border border-brown-200/70 mb-4"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/></svg>\")",
      }}
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-mono uppercase tracking-widest text-brown-700">
          ⚙️ 宠物设置
        </h2>
        <button
          onClick={handleSpeak}
          disabled={speaking}
          className={[
            "text-xs px-2.5 py-1 rounded-full border transition-all",
            speaking
              ? "bg-warm-brown/20 border-warm-brown text-warm-brown animate-pulse"
              : "bg-oat-50 border-warm-brown/40 text-brown-700 hover:bg-warm-brown/10",
          ].join(" ")}
          type="button"
          title="让 pet 说句话"
        >
          {speaking ? "🔊 在说话..." : "🗣️ 让它说话"}
        </button>
      </div>

      {/* 名字 */}
      <div className="mb-4">
        <label className="text-xs text-brown-600 mb-1 block">名字</label>
        {editing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={6}
              className="flex-1 px-3 py-1.5 text-sm bg-oat-50 border border-warm-brown/40 rounded-md text-brown-900 focus:outline-none focus:border-warm-brown"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") setEditing(false);
              }}
            />
            <button
              onClick={handleSaveName}
              className="px-3 py-1.5 text-sm bg-warm-brown text-white rounded-md hover:opacity-90"
              type="button"
            >
              保存
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-base font-serif text-brown-900">{pet.petName}</span>
            <button
              onClick={() => {
                setNameInput(pet.petName);
                setEditing(true);
              }}
              className="text-xs text-warm-brown hover:underline"
              type="button"
            >
              改名
            </button>
          </div>
        )}
      </div>

      {/* 性格 */}
      <div className="mb-4">
        <label className="text-xs text-brown-600 mb-1.5 block">性格</label>
        <div className="grid grid-cols-3 gap-1.5">
          {PERSONALITY_OPTIONS.map((opt) => {
            const active = pet.personality === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => handlePersonality(opt.key)}
                className={[
                  "flex flex-col items-center gap-0.5 py-2 rounded-lg border text-xs transition-all",
                  active
                    ? "bg-warm-brown/15 border-warm-brown text-brown-900"
                    : "bg-oat-50 border-warm-brown/30 text-brown-600 hover:bg-warm-brown/5",
                ].join(" ")}
                title={opt.desc}
                type="button"
              >
                <span className="text-base">{opt.emoji}</span>
                <span className="font-medium">{PERSONALITY_LABEL[opt.key]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 颜色 */}
      <div>
        <label className="text-xs text-brown-600 mb-1.5 block">色系偏好</label>
        <div className="flex gap-2">
          {COLOR_OPTIONS.map((opt) => {
            const active = pet.colorPreference === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => handleColor(opt.key)}
                className={[
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs transition-all",
                  active
                    ? "border-warm-brown ring-1 ring-warm-brown/30"
                    : "border-warm-brown/30 hover:border-warm-brown/60",
                ].join(" ")}
                type="button"
              >
                <span
                  className="w-3 h-3 rounded-full border border-brown-300"
                  style={{ background: opt.hex }}
                  aria-hidden
                />
                {COLOR_LABEL[opt.key]}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-brown-500 mt-1.5 leading-relaxed">
          预留钩子 · M3+ 影响立绘滤镜色温
        </p>
      </div>

      {/* 6 段试听折叠区 */}
      <div className="mt-4 pt-3 border-t border-brown-200/50">
        <button
          onClick={() => setVoiceExpanded((v) => !v)}
          className="w-full flex items-center justify-between text-xs text-brown-700 hover:text-warm-brown transition-colors"
          type="button"
          aria-expanded={voiceExpanded}
        >
          <span>🎧 试一下 6 种心情</span>
          <span className="text-[10px]">{voiceExpanded ? "▾ 收起" : "▸ 展开"}</span>
        </button>

        {voiceExpanded && (
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {[
              { mood: "happy", label: "开心", emoji: "✨" },
              { mood: "calm", label: "平静", emoji: "🍃" },
              { mood: "hungry", label: "饿了", emoji: "🍖" },
              { mood: "sleepy", label: "困了", emoji: "💤" },
              { mood: "bored", label: "无聊", emoji: "🎾" },
              { mood: "sad", label: "难过", emoji: "💧" },
            ].map((m) => {
              const isActive = activeVoice === m.mood;
              return (
                <button
                  key={m.mood}
                  onClick={() => handleTestVoice(m.mood)}
                  className={[
                    "flex flex-col items-center gap-0.5 py-1.5 rounded-lg border text-xs transition-all",
                    isActive
                      ? "bg-warm-brown/15 border-warm-brown text-brown-900 animate-pulse"
                      : "bg-oat-50 border-warm-brown/30 text-brown-700 hover:bg-warm-brown/5",
                  ].join(" ")}
                  type="button"
                >
                  <span className="text-base">{m.emoji}</span>
                  <span className="font-medium">{m.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* toast */}
      {toast && (
        <div
          className="mt-3 px-3 py-2 rounded-lg bg-brown-50 border border-brown-200 text-center text-sm text-brown-800"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}

      {/* 隐藏 audio 元素(预生成中文 TTS 短句) */}
      <audio ref={audioRef} preload="none" />
    </div>
  );
}
