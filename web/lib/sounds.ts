/**
 * lib/sounds.ts · 翻页/章节切换音效 (P2 polish, 2026-07-30)
 *
 * 设计: 用 Web Audio API 合成, 0 外部音频文件
 *  - page-flip: 模拟纸页翻动的短促声音 (高频 noise burst + low-pass filter sweep)
 *  - chapter-swap: 章节切换更长的低频"翻动" (低频 noise + filter envelope)
 *
 * 静音策略:
 *  - SSR 安全 (typeof window check)
 *  - prefers-reduced-motion: reduce → 不放声
 *  - 用户主动关闭 (localStorage sound-off) → 不放声
 *  - AudioContext 未创建 (首次 user gesture 之前) → 静默 skip
 *
 * 用户首次交互后 init AudioContext (Chrome autoplay policy 限制)
 */

const STORAGE_KEY = "pet-atlas-sound-on";

let _ctx: AudioContext | null = null;
let _unlocked = false;

/** 读取用户偏好 (默认开) */
export function isSoundOn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // 第一次访问默认开, 用户关过后记 'off'
    if (stored === "off") return false;
    return true;
  } catch {
    return true;
  }
}

/** 设置用户偏好 */
export function setSoundOn(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
}

/** 初始化 AudioContext (必须在用户手势里调用) */
export function unlockAudio() {
  if (typeof window === "undefined") return;
  if (_unlocked) return;
  try {
    const Ctx = (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext);
    if (!Ctx) return;
    _ctx = new Ctx();
    _unlocked = true;
  } catch {
    _unlocked = false;
  }
}

/** 检查是否应该出声 (sound on + 未 reduced motion) */
function shouldPlay(): boolean {
  if (!isSoundOn()) return false;
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}

/**
 * 合成 page-flip 音效:
 * - 短促 noise burst (~120ms)
 * - band-pass filter 从 4000Hz → 800Hz 扫频 (像纸页翻过)
 * - 短 amplitude envelope (attack 5ms, release 80ms)
 */
export function playPageFlip() {
  if (!shouldPlay() || !_ctx) return;
  const ctx = _ctx;
  const now = ctx.currentTime;

  // noise buffer
  const bufferSize = Math.floor(ctx.sampleRate * 0.15); // 150ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // 粉色噪声 (filtered white noise, 听起来更像纸)
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // band-pass filter sweep (高频 → 低频, 模拟纸页从耳边划过)
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(4000, now);
  filter.frequency.exponentialRampToValueAtTime(800, now + 0.1);

  // gain envelope
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.005); // attack
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12); // release

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(now);
  source.stop(now + 0.15);
}

/**
 * 合成 chapter-swap 音效 (更长/更低沉, 像翻厚书):
 * - noise burst (~280ms)
 * - low-pass filter 800Hz → 200Hz
 * - 双 gain envelope (先 attack, 中段 sustain, 后 release)
 */
export function playChapterSwap() {
  if (!shouldPlay() || !_ctx) return;
  const ctx = _ctx;
  const now = ctx.currentTime;

  const bufferSize = Math.floor(ctx.sampleRate * 0.3);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(200, now + 0.22);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.22, now + 0.01);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.15); // sustain
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(now);
  source.stop(now + 0.3);
}
