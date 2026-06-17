"use client";

import { useState, useEffect } from "react";
import { Flame, Check, Clock, X } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

interface LampType { id: string; name: string; desc: string; color: string; }
interface Duration { id: string; label: string; price: number; }
interface WishItem { id: number; name: string; maskedName: string; lamp: string; wish: string; time: string; }

const lampTypes: LampType[] = [
  { id: "pingan", name: "平安灯", desc: "祈愿出入平安、家宅安宁", color: "#C45C5C" },
  { id: "qingxin", name: "清心灯", desc: "祈愿身心安宁、烦恼消解", color: "#6B8E5A" },
  { id: "changshou", name: "长寿灯", desc: "祈愿身体健康、福寿绵长", color: "#D4AF77" },
  { id: "caiyuan", name: "财源灯", desc: "祈愿财源广进、事业顺遂", color: "#C5A55A" },
  { id: "yuanman", name: "姻缘灯", desc: "祈愿姻缘美满、感情和谐", color: "#C4698A" },
  { id: "xueye", name: "学业灯", desc: "祈愿学业进步、金榜题名", color: "#5A8EC4" },
];

const durations: Duration[] = [
  { id: "month", label: "一月供奉", price: 9.9 },
  { id: "hundred", label: "百日供奉", price: 29.9 },
  { id: "year", label: "一年供奉", price: 99 },
  { id: "eternal", label: "永久长明", price: 299 },
];

const relationships = ["父母", "子女", "伴侣", "自己", "长辈", "其他"];

// 名字脱敏
function maskName(name: string): string {
  if (name.length <= 1) return name + "*";
  if (name.length === 2) return name[0] + "*";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
}

// 模拟祈愿墙数据（演示）
const demoWishes: WishItem[] = [
  { id: 1, name: "王秀英", maskedName: "王*英", lamp: "平安灯", wish: "愿全家平安健康", time: "今日" },
  { id: 2, name: "李明", maskedName: "李*明", lamp: "长寿灯", wish: "愿父母福寿安康", time: "今日" },
  { id: 3, name: "张小芳", maskedName: "张*芳", lamp: "姻缘灯", wish: "愿感情美满幸福", time: "昨日" },
  { id: 4, name: "陈伟", maskedName: "陈*", lamp: "财源灯", wish: "事业蒸蒸日上", time: "昨日" },
  { id: 5, name: "刘婷婷", maskedName: "刘*婷", lamp: "学业灯", wish: "金榜题名", time: "2天前" },
  { id: 6, name: "赵建国", maskedName: "赵*国", lamp: "清心灯", wish: "身心安宁无忧", time: "2天前" },
  { id: 7, name: "孙丽", maskedName: "孙*", lamp: "平安灯", wish: "出入平安吉祥", time: "3天前" },
  { id: 8, name: "周晓东", maskedName: "周*东", lamp: "长寿灯", wish: "长辈健康长寿", time: "3天前" },
];

const lampColorMap: Record<string, string> = {
  "平安灯": "#C45C5C", "清心灯": "#6B8E5A", "长寿灯": "#D4AF77",
  "财源灯": "#C5A55A", "姻缘灯": "#C4698A", "学业灯": "#5A8EC4",
};

type Step = "form" | "paying" | "success";

