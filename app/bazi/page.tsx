"use client";

import { useState } from "react";
import {
  calculateBazi,
  BaziResult,
  tianGan,
  diZhi,
} from "@/lib/bazi-utils";
import { generateNameSuggestions, NameSuggestion } from "@/lib/naming-data";
import { Baby, Sparkles, Copy, Check } from "lucide-react";

const wuXingColors: Record<string, string> = {
  "木": "text-green-400",
  "火": "text-red-400",
  "土": "text-yellow-600",
  "金": "text-yellow-300",
  "水": "text-blue-400",
};

const wuXingBg: Record<string, string> = {
  "木": "bg-green-500/10 border-green-500/30",
  "火": "bg-red-500/10 border-red-500/30",
  "土": "bg-yellow-700/10 border-yellow-700/30",
  "金": "bg-yellow-500/10 border-yellow-500/30",
  "水": "bg-blue-500/10 border-blue-500/30",
};

function PillarCard({
  label,
  gan,
  zhi,
}: {
  label: string;
  gan: string;
  zhi: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-input p-3 text-center">
      <div className="mb-2 text-xs text-text-muted">{label}</div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-text-primary">{gan}</div>
        <div className="text-2xl font-bold text-text-primary">{zhi}</div>
      </div>
    </div>
  );
}

