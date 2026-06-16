"use client";

import { useState, useEffect, useCallback } from "react";
import { allLots, Lot } from "@/lib/lots-data";
import { Sparkles, Clock, RotateCcw, ChevronDown } from "lucide-react";

const COOLDOWN_MS = 10 * 60 * 1000; // 10分钟冷却

function getLevelColor(level: string): string {
  if (level.includes("上上")) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (level.includes("上") || level.includes("吉")) return "bg-gold/20 text-gold border-gold/30";
  if (level.includes("中")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export default function LingqianPage() {
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<Lot | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // 冷却倒计时
  useEffect(() => {
    const lastDraw = localStorage.getItem("lqt_lastLotTime");
    if (lastDraw) {
      const diff = Date.now() - parseInt(lastDraw);
      if (diff < COOLDOWN_MS) {
        setRemaining(Math.ceil((COOLDOWN_MS - diff) / 1000));
      } else {
        localStorage.removeItem("lqt_lastLotTime");
      }
    }
  }, []);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          localStorage.removeItem("lqt_lastLotTime");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining]);

  const drawLot = useCallback(() => {
    if (remaining > 0 || isShaking) return;

    setIsShaking(true);
    setResult(null);
    setIsRevealed(false);

    // 摇签动画1.5秒
    setTimeout(() => {
      const lot = allLots[Math.floor(Math.random() * allLots.length)];
      setResult(lot);
      setIsShaking(false);
      localStorage.setItem("lqt_lastLotTime", Date.now().toString());
      setRemaining(Math.floor(COOLDOWN_MS / 1000));
    }, 1500);
  }, [remaining, isShaking]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="page-container">
      {/* 标题 */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gold">关帝灵签</h1>
        <p className="text-sm text-text-secondary">心诚则灵，一签一事</p>
        <p className="mt-1 text-xs text-text-muted">
          共 {allLots.length} 支签文 · 出自传统签谱
        </p>
      </div>

      {/* 抽签区域 */}
      <div className="card-classic mb-6 overflow-hidden p-6 md:p-8">
        {/* 签筒 */}
        <div className="flex flex-col items-center">
          {/* 签筒 SVG */}
          <div
            className={`mb-6 transition-transform ${
              isShaking ? "animate-shake" : ""
            }`}
          >
            <div className="relative flex h-48 w-24 flex-col items-center">
              {/* 签筒身体 */}
              <div className="absolute bottom-0 left-1/2 h-40 w-20 -translate-x-1/2 rounded-b-2xl bg-gradient-to-b from-amber-800 to-amber-950 border border-amber-700/50" />
              {/* 签筒口 */}
              <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-t-lg bg-gradient-to-b from-amber-700 to-amber-800 border border-amber-600/50" />
              {/* 签 */}
              {!result && (
                <>
                  <div className="absolute left-[38%] top-2 h-28 w-1.5 -translate-x-1/2 rounded-t bg-yellow-200/80" />
                  <div className="absolute left-[48%] top-1 h-32 w-1.5 -translate-x-1/2 rounded-t bg-yellow-100/80" />
                  <div className="absolute left-[58%] top-3 h-26 w-1.5 -translate-x-1/2 rounded-t bg-yellow-200/60" />
                  <div className="absolute left-[52%] top-0 h-34 w-1.5 -translate-x-1/2 rounded-t bg-yellow-300/70" />
                </>
              )}
              {/* 底座 */}
              <div className="absolute bottom-0 left-1/2 h-4 w-24 -translate-x-1/2 rounded-b-xl bg-amber-900 border border-amber-800/50" />
            </div>
          </div>

          {/* 抽签按钮 */}
          <button
            onClick={drawLot}
            disabled={remaining > 0 || isShaking}
            className="btn-primary flex w-full max-w-xs items-center justify-center gap-2 text-lg"
          >
            {isShaking ? (
              <>
                <Sparkles className="h-5 w-5 animate-spin" />
                正在摇签...
              </>
            ) : remaining > 0 ? (
              <>
                <Clock className="h-5 w-5" />
                冷却中 {formatTime(remaining)}
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                诚心抽一签
              </>
            )}
          </button>
        </div>
      </div>

      {/* 签文结果 */}
      {result && !isShaking && (
        <div
          className={`card-classic overflow-hidden ${
            isRevealed ? "animate-fade-in" : ""
          }`}
        >
          {/* 签文头部 */}
          <div className="border-b border-border bg-bg-elevated p-6 text-center">
            <p className="mb-1 text-xs text-text-muted">关圣帝君灵签</p>
            <h2 className="mb-3 text-xl font-bold text-gold">{result.title}</h2>
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getLevelColor(
                result.level
              )}`}
            >
              第{result.id}签 · {result.level}
            </span>
          </div>

          {/* 签诗 */}
          <div className="p-6">
            <div className="divider-ornament mb-4 text-xs">✦ 签诗 ✦</div>
            <div className="bg-bg-input rounded-xl p-5 text-center leading-loose text-text-primary">
              {result.poem.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {/* 签解详情 */}
          {!isRevealed ? (
            <div className="p-6 text-center">
              <button
                onClick={() => setIsRevealed(true)}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ChevronDown className="h-4 w-4" />
                查看详解
              </button>
            </div>
          ) : (
            <div className="animate-fade-in-up space-y-6 p-6">
              {/* 签解 */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gold">
                  <span className="inline-block h-1 w-4 rounded bg-gold" />
                  签解
                </h3>
                <p className="leading-relaxed text-text-secondary">
                  {result.explanation}
                </p>
              </div>

              {/* 师父开示 */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gold">
                  <span className="inline-block h-1 w-4 rounded bg-gold" />
                  师父开示
                </h3>
                <p className="leading-relaxed text-text-secondary">
                  {result.kaishi}
                </p>
              </div>

              {/* 行动建议 */}
              <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gold">
                  <span className="inline-block h-1 w-4 rounded bg-gold" />
                  行动建议
                </h3>
                <p className="leading-relaxed text-text-primary">
                  {result.advice}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 底部提示 */}
      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted">
          每10分钟可抽一次 · 仅供娱乐参考，不可迷信
        </p>
      </div>
    </div>
  );
}
