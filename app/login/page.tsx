"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("请输入邮箱和密码");
      return;
    }
    setLoading(true);

    // 模拟登录/注册流程
    setTimeout(() => {
      // 保存模拟用户信息到 localStorage
      localStorage.setItem(
        "lqt_user",
        JSON.stringify({
          email,
          nickname: nickname || email.split("@")[0],
        })
      );
      setLoading(false);
      router.push("/profile");
    }, 1000);
  };

  return (
    <div className="page-container">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
          <Sparkles className="h-6 w-6 text-gold" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gold">兰清堂</h1>
        <p className="text-sm text-text-secondary">心诚则灵，福报自来</p>
      </div>

      <div className="card-classic p-6">
        {/* 切换登录/注册 */}
        <div className="mb-6 flex rounded-lg bg-bg-input p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-gold text-bg-primary"
                : "text-text-secondary"
            }`}
          >
            登录
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "register"
                ? "bg-gold text-bg-primary"
                : "text-text-secondary"
            }`}
          >
            注册
          </button>
        </div>

        <div className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="mb-2 block text-xs text-text-muted">昵称</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="您的称呼"
                  className="input-classic pl-10"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs text-text-muted">邮箱</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="您的邮箱"
                className="input-classic pl-10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-text-muted">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="您的密码"
                className="input-classic pl-10"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading
              ? "请稍候..."
              : mode === "login"
                ? "登录"
                : "注册并登录"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-text-muted">
          💡 当前为演示模式，登录信息仅保存在本地浏览器
        </p>
      </div>
    </div>
  );
}