export default function BaziPage() {
  const [surname, setSurname] = useState("王");
  const [gender, setGender] = useState("男");
  const [year, setYear] = useState(2022);
  const [month, setMonth] = useState(12);
  const [day, setDay] = useState(31);
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(30);
  const [secondChar, setSecondChar] = useState("");
  const [thirdChar, setThirdChar] = useState("");

  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);
  const [nameSuggestions, setNameSuggestions] = useState<NameSuggestion[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const calculate = () => {
    setIsCalculating(true);
    setBaziResult(null);
    setNameSuggestions([]);

    setTimeout(() => {
      const result = calculateBazi(year, month, day, hour, minute);
      setBaziResult(result);

      const suggestions = generateNameSuggestions(
        surname,
        gender,
        result.wuXingAnalysis.missing,
        result.wuXingAnalysis.weak,
        secondChar,
        thirdChar
      );
      setNameSuggestions(suggestions);
      setIsCalculating(false);
    }, 1000);
  };

  const copyName = (name: string, idx: number) => {
    const fullName = surname + name;
    navigator.clipboard.writeText(fullName);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="page-container">
      {/* 标题 */}
      <div className="mb-8 text-center">
        <Baby className="mx-auto mb-3 h-10 w-10 text-gold" />
        <h1 className="mb-2 text-3xl font-bold text-gold">八字起名</h1>
        <p className="text-sm text-text-secondary">古籍雅名，福泽一生</p>
        <p className="mt-1 text-xs text-text-muted">
          根据《子平真诠》《滴天髓》等经典排盘
        </p>
      </div>

      {/* 输入表单 */}
      <div className="card-classic mb-6 space-y-4 p-5">
        {/* 姓名相关 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs text-text-muted">姓氏</label>
            <input
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="input-classic"
              maxLength={2}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs text-text-muted">性别</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="input-classic"
            >
              <option value="男" className="bg-bg-card">男孩</option>
              <option value="女" className="bg-bg-card">女孩</option>
            </select>
          </div>
        </div>

        {/* 出生日期时间 */}
        <div>
          <label className="mb-2 block text-xs text-text-muted">
            出生日期时间（农历/公历均按公历输入）
          </label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2000)}
                placeholder="年"
                className="input-classic"
              />
            </div>
            <div>
              <input
                type="number"
                value={month}
                onChange={(e) =>
                  setMonth(Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))
                }
                placeholder="月"
                className="input-classic"
                min={1}
                max={12}
              />
            </div>
            <div>
              <input
                type="number"
                value={day}
                onChange={(e) =>
                  setDay(Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))
                }
                placeholder="日"
                className="input-classic"
                min={1}
                max={31}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={hour}
                onChange={(e) =>
                  setHour(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))
                }
                placeholder="时"
                className="input-classic"
                min={0}
                max={23}
              />
              <input
                type="number"
                value={minute}
                onChange={(e) =>
                  setMinute(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))
                }
                placeholder="分"
                className="input-classic"
                min={0}
                max={59}
              />
            </div>
          </div>
        </div>

        {/* 指定用字 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs text-text-muted">
              第二字（可选）
            </label>
            <input
              value={secondChar}
              onChange={(e) => setSecondChar(e.target.value)}
              placeholder="例如：泽"
              className="input-classic"
              maxLength={1}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs text-text-muted">
              第三字（可选）
            </label>
            <input
              value={thirdChar}
              onChange={(e) => setThirdChar(e.target.value)}
              placeholder="例如：轩"
              className="input-classic"
              maxLength={1}
            />
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={isCalculating}
          className="btn-primary flex w-full items-center justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
              排盘计算中...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              排八字 + 为宝宝起名
            </>
          )}
        </button>
      </div>

      {/* 八字结果 */}
      {baziResult && (
        <div className="animate-fade-in-up space-y-4">
          {/* 四柱排盘 */}
          <div className="card-classic p-5">
            <h2 className="mb-4 text-center text-sm font-bold text-gold">
              ✦ 四柱八字 ✦
            </h2>
            <div className="grid grid-cols-4 gap-3">
              <PillarCard label="年柱" gan={baziResult.year.gan} zhi={baziResult.year.zhi} />
              <PillarCard label="月柱" gan={baziResult.month.gan} zhi={baziResult.month.zhi} />
              <PillarCard label="日柱" gan={baziResult.day.gan} zhi={baziResult.day.zhi} />
              <PillarCard label="时柱" gan={baziResult.hour.gan} zhi={baziResult.hour.zhi} />
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-secondary">
              <span>生肖：{baziResult.shengXiao}</span>
              <span>日主：{baziResult.dayMaster}（{baziResult.dayMasterElement}）</span>
            </div>
          </div>

          {/* 五行分析 */}
          <div className="card-classic p-5">
            <h2 className="mb-4 text-sm font-bold text-gold">五行分布</h2>
            <div className="mb-4 grid grid-cols-5 gap-2">
              {["木", "火", "土", "金", "水"].map((element) => {
                const count = baziResult.wuXingCount[element] || 0;
                const maxCount = Math.max(...Object.values(baziResult.wuXingCount));
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={element} className="flex flex-col items-center">
                    <div className="relative flex h-24 w-full items-end justify-center">
                      <div
                        className={`w-full rounded-t border ${
                          wuXingBg[element]
                        } transition-all`}
                        style={{ height: `${Math.max(height, 10)}%` }}
                      />
                      <span className="absolute top-1 text-sm font-bold text-text-primary">
                        {count}
                      </span>
                    </div>
                    <div className={`mt-1 text-sm font-medium ${wuXingColors[element]}`}>
                      {element}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-lg bg-bg-input p-3 text-sm leading-relaxed text-text-secondary">
              {baziResult.wuXingAnalysis.summary}
            </div>
          </div>

          {/* 起名建议 */}
          {nameSuggestions.length > 0 && (
            <div className="card-classic p-5">
              <h2 className="mb-4 text-sm font-bold text-gold">
                ✦ 起名建议（共 {nameSuggestions.length} 个）✦
              </h2>
              <div className="space-y-3">
                {nameSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-bg-input p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gold">
                            {surname}
                          </span>
                          <span className="text-2xl font-bold text-text-primary">
                            {suggestion.name}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] ${
                              wuXingBg[suggestion.wuXing]
                            } ${wuXingColors[suggestion.wuXing]}`}
                          >
                            {suggestion.wuXing}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          {suggestion.meaning}
                        </p>
                        <p className="mt-1 text-[11px] italic text-text-muted">
                          出处：{suggestion.source}
                        </p>
                      </div>
                      <button
                        onClick={() => copyName(suggestion.name, idx)}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-gold/30 hover:text-gold"
                      >
                        {copiedIdx === idx ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted">
          仅供参考娱乐 · 正式起名建议咨询专业命理师
        </p>
      </div>
    </div>
  );
}
