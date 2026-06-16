"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Flame,
  CalendarDays,
  ScrollText,
  User,
  MoreHorizontal,
} from "lucide-react";

const bottomNavItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/pray", label: "祈福", icon: Flame },
  { href: "/dream", label: "解梦", icon: CalendarDays },
  { href: "/lingqian", label: "灵签", icon: ScrollText },
];

const moreNavItems = [
  { href: "/bazi", label: "八字起名" },
  { href: "/profile", label: "个人中心" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-primary/95 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 transition-colors ${
                  isActive ? "text-gold" : "text-text-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* More menu */}
          <div className="group relative">
            <button className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-text-muted transition-colors">
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] font-medium">更多</span>
            </button>
            <div className="invisible absolute -top-full right-0 mb-2 w-32 rounded-lg border border-border bg-bg-elevated p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
              {moreNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-bg-card hover:text-text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* Safe area for iPhone */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}
