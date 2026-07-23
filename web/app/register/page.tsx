/**
 * web/app/register/page.tsx · 注册
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LeafDivider } from "@/components/brand/BotanicalBorder";
import { registerUser, notifyAuthChange } from "@/lib/auth";
import { getDeviceId, bindDeviceToCurrentUser } from "@/lib/deviceId";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("两次密码不一致");
      return;
    }
    setLoading(true);
    const res = await registerUser(email, password, displayName);
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    // 绑定 deviceId(自动迁移 localStorage 已有数据)
    const did = getDeviceId();
    if (did) bindDeviceToCurrentUser(did);
    notifyAuthChange();
    setLoading(false);
    router.push("/profile/");
  };

  return (
    <>
      <Header />
      <main
        className="relative w-full min-h-screen overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #F5E9D0 0%, #EFE0BE 60%, #E8D9B8 100%)",
        }}
      >
        <Container size="sm" className="relative z-10 py-12 md:py-20 px-6">
          <div className="text-center mb-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-brick mb-3 flex items-center justify-center gap-3">
              <span className="inline-block w-8 h-px bg-brick" />
              Sign Up · 注册
              <span className="inline-block w-8 h-px bg-brick" />
            </div>
            <h1
              className="font-serif font-bold text-brown-900 leading-[0.95] tracking-tight mb-3"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
            >
              创建账号
            </h1>
            <div className="flex justify-center my-4">
              <LeafDivider className="w-40 md:w-48 h-auto" />
            </div>
            <p className="font-serif text-brown-700 text-base">
              注册后,本机已有的收藏 / 日记 / 云宠物会自动绑到新账号。
            </p>
          </div>

          <div
            className="rounded-2xl p-6 md:p-8 shadow-[var(--shadow-paper-md)] border-2 border-warm-brown/30"
            style={{ background: "rgba(245, 233, 208, 0.7)" }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500 mb-1.5">
                  显示名
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-oat-50 border border-brown-300 focus:border-warm-brown focus:outline-none font-serif text-base text-brown-900"
                  placeholder="给本机起个名字"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500 mb-1.5">
                  邮箱
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-lg bg-oat-50 border border-brown-300 focus:border-warm-brown focus:outline-none font-mono text-sm text-brown-900"
                  placeholder="hello@example.com"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500 mb-1.5">
                  密码 (至少 6 位)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-lg bg-oat-50 border border-brown-300 focus:border-warm-brown focus:outline-none font-mono text-sm text-brown-900"
                  placeholder="••••••"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-brown-500 mb-1.5">
                  确认密码
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-lg bg-oat-50 border border-brown-300 focus:border-warm-brown focus:outline-none font-mono text-sm text-brown-900"
                  placeholder="••••••"
                />
              </div>
              {error && (
                <div className="px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "注册中..." : "创建账号"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-brown-700">
              已有账号?{" "}
              <Link href="/login/" className="text-brick font-medium hover:underline">
                登录
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
