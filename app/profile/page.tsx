"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User as UserIcon,
  ScrollText,
  MoonStar,
  Flame,
  Baby,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface UserInfo {
  email: string;
  nickname: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState({ lots: 0, dreams: 0, lamps: 0 });

  useEffect(() => {
    const userStr = localStorage.getItem("lqt_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userStr));

    // 读取历史记录统计
    const lotsHistory = JSON.parse(
      localStorage.getItem("lqt_lots_history") || "[]"
    );
    const dreamsHistory = JSON.parse(
      localStorage.getItem("lqt_dreams_history") || "[]"
    );
    const lampsHistory = JSON.parse(
      localStorage.getItem("lqt_lamps_history") || "[]"
    );
    setStats({
      lots: lotsHistory.length,
      dreams: dreamsHistory.length,
      lamps: lampsHistory.length,
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("lqt_user");
    router.push("/");
  };

  if (!user) return null;

  const menuItems = [
    {
      href: "/lingqian",
      icon: ScrollText,
      label: "我的灵签",
      count: stats.lots,
      color: "text-gold",
    },
    {
      href: "/dream",
      icon: MoonStar,
      label: "解梦记录",
      count: stats.dreams,
      color: "text-blue-400",
    },
    {
      href: "/pray",
      icon: Flame,
      label: "祈福功德",
      count: stats.lamps,
      color: "text-red-400",
    },
    {
      href: "/bazi",
      icon: Baby,
      label: "起名收藏",
      count: 0,
      color: "text-green-400",
    },
  ];

  return (
    <div className="page-container">
      {/* 用户信息卡 */}
      <div className="card-classic mb-6 overflow-hidden">
        <div className="bg-gradient-to-br from-gold/20 to-transparent p-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
            <UserIcon className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-xl font-bold text-gold">{user.nickname}</h1>
          <p className="mt-1 text-xs text-text-muted">{user.email}</p>
        </div>

        {/* 功德统计 */}
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-gold">{stats.lots}</div>
            <div className="text-xs text-text-muted">求签</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-gold">{stats.dreams}</div>
            <div className="text-xs text-text-muted">解梦</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-gold">{stats.lamps}</div>
            <div className="text-xs text-text-muted">点灯</div>
          </div>
        </div>
      </div>

      {/* 功能菜单 */}
      <div className="card-classic mb-6 overflow-hidden">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between p-4 transition-colors hover:bg-bg-card-hover ${
                idx !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-sm text-text-primary">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count > 0 && (
                  <span className="text-xs text-text-muted">
                    {item.count} 条
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-text-muted" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 退出登录 */}
      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 py-3 text-sm text-red-400 transition-colors hover:bg-red-500/10"
      >
        <LogOut className="h-4 w-4" />
        退出登录
      </button>

      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted">
          兰清堂 · 心诚则灵 · 福报自来
        </p>
      </div>
    </div>
  );
}
