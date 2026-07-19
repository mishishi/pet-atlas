/**
 * HeroEditorial · 主页 hero
 */
import Link from "next/link";
import Image from "next/image";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { getAllPets, getCoverUrl } from "@/lib/pets";

export function HeroEditorial() {
  const pets = getAllPets().slice(0, 3);

  return (
    <section className="relative overflow-hidden">
      <Container size="xl" className="pt-12 md:pt-20 pb-16 md:pb-24">
        {/* 装饰罗马数字 + 编号 */}
        <div className="absolute left-4 top-12 md:left-8 md:top-20 font-mono text-xs text-brown-500/50 select-none hidden md:block">
          I
        </div>
        <div className="absolute right-4 bottom-12 md:right-8 md:bottom-20 font-mono text-xs text-brown-500/50 select-none hidden md:block">
          III
        </div>
        <div className="absolute right-4 top-24 md:right-12 md:top-32 font-mono text-[10px] uppercase tracking-[0.3em] text-brick/70 select-none hidden lg:block">
          · 2026 ·
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[60vh] md:min-h-[70vh]">
          {/* 左侧:文案 */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brick mb-6 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-brick" />
              No. 051 · Vintage Paper 2026
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-brown-900 leading-[1.05] tracking-tight mb-6">
              五十只
              <br />
              <span className="text-brick italic">小动物的</span>
              <br />
              标本图谱
            </h1>

            <p className="text-lg md:text-xl text-brown-600 leading-relaxed max-w-[42ch] mb-8">
              拉布拉多与英短,守宫与文鸟 ——
              <br className="hidden md:inline" />
              50 种伙伴的 6 页手绘水彩标本卡。
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/pets">
                <Button variant="primary" size="lg">
                  开始浏览
                  <span aria-hidden="true" className="ml-1">
                    →
                  </span>
                </Button>
              </Link>
              <Link href="#featured">
                <Button variant="ghost" size="lg">
                  查看精选
                </Button>
              </Link>
            </div>
          </div>

          {/* 右侧:3 张封面图 */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative h-[420px] md:h-[520px] lg:h-[600px]">
              {pets.map((pet, i) => {
                const url = getCoverUrl(pet.slug) || "";
                const offsets = [
                  "top-0 left-0 md:top-4 md:left-0 w-[58%] z-10 rotate-[-3deg]",
                  "top-[18%] right-0 w-[55%] z-20 rotate-[2.5deg]",
                  "bottom-0 left-[12%] w-[60%] z-30 rotate-[-1.5deg]",
                ];
                return (
                  <div
                    key={pet.slug}
                    className={`absolute ${offsets[i]} transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] hover:z-40`}
                  >
                    <div className="bg-oat-50 p-3 pb-12 shadow-[var(--shadow-paper-lg)] border border-brown-200">
                      <div className="relative aspect-[9/16] w-full overflow-hidden">
                        <Image
                          src={url}
                          alt={pet.name.zh}
                          fill
                          sizes="(max-width: 768px) 60vw, 30vw"
                          className="object-cover"
                          priority={i === 0}
                        />
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
                        <span className="font-serif text-sm text-brown-900 font-medium">
                          {pet.name.zh}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-brown-500">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
