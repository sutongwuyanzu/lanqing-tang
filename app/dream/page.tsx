"use client";

import { useState } from "react";
import {
  matchDream,
  getDefaultDream,
  DreamEntry,
} from "@/lib/dream-data";
import {
  MoonStar,
  BookOpen,
  Brain,
  Clock,
  Lightbulb,
  Send,
  Tag,
} from "lucide-react";

function getLuckColor(luck: string): string {
  switch (luck) {
    case "大吉":
    case "吉":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "中吉":
      return "bg-gold/20 text-gold border-gold/30";
    case "平":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "小凶":
    case "凶":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    default:
      return "bg-gold/20 text-gold border-gold/30";
  }
}

const exampleDreams = [
  "梦见被蛇咬",
  "梦见飞翔",
  "梦见掉牙",
  "梦见水",
  "梦见考试",
  "梦见死人",
];

export default function DreamPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<DreamEntry | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const interpret = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    // 模拟思考时间
    setTimeout(() => {
      const matched = matchDream(input);
      setResult(matched || getDefaultDream(input));
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="page-container">
      {/* 标题 */}
      <div className="mb-8 text-center">
        <MoonStar className="mx-auto mb-3 h-10 w-10 text-gold" />
        <h1 className="mb-2 text-3xl font-bold text-gold">周公解梦</h1>
        <p className="text-sm text-text-secondary">百梦皆有意，古今相参证</p>
      </div>

      {/* 输入区域 */}
      <div className="card-classic mb-6 p-6">
        <label className="mb-2 block text-sm font-medium text-text-primary">
          请描述您的梦境
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="例如：梦见被蛇咬、梦见飞翔、梦见水..."
          className="input-classic mb-3 resize-none"
        />

        {/* 示例标签 */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="flex items-center text-xs text-text-muted">
            <Tag className="mr-1 h-3 w-3" /> 试试：
          </span>
          {exampleDreams.map((dream) => (
            <button
              key={dream}
              onClick={() => setInput(dream)}
              className="rounded-full border border-border bg-bg-input px-3 py-1 text-xs text-text-secondary transition-colors hover:border-gold/30 hover:text-gold"
            >
              {dream}
            </button>
          ))}
        </div>

        <button
          onClick={interpret}
          disabled={!input.trim() || isAnalyzing}
          className="btn-primary flex w-full items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <MoonStar className="h-5 w-5 animate-spin" />
              师父解梦中...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              请师父解梦
            </>
          )}
        </button>
      </div>

      {/* 解析结果 */}
      {result && (
        <div className="animate-fade-in-up space-y-4">
          {/* 梦境标题与吉凶 */}
          <div className="card-classic p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted">所解梦境</p>
                <h2 className="text-xl font-bold text-gold">{result.title}</h2>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium ${getLuckColor(
                  result.luck
                )}`}
              >
                {result.luck}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
              <Tag className="h-3 w-3" />
              {result.aspect}
            </div>
          </div>

          {/* 周公解梦 */}
          <div className="card-classic p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
              <BookOpen className="h-4 w-4" />
              周公解梦
            </h3>
            <p className="leading-relaxed text-text-secondary">
              {result.zhougong}
            </p>
          </div>

          {/* 弗洛伊德解读 */}
          <div className="card-classic p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
              <Brain className="h-4 w-4" />
              弗洛伊德解读
            </h3>
            <p className="leading-relaxed text-text-secondary">
              {result.freud}
            </p>
          </div>

          {/* 应事时机 */}
          <div className="card-classic p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
              <Clock className="h-4 w-4" />
              应事时机
            </h3>
            <p className="leading-relaxed text-text-secondary">
              {result.timing}
            </p>
          </div>

          {/* 化解建议 */}
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
              <Lightbulb className="h-4 w-4" />
              化解与建议
            </h3>
            <p className="leading-relaxed text-text-primary">
              {result.solution}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted">
          共收录 20+ 经典梦境 · 仅供娱乐参考
        </p>
      </div>
    </div>
  );
}