export default function PrayPage() {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("父母");
  const [selectedLamp, setSelectedLamp] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [wish, setWish] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [countdown, setCountdown] = useState(300);
  const [wallWishes, setWallWishes] = useState<WishItem[]>([]);

  const selectedLampData = lampTypes.find((l) => l.id === selectedLamp);
  const selectedDurationData = durations.find((d) => d.id === selectedDuration);

  useEffect(() => {
    // 加载祈愿墙：模拟数据 + 用户自己的
    const userWishes = JSON.parse(localStorage.getItem("lqt_wall_wishes") || "[]");
    setWallWishes([...userWishes, ...demoWishes]);
  }, []);

  useEffect(() => {
    if (step !== "paying") return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); setStep("form"); setError("支付超时，请重新提交"); return 300; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const handleSubmit = () => {
    setError("");
    if (!name.trim()) { setError("请输入家人姓名"); return; }
    if (!selectedLamp) { setError("请选择一盏灯"); return; }
    if (!selectedDuration) { setError("请选择供奉时长"); return; }
    setStep("paying");
    setCountdown(300);
  };

  const handlePaid = () => {
    // 保存到祈愿墙
    const newItem: WishItem = {
      id: Date.now(),
      name: name,
      maskedName: maskName(name),
      lamp: selectedLampData?.name || "",
      wish: wish || "愿心愿成就",
      time: "刚刚",
    };
    const userWishes = JSON.parse(localStorage.getItem("lqt_wall_wishes") || "[]");
    userWishes.unshift(newItem);
    localStorage.setItem("lqt_wall_wishes", JSON.stringify(userWishes));
    setWallWishes([newItem, ...wallWishes]);

    // 保存点灯记录
    const history = JSON.parse(localStorage.getItem("lqt_lamps_history") || "[]");
    history.unshift({ orderId: Date.now(), name, relationship, lamp: selectedLampData?.name, duration: selectedDurationData?.label, price: selectedDurationData?.price, wish, time: new Date().toISOString() });
    localStorage.setItem("lqt_lamps_history", JSON.stringify(history));
    setStep("success");
  };

  const resetForm = () => {
    setName(""); setSelectedLamp(""); setSelectedDuration(""); setWish(""); setError(""); setStep("form");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="page-container">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
          <Flame className="h-6 w-6 animate-flicker text-gold" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gold">为家人祈福</h1>
        <p className="text-sm text-text-secondary">点一盏灯，挂家人姓名，愿心愿成就</p>
      </div>

      {/* ===== 祈愿墙 ===== */}
      <div className="card-classic mb-6 p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-gold">
          <Flame className="h-4 w-4" /> 祈愿墙（共 {wallWishes.length} 盏灯）
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {wallWishes.slice(0, 16).map((item) => {
            const color = lampColorMap[item.lamp] || "#D4AF77";
            return (
              <div key={item.id} className="rounded-xl border border-border bg-bg-input p-3 text-center">
                <div className="mb-2 flex justify-center">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full opacity-30 blur-md" style={{ backgroundColor: color }} />
                    <Flame className="absolute inset-0 m-auto h-5 w-5 animate-flicker" style={{ color }} />
                  </div>
                </div>
                <div className="text-sm font-medium text-text-primary">{item.maskedName}</div>
                <div className="text-[10px] text-gold">{item.lamp}</div>
                <div className="mt-1 truncate text-[10px] text-text-muted" title={item.wish}>{item.wish}</div>
                <div className="text-[9px] text-text-muted/60">{item.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== 点灯表单 ===== */}
      {step === "form" && (
        <div className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
          )}
          <div className="card-classic p-5">
            <h2 className="mb-4 text-sm font-bold text-text-primary">家人信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs text-text-muted">家人姓名</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：王秀英" className="input-classic" />
              </div>
              <div>
                <label className="mb-2 block text-xs text-text-muted">与您的关系</label>
                <select value={relationship} onChange={(e) => setRelationship(e.target.value)} className="input-classic">
                  {relationships.map((r) => (<option key={r} value={r} className="bg-bg-card">{r}</option>))}
                </select>
              </div>
            </div>
          </div>

          <div className="card-classic p-5">
            <h2 className="mb-4 text-sm font-bold text-text-primary">选一盏灯</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {lampTypes.map((lamp) => {
                const isSelected = selectedLamp === lamp.id;
                return (
                  <button key={lamp.id} onClick={() => setSelectedLamp(lamp.id)} className={`relative rounded-xl border p-4 text-center transition-all ${isSelected ? "border-gold bg-gold/10" : "border-border bg-bg-input hover:border-border-light"}`}>
                    <div className="mb-2 flex justify-center">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full opacity-30 blur-md" style={{ backgroundColor: lamp.color }} />
                        <Flame className={`absolute inset-0 m-auto h-5 w-5 ${isSelected ? "animate-flicker" : ""}`} style={{ color: lamp.color }} />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-text-primary">{lamp.name}</div>
                    <div className="mt-1 text-[10px] leading-tight text-text-muted">{lamp.desc}</div>
                    {isSelected && <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold"><Check className="h-2.5 w-2.5 text-bg-primary" /></div>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card-classic p-5">
            <h2 className="mb-4 text-sm font-bold text-text-primary">供奉时长</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {durations.map((d) => {
                const isSelected = selectedDuration === d.id;
                return (
                  <button key={d.id} onClick={() => setSelectedDuration(d.id)} className={`rounded-xl border p-4 text-center transition-all ${isSelected ? "border-gold bg-gold/10" : "border-border bg-bg-input hover:border-border-light"}`}>
                    <div className="flex items-center justify-center gap-1 text-xs text-text-secondary"><Clock className="h-3 w-3" />{d.label}</div>
                    <div className="mt-2 text-lg font-bold text-gold">¥{d.price}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card-classic p-5">
            <h2 className="mb-4 text-sm font-bold text-text-primary">心愿（可选）</h2>
            <textarea value={wish} onChange={(e) => setWish(e.target.value)} rows={3} placeholder="例如：愿父母身体健康、平安喜乐" className="input-classic resize-none" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-bg-card p-4">
            <div>
              <div className="text-xs text-text-muted">需供奉</div>
              <div className="text-2xl font-bold text-gold">¥{selectedDurationData?.price || 0}</div>
            </div>
            <button onClick={handleSubmit} className="btn-primary">
              <span className="flex items-center gap-2"><Flame className="h-4 w-4" />点亮此灯</span>
            </button>
          </div>
        </div>
      )}

      {/* 支付页面 */}
      {step === "paying" && selectedLampData && selectedDurationData && (
        <div className="animate-fade-in space-y-4">
          <div className="card-classic p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gold">等待付款</span>
              <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">剩余 {formatTime(countdown)}</span>
            </div>
            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">祈福对象</span><span className="text-text-primary">{name}（{relationship}）</span></div>
              <div className="flex justify-between"><span className="text-text-muted">供奉内容</span><span className="text-text-primary">{selectedLampData.name} · {selectedDurationData.label}</span></div>
              <div className="flex justify-between border-t border-border pt-2"><span className="text-text-muted">需付款</span><span className="text-xl font-bold text-gold">¥{selectedDurationData.price}</span></div>
            </div>
          </div>
          <div className="card-classic overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/10 p-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500 text-xs font-bold text-white">支</div>
                <span className="text-sm font-bold text-blue-400">支付宝扫码付款</span>
              </div>
              <div className="mx-auto my-4 flex h-48 w-48 items-center justify-center rounded-xl bg-white p-3">
                <img src="/alipay-qr.png" alt="支付宝收款码" className="h-full w-full object-contain" onError={(e) => { const t = e.currentTarget; t.style.display = "none"; if (t.parentElement) { t.parentElement.innerHTML = '<div class="text-gray-400 text-xs">收款码加载中</div>'; } }} />
              </div>
              <p className="text-sm font-bold text-blue-400">付款金额：¥{selectedDurationData.price}</p>
            </div>
            <div className="space-y-2 p-4">
              <button onClick={handlePaid} className="btn-primary w-full"><span className="flex items-center justify-center gap-2"><Check className="h-4 w-4" />我已完成付款</span></button>
              <button onClick={() => { setStep("form"); setError(""); }} className="w-full rounded-xl border border-border py-3 text-sm text-text-secondary">取消并返回</button>
            </div>
          </div>
        </div>
      )}

      {/* 成功页面 */}
      {step === "success" && selectedLampData && (
        <div className="animate-fade-in-up">
          <div className="card-classic relative overflow-hidden p-8 text-center">
            <button onClick={resetForm} className="absolute right-3 top-3 text-text-muted hover:text-text-primary"><X className="h-5 w-5" /></button>
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="h-20 w-20 rounded-full opacity-30 blur-xl animate-flame-glow" style={{ backgroundColor: selectedLampData.color }} />
                <Flame className="absolute inset-0 m-auto h-12 w-12 animate-flicker" style={{ color: selectedLampData.color }} />
              </div>
            </div>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20"><Check className="h-6 w-6 text-green-400" /></div>
            <h3 className="mb-2 text-xl font-bold text-gold">点灯成功</h3>
            <p className="mb-1 text-text-primary">{selectedLampData.name}已为<span className="font-bold text-gold"> {name} </span>点亮</p>
            <p className="mb-4 text-sm text-text-secondary">{selectedDurationData?.label} · 愿心愿成就，福寿安康</p>
            {wish && <div className="mb-4 rounded-lg bg-bg-input p-3 text-sm text-text-secondary">💭 {wish}</div>}
            <button onClick={resetForm} className="btn-secondary w-full">再点一盏灯</button>
          </div>
        </div>
      )}
    </div>
  );
}
