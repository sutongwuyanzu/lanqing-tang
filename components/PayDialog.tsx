"use client";

// 统一付款弹窗组件 —— 灵签/祈福/起名三个支付入口共用
//
// 双码并存（用户习惯不同，两种都支持）：
// 1. 支付宝：主推「跳转支付宝 App 付款」按钮，调 alipays:// scheme 一键唤起
// 2. 微信：展示微信收款码图片。
//    - 微信内打开：直接长按图片识别收款码（微信原生能力）
//    - 微信外打开：引导用户保存图片 → 打开微信扫一扫
//   （微信个人码不支持 scheme 唤起，这是微信平台限制，非技术问题）

import { useState } from "react";
import { Check, X, Lock, Smartphone, AlertCircle, Download } from "lucide-react";
import {
  openAlipay,
  isOpenedInWeChat,
  WECHAT_QR_IMAGE,
} from "@/lib/payment";

interface PayDialogProps {
  /** 是否显示 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 标题（如"加抽灵签"） */
  title: string;
  /** 描述（如"今日免费次数已用完"） */
  description?: string;
  /** 付款金额（元） */
  amount: number;
  /** 用户完成付款后的回调 */
  onPaid: () => void;
}

type PayTab = "alipay" | "wechat";

export function PayDialog({
  open,
  onClose,
  title,
  description,
  amount,
  onPaid,
}: PayDialogProps) {
  // 默认标签：微信内打开优先微信（体验更顺），否则优先支付宝（可一键唤起）
  const [tab, setTab] = useState<PayTab>(
    typeof navigator !== "undefined" && isOpenedInWeChat() ? "wechat" : "alipay"
  );
  const [triedAlipay, setTriedAlipay] = useState(false);

  if (!open) return null;

  const inWeChat = typeof navigator !== "undefined" && isOpenedInWeChat();

  const handleAlipay = () => {
    const ok = openAlipay();
    setTriedAlipay(true);
    // 微信内 openAlipay 返回 false（被拦截），UI 会显示对应提示
    void ok;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="animate-fade-in-up relative w-full max-w-sm rounded-2xl border border-gold/20 bg-bg-card p-6 text-center">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-text-muted transition-colors hover:text-text-primary"
          aria-label="关闭"
        >
          <X className="h-5 w-5" />
        </button>

        <Lock className="mx-auto mb-3 h-10 w-10 text-gold" />
        <h3 className="mb-2 text-xl font-bold text-gold">{title}</h3>
        {description && (
          <p className="mb-3 text-sm text-text-secondary">{description}</p>
        )}

        {/* 金额 */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-gold">¥{amount}</span>
        </div>

        {/* 付款方式切换 */}
        <div className="mb-4 flex gap-2 rounded-xl bg-bg-input p-1">
          <button
            onClick={() => setTab("alipay")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${
              tab === "alipay"
                ? "bg-[#1677ff] text-white"
                : "text-text-secondary"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            支付宝
          </button>
          <button
            onClick={() => setTab("wechat")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${
              tab === "wechat"
                ? "bg-[#07c160] text-white"
                : "text-text-secondary"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            微信
          </button>
        </div>

        {/* ===== 支付宝面板 ===== */}
        {tab === "alipay" && (
          <div>
            {/* 主推：支付宝 App 付款按钮 */}
            <button
              onClick={handleAlipay}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1677ff] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              <Smartphone className="h-4 w-4" />
              跳转支付宝 App 付款
            </button>

            {/* 微信内打开的特殊提示 */}
            {inWeChat && triedAlipay && (
              <div className="mb-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-left text-[11px] leading-relaxed text-yellow-400">
                <AlertCircle className="mr-1 inline h-3 w-3" />
                微信内无法直接唤起支付宝。请点击右上角 <strong>···</strong> →
                选择<strong>「在浏览器打开」</strong>，再点上方按钮付款。
              </div>
            )}

            {/* 非微信环境唤起失败时的兜底提示 */}
            {!inWeChat && triedAlipay && (
              <p className="mb-3 text-[11px] text-text-muted">
                若未自动跳转支付宝，可长按下方收款码保存后扫码付款
              </p>
            )}

            {/* 分隔线 */}
            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] text-text-muted">或扫码付款</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* 支付宝收款码 */}
            <div className="mx-auto mb-4 h-44 w-44 overflow-hidden rounded-xl border border-border bg-white p-2">
              <img
                src="/alipay-qr.png"
                alt="支付宝收款码"
                className="h-full w-full object-contain"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                  if (t.parentElement) {
                    t.parentElement.innerHTML =
                      '<div class="flex h-full w-full items-center justify-center text-gray-400 text-xs">收款码加载中</div>';
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* ===== 微信面板 ===== */}
        {tab === "wechat" && (
          <div>
            {/* 微信收款码（微信内可长按识别，微信外需保存后扫码） */}
            <div className="mx-auto mb-3 h-48 w-48 overflow-hidden rounded-xl border border-border bg-white p-2">
              <img
                src={WECHAT_QR_IMAGE}
                alt="微信收款码"
                className="h-full w-full object-contain"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                  if (t.parentElement) {
                    t.parentElement.innerHTML =
                      '<div class="flex h-full w-full flex-col items-center justify-center text-gray-400 text-xs"><span>收款码加载中</span></div>';
                  }
                }}
              />
            </div>

            {/* 引导提示：微信内外不同 */}
            {inWeChat ? (
              <div className="mb-3 rounded-lg border border-[#07c160]/30 bg-[#07c160]/10 px-3 py-2 text-left text-[11px] leading-relaxed text-[#07c160]">
                <Check className="mr-1 inline h-3 w-3" />
                长按上方收款码图片，选择<strong>「识别图中二维码」</strong>
                即可直接付款
              </div>
            ) : (
              <div className="mb-3 rounded-lg border border-border bg-bg-input px-3 py-2 text-left text-[11px] leading-relaxed text-text-secondary">
                <Download className="mr-1 inline h-3 w-3 text-[#07c160]" />
                <strong className="text-text-primary">两步付款：</strong>
                ① 长按上方收款码保存到手机 → ② 打开微信「扫一扫」→
                右上角相册 → 选择刚保存的收款码
              </div>
            )}
          </div>
        )}

        {/* 我已完成付款 */}
        <button onClick={onPaid} className="btn-primary w-full">
          <span className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4" />
            我已完成付款
          </span>
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full rounded-xl border border-border py-2 text-sm text-text-secondary transition-colors hover:bg-bg-elevated"
        >
          取消
        </button>

        <p className="mt-3 text-[10px] text-text-muted">
          付款后请点击「我已完成付款」以确认订单
        </p>
      </div>
    </div>
  );
}
