"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard, Settings, Key, MessageSquare, Code2,
  MessageCircle, LogOut, ChevronLeft, Palette, BookOpen,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/dashboard/appearance", icon: Palette, label: "Appearance" },
  { href: "/dashboard/knowledge", icon: BookOpen, label: "Knowledge Base" },
  { href: "/dashboard/api-key", icon: Key, label: "API Key" },
  { href: "/dashboard/conversations", icon: MessageSquare, label: "Conversations" },
  { href: "/dashboard/embed", icon: Code2, label: "Embed Code" },
];

interface SidebarProps {
  userName: string;
  userEmail: string;
}

export default function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#FBFBFC] border-r border-slate-200/60 flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-slate-200/60">
        <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center shadow-sm">
          <MessageCircle size={14} className="text-white" />
        </div>
        <span className="text-base font-semibold tracking-tight text-slate-900">
          ChatSathi
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
              }`}
            >
              <item.icon size={16} className={isActive ? "text-slate-300" : "text-slate-400"} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-200/60 p-3 space-y-1">
        <div className="px-3 py-2 mb-1">
          <p className="text-[13px] font-medium text-slate-900 truncate">{userName}</p>
          <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft size={16} className="text-slate-400" /> Back to Home
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} className="text-slate-400" /> Logout
        </button>
      </div>
    </aside>
  );
}
