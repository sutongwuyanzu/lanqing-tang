"use client";

import { useState, useEffect } from "react";
import {
  Flame,
  Check,
  Clock,
  X,
  QrCode,
  Smartphone,
  AlertCircle,
  Copy,
  Loader2,
} from "lucide-react";

interface LampType {
  id: string;
  name: string;
  desc: string;
  color: string;
}

interface Duration {
  id: string;
  label: string;
  price: number;
}

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

// ⚠️ 配置：替换为你的支付宝收款码图片（放到 public/ 目录下）
// 上传你的支付宝收款码截图到 public/alipay-qr.png
const ALIPAY_QR_URL = "/alipay-qr.png";

// 支付宝转账链接（可选：如果你有支付宝收款链接）
// 格式：https://qr.alipay.com/xxxxx
const ALIPAY_LINK = "";

// 5分钟倒计时
const PAY_COUNTDOWN = 5 * 60;

type Step = "form" | "paying" | "success";

export default function PrayPage() {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("父母");
  const [selectedLamp, setSelectedLamp] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [wish, setWish] = useState("");
  const [error, setError] = useState("");

  // 支付流程状态
  const [step, setStep] = useState<Step>("form");
  const [orderId, setOrderId] = useState("");
  const [countdown, setCountdown] = useState(PAY_COUNTDOWN);
  const [copied, setCopied] = useState(false);

  const selectedLampData = lampTypes.find((l) => l.id === selectedLamp);
  const selectedDurationData = durations.find((d) => d.id === selectedDuration);

  // 生成订单号
  const generateOrderId = () => {
    const now = new Date();
    const ymd =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    return `LQT${ymd}${random}`;
  };

  // 提交 → 进入支付
  const handleSubmit = () => {
    setError("");
    if (!name.trim()) {
      setError("请输入家人姓名");
      return;
    }
    if (!selectedLamp) {
      setError("请选择一盏灯");
      return;
    }
    if (!selectedDuration) {
      setError("请选择供奉时长");
      return;
    }
    setOrderId(generateOrderId());
    setStep("paying");
    setCountdown(PAY_COUNTDOWN);
  };

  // 倒计时
  useEffect(() => {
    if (step !== "paying") return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          // 超时返回表单
          setStep("form");
          setError("支付超时，请重新提交");
          return PAY_COUNTDOWN;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // 已完成支付（模拟）
  const handlePaid = () => {
    // 保存点灯记录到本地
    const history = JSON.parse(
      localStorage.getItem("lqt_lamps_history") || "[]"
    );
    history.unshift({
      orderId,
      name,
      relationship,
      lamp: selectedLampData?.name,
      duration: selectedDurationData?.label,
      price: selectedDurationData?.price,
      wish,
      time: new Date().toISOString(),
    });
    localStorage.setItem("lqt_lamps_history", JSON.stringify(history));
    setStep("success");
  };

  // 复制订单号
  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 打开支付宝（如果有链接）
  const openAlipay = () => {
    if (ALIPAY_LINK) {
      window.open(ALIPAY_LINK, "_blank");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const resetForm = () => {
    setName("");
    setSelectedLamp("");
    setSelectedDuration("");
    setWish("");
    setError("");
    setStep("form");
  };

  return (
    <div className="page-container">
      {/* 标题 */}
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
          <Flame className="h-6 w-6 animate-flicker text-gold" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gold">为家人祈福</h1>
        <p className="text-sm text-text-secondary">
          点一盏灯，挂家人姓名，愿心愿成就
        </p>
      </div>

      {/* ========== 步骤 1：填写表单 ========== */}
      {step === "form" && (
        <div className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* 家人信息 */}
          <div className="card-classic p-5">
            <h2 className="mb-4 text-sm font-bold text-text-primary">家人信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs text-text-muted">
                  家人姓名
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：王秀英"
                  className="input-classic"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs text-text-muted">
                  与您的关系
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="input-classic"
                >
                  {relationships.map((r) => (
                    <option key={r} value={r} className="bg-bg-card">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 选灯 */}
          <div className="card-classic p-5">
            <h2 className="mb-4 text-sm font-bold text-text-primary">选一盏灯</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {lampTypes.map((lamp) => {
                const isSelected = selectedLamp === lamp.id;
                return (
                  <button
                    key={lamp.id}
                    onClick={() => setSelectedLamp(lamp.id)}
                    className={`relative rounded-xl border p-4 text-center transition-all ${
                      isSelected
                        ? "border-gold bg-gold/10"
                        : "border-border bg-bg-input hover:border-border-light"
                    }`}
                  >
                    <div className="mb-2 flex justify-center">
                      <div className="relative">
                        <div
                          className="h-8 w-8 rounded-full opacity-30 blur-md"
                          style={{ backgroundColor: lamp.color }}
                        />
                        <Flame
                          className={`absolute inset-0 m-auto h-5 w-5 ${
                            isSelected ? "animate-flicker" : ""
                          }`}
                          style={{ color: lamp.color }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-text-primary">
                      {lamp.name}
                    </div>
                    <div className="mt-1 text-[10px] leading-tight text-text-muted">
                      {lamp.desc}
                    </div>
                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold">
                        <Check className="h-2.5 w-2.5 text-bg-primary" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 供奉时长 */}
          <div className="card-classic p-5">
            <h2 className="mb-4 text-sm font-bold text-text-primary">供奉时长</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {durations.map((d) => {
                const isSelected = selectedDuration === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDuration(d.id)}
                    className={`rounded-xl border p-4 text-center transition-all ${
                      isSelected
                        ? "border-gold bg-gold/10"
                        : "border-border bg-bg-input hover:border-border-light"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-xs text-text-secondary">
                      <Clock className="h-3 w-3" />
                      {d.label}
                    </div>
                    <div className="mt-2 text-lg font-bold text-gold">
                      ¥{d.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 心愿 */}
          <div className="card-classic p-5">
            <h2 className="mb-4 text-sm font-bold text-text-primary">
              心愿（可选）
            </h2>
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              rows={3}
              placeholder="例如：愿父母身体健康、平安喜乐"
              className="input-classic resize-none"
            />
          </div>

          {/* 提交栏 */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-bg-card p-4">
            <div>
              <div className="text-xs text-text-muted">需供奉</div>
              <div className="text-2xl font-bold text-gold">
                ¥{selectedDurationData?.price || 0}
              </div>
            </div>
            <button onClick={handleSubmit} className="btn-primary">
              <span className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                点亮此灯
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ========== 步骤 2：支付宝扫码付款 ========== */}
      {step === "paying" && selectedLampData && selectedDurationData && (
        <div className="animate-fade-in space-y-4">
          {/* 订单信息 */}
          <div className="card-classic p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gold" />
                <span className="text-sm font-medium text-gold">
                  等待付款
                </span>
              </div>
              <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                剩余 {formatTime(countdown)}
              </span>
            </div>

            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">祈福对象</span>
                <span className="text-text-primary">
                  {name}（{relationship}）
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">供奉内容</span>
                <span className="text-text-primary">
                  {selectedLampData.name} · {selectedDurationData.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">订单编号</span>
                <button
                  onClick={copyOrderId}
                  className="flex items-center gap-1 text-text-secondary hover:text-gold"
                >
                  {orderId.slice(-8)}
                  {copied ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-text-muted">需付款</span>
                <span className="text-xl font-bold text-gold">
                  ¥{selectedDurationData.price}
                </span>
              </div>
            </div>
          </div>

          {/* 支付宝二维码 */}
          <div className="card-classic overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/10 p-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500 text-xs font-bold text-white">
                  支
                </div>
                <span className="text-sm font-bold text-blue-400">
                  支付宝扫码付款
                </span>
              </div>

              {/* 二维码区域 */}
              <div className="mx-auto my-4 flex h-48 w-48 items-center justify-center rounded-xl bg-white p-3">
                {/* ⚠️ 替换为你的支付宝收款码图片 */}
                {/* 将支付宝收款码截图命名为 alipay-qr.png 放到 public/ 目录 */}
                <img
                  src={ALIPAY_QR_URL}
                  alt="支付宝收款码"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    // 如果图片不存在，显示占位
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="flex flex-col items-center justify-center h-full w-full text-gray-400">
                          <div class="text-4xl mb-2">💳</div>
                          <div class="text-xs text-center px-4">
                            请将支付宝收款码<br/>命名为 alipay-qr.png<br/>放到 public/ 目录
                          </div>
                        </div>`;
                    }
                  }}
                />
              </div>

              <p className="mb-2 text-xs text-blue-300/70">
                请用 <span className="font-bold">支付宝</span> 扫描上方二维码
              </p>
              <p className="text-sm font-bold text-blue-400">
                付款金额：¥{selectedDurationData.price}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-2 p-4">
              {ALIPAY_LINK && (
                <button
                  onClick={openAlipay}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600"
                >
                  <Smartphone className="h-4 w-4" />
                  打开支付宝付款
                </button>
              )}

              <button
                onClick={handlePaid}
                className="btn-primary w-full"
              >
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  我已完成付款
                </span>
              </button>

              <button
                onClick={() => {
                  setStep("form");
                  setError("");
                }}
                className="w-full rounded-xl border border-border py-3 text-sm text-text-secondary transition-colors hover:bg-bg-card-hover"
              >
                取消并返回
              </button>
            </div>
          </div>

          {/* 提示 */}
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-gold" />
              <div className="space-y-1 text-xs text-text-secondary">
                <p>📱 请使用支付宝扫描二维码，付款金额为 ¥{selectedDurationData.price}</p>
                <p>✅ 付款完成后，请点击&ldquo;我已完成付款&rdquo;按钮</p>
                <p>⏰ 订单将在 {formatTime(countdown)} 后超时，请尽快完成</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== 步骤 3：支付成功 ========== */}
      {step === "success" && selectedLampData && (
        <div className="animate-fade-in-up">
          <div className="card-classic relative overflow-hidden p-8 text-center">
            <button
              onClick={resetForm}
              className="absolute right-3 top-3 text-text-muted hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>

            {/* 火焰动画 */}
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div
                  className="h-20 w-20 rounded-full opacity-30 blur-xl animate-flame-glow"
                  style={{ backgroundColor: selectedLampData.color }}
                />
                <Flame
                  className="absolute inset-0 m-auto h-12 w-12 animate-flicker"
                  style={{ color: selectedLampData.color }}
                />
              </div>
            </div>

            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <Check className="h-6 w-6 text-green-400" />
            </div>

            <h3 className="mb-2 text-xl font-bold text-gold">点灯成功</h3>
            <p className="mb-1 text-text-primary">
              {selectedLampData.name}已为
              <span className="font-bold text-gold"> {name} </span>
              点亮
            </p>
            <p className="mb-4 text-sm text-text-secondary">
              {selectedDurationData?.label} · 愿心愿成就，福寿安康
            </p>

            <div className="mb-4 rounded-lg bg-bg-input p-3 text-sm text-text-muted">
              订单号：{orderId}
            </div>

            {wish && (
              <div className="mb-4 rounded-lg bg-bg-input p-3 text-sm text-text-secondary">
                💭 {wish}
              </div>
            )}

            <button onClick={resetForm} className="btn-secondary w-full">
              再点一盏灯
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-text-muted">
            🙏 功德无量 · 愿佛祖保佑您和家人
          </div>
        </div>
      )}
    </div>
  );
}
