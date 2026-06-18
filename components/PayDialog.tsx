"use client";

// 统一付款弹窗组件 —— 灵签/祈福/起名三个支付入口共用
//
// 两种付款方式（手机端友好）：
// 1. 主推「支付宝 App 付款」按钮：调 alipays:// scheme 唤起支付宝 App
// 2. 备用收款码图片：长按保存后用支付宝扫码
// 用户完成付款后点「我已完成付款」触发 onPaid 回调。

import { useState } from "react";
import { Check, X, Lock, Smartphone, AlertCircle } from "lucide-react";
import { openAlipay, isInWeChatBrowser } from "@/lib/payment";

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

export function PayDialog({
  open,
  onClose,
  title,
  description,
  amount,
  onPaid,
}: PayDialogProps) {
  const [triedAlipay, setTriedAlipay] = useState(false);

  if (!open) return null;

  const handleAlipay = () => {
    const ok = openAlipay();
    setTriedAlipay(true);
    if (!ok) {
      // 微信内无法唤起，提示用户用浏览器打开
      // （isInWeChatBrowser 已在 openAlipay 内判断，这里重复检测用于 UI）
    }
  };

  const inWeChat = typeof navigator !== "undefined" && isInWeChatBrowser();

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
          <p className="mb-4 text-sm text-text-secondary">{description}</p>
        )}

        {/* 金额 */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-gold">¥{amount}</span>
        </div>

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

        {/* 备用：收款码图片 */}
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
