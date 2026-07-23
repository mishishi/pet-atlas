/**
 * web/app/login/page.tsx · 登录
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
import { loginUser, notifyAuthChange } from "@/lib/auth";
import { getDeviceId, bindDeviceToCurrentUser } from "@/lib/deviceId";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await loginUser(email, password);
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    // 绑定 deviceId → userId(数据迁移)
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
              Sign In · 登录
              <span className="inline-block w-8 h-px bg-brick" />
            </div>
            <h1
              className="font-serif font-bold text-brown-900 leading-[0.95] tracking-tight mb-3"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
            >
              欢迎回来
            </h1>
            <div className="flex justify-center my-4">
              <LeafDivider className="w-40 md:w-48 h-auto" />
            </div>
            <p className="font-serif text-brown-700 text-base">
              登录后,你的收藏 / 日记 / 云宠物会跨设备同步。
            </p>
          </div>

          <div
            className="rounded-2xl p-6 md:p-8 shadow-[var(--shadow-paper-md)] border-2 border-warm-brown/30"
            style={{ background: "rgba(245, 233, 208, 0.7)" }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  密码
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
                {loading ? "登录中..." : "登录"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-brown-700">
              没账号?{" "}
              <Link href="/register/" className="text-brick font-medium hover:underline">
                注册一个
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-brown-500 mt-6">
            MVP 阶段:用户数据存本机 localStorage,跨设备同步后续接入 TCB。
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
