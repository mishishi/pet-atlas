"use client";

/**
 * app/match/page.tsx · AI Pet Matchmaker 问卷页 (P2 商业化, 2026-07-31)
 *
 * 5 道问卷 (multi-step 进度条) → Rule-based 评分 → Top 3 推荐
 * 0 强制外部依赖 (rule-based 评分, 未来可加 LLM 增强)
 *
 * 设计:
 * - vintage 老纸风格, 跟全站统一
 * - 每道题 3-4 选项, 大点击区
 * - 完成自动算 top 3, 不需要提交按钮
 * - 顶部进度 1/5, 2/5...
 * - 结果区可分享 + 再来一次
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  QUESTIONS,
  getTopMatches,
  scoreLabel,
  type MatchAnswers,
  type ScoredPet,
} from "@/lib/matchmaker";
import { allPets } from "@/lib/pets-data";
import { MatchResult } from "@/components/match/MatchResult";

const TOTAL = QUESTIONS.length;

const EMPTY_ANSWERS: MatchAnswers = {
  space: "apartment",
  activity: "moderate",
  time: "medium",
  family: "single",
  experience: "some",
};

export default function MatchPage() {
  const [step, setStep] = useState(0);          // 0..4 问卷, 5 显示结果
  const [answers, setAnswers] = useState<MatchAnswers>(EMPTY_ANSWERS);

  // step === TOTAL 时计算 top 3
  const topMatches = useMemo<ScoredPet[]>(() => {
    if (step < TOTAL) return [];
    return getTopMatches(answers, allPets, 3);
  }, [step, answers]);

  const currentQ = QUESTIONS[step];
  const isResultStep = step >= TOTAL;

  const handleSelect = (value: string) => {
    if (!currentQ) return;
    const field = currentQ.id as keyof MatchAnswers;
    setAnswers((prev) => ({ ...prev, [field]: value as MatchAnswers[typeof field] }));
    // 自动下一步
    setTimeout(() => setStep((s) => s + 1), 280);
  };

  const handleReset = () => {
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-oat-200">
      <Container size="md" className="py-8 md:py-12">
        {/* ============ Header ============ */}
        <div className="text-center mb-8 md:mb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-brown-500 mb-2">
            AI · Quinque Quaestiones
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 tracking-tight leading-tight">
            AI 宠物配对师
          </h1>
          <p className="font-display italic text-base text-warm-brown mt-1">
            AI Pet Matchmaker · 5 题找出你的"命定品种"
          </p>
          <div className="mt-3 inline-block border-t border-warm-brown/30 pt-2">
            <p className="text-sm text-brown-700 max-w-md mx-auto">
              答 5 道生活场景题,算法基于 150 品种数据 + 5 维评分模型,
              <br />
              给你 3 个最匹配的"命定品种"。
            </p>
          </div>
        </div>

        {/* ============ 进度条 ============ */}
        {!isResultStep && (
          <div className="mb-8 md:mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brown-500">
                Passus {step + 1} / {TOTAL}
              </span>
              <span className="font-display italic text-xs text-brown-500">
                ~{Math.max(0, (TOTAL - step - 1) * 20)}s
              </span>
            </div>
            <div className="h-1.5 bg-oat-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brown-500 to-brick transition-all duration-500"
                style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {QUESTIONS.map((q, i) => (
                <span
                  key={q.id}
                  className={`font-mono text-[9px] uppercase tracking-wider ${
                    i === step
                      ? "text-brick font-bold"
                      : i < step
                      ? "text-brown-500"
                      : "text-brown-300"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ============ 问卷卡 ============ */}
        {!isResultStep && currentQ && (
          <div
            key={currentQ.id}
            className="border-2 border-warm-brown rounded-[var(--radius-lg)] bg-oat-100 p-6 md:p-8 shadow-[var(--shadow-paper)]"
            style={{ animation: "fadeIn 0.4s ease-out" }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brick mb-2">
              Q{step + 1} · {currentQ.subtitle}
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brown-900 mb-1 leading-tight">
              {currentQ.title}
            </h2>
            <p className="text-sm text-brown-500 mb-6">选择最贴近你生活的答案</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const field = currentQ.id as keyof MatchAnswers;
                const isSelected = answers[field] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`group text-left px-4 py-4 rounded-[var(--radius)] border-2 transition-all ${
                      isSelected
                        ? "border-brick bg-brick/5 scale-[1.02]"
                        : "border-brown-200 bg-oat-50/60 hover:border-warm-brown hover:bg-oat-50"
                    }`}
                    style={{
                      animation: `slideIn 0.3s ${0.05 * (currentQ.options.indexOf(opt))}s both ease-out`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0" aria-hidden>
                        {opt.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-base md:text-lg font-bold text-brown-900">
                          {opt.label}
                        </div>
                        <div className="font-display italic text-xs text-brown-500 mt-0.5">
                          {opt.sub}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 进度 + 返回按钮 */}
            <div className="mt-6 flex items-center justify-between text-xs text-brown-500">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="font-mono uppercase tracking-wider disabled:opacity-30 hover:text-brown-700"
              >
                ← 上一步
              </button>
              <span className="font-mono">
                {step + 1} / {TOTAL}
              </span>
              <span className="opacity-30">下一步 →</span>
            </div>
          </div>
        )}

        {/* ============ 结果区 ============ */}
        {isResultStep && (
          <div style={{ animation: "fadeIn 0.5s ease-out" }}>
            {/* 标题 */}
            <div className="text-center mb-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-brick mb-2">
                Resultatum · AI 配对结果
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brown-900">
                你的 3 个命定品种
              </h2>
              <p className="text-sm text-brown-500 mt-1">
                基于 5 维评分模型 + 150 品种数据,Rule-based 算法
              </p>
            </div>

            {/* Top 3 结果 */}
            <div className="space-y-4 md:space-y-5">
              {topMatches.map((m, i) => (
                <MatchResult
                  key={m.pet.slug}
                  match={m}
                  rank={i + 1}
                  total={topMatches.length}
                />
              ))}
            </div>

            {/* 操作按钮 */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-full border-2 border-warm-brown text-warm-brown bg-transparent hover:bg-warm-brown/10 font-serif text-sm transition-all active:scale-95"
              >
                ↻ 再来一次
              </button>
              <Link
                href="/pets"
                className="px-5 py-2.5 rounded-full border-2 border-brown-700 text-brown-50 bg-brown-700 hover:bg-brown-800 hover:border-brown-800 font-serif text-sm transition-all active:scale-95 text-center"
              >
                翻看 150 完整图鉴 →
              </Link>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            0% { opacity: 0; transform: translateX(-12px); }
            100% { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </Container>
    </div>
  );
}
