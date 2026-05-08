"use client";
import React from "react";
import { motion } from "motion/react";
import {
  MessageSquare,
  MessagesSquare,
  Settings,
  Key,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  User,
  Activity,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ActivityItem {
  id: string;
  visitorId: string;
  messageCount: number;
  lastMessage: string;
  lastMessageAt: string;
}

interface Props {
  hasSettings: boolean;
  hasApiKey: boolean;
  conversationCount: number;
  messageCount: number;
  dailyCounts: { date: string; count: number }[];
  recentActivity: ActivityItem[];
}

// ─── Tiny SVG Area Chart ───
function MiniChart({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const max = Math.max(...data, 1);
  const w = 280;
  const h = 100;
  const padding = 4;

  const points = data.map((v, i) => ({
    x: padding + (i / (data.length - 1)) * (w - padding * 2),
    y: h - padding - (v / max) * (h - padding * 2),
  }));

  const linePath = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");

  const areaPath = `${linePath} L${points[points.length - 1].x},${h} L${points[0].x},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${color})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" stroke={color} strokeWidth="2" />
      ))}
    </svg>
  );
}

// ─── Progress Ring ───
function ProgressRing({
  progress,
  size = 52,
  stroke = 4,
}: {
  progress: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#7c3aed"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

export default function StatsOverview({
  hasSettings,
  hasApiKey,
  conversationCount,
  messageCount,
  dailyCounts,
  recentActivity,
}: Props) {
  const router = useRouter();

  const stats = [
    {
      label: "Total Conversations",
      value: conversationCount,
      icon: MessageSquare,
      statusColor: "bg-slate-900",
    },
    {
      label: "Total Messages",
      value: messageCount,
      icon: MessagesSquare,
      statusColor: "bg-slate-700",
    },
    {
      label: "Settings",
      value: hasSettings ? "Configured" : "Not Set",
      icon: Settings,
      statusColor: hasSettings ? "bg-emerald-500" : "bg-amber-500",
    },
    {
      label: "API Key",
      value: hasApiKey ? "Active" : "Not Set",
      icon: Key,
      statusColor: hasApiKey ? "bg-emerald-500" : "bg-amber-500",
    },
  ];

  const quickActions = [
    { label: "Configure Business Settings", href: "/dashboard/settings", done: hasSettings },
    { label: "Add Gemini API Key", href: "/dashboard/api-key", done: hasApiKey },
    { label: "Customize Appearance", href: "/dashboard/appearance", done: false },
    { label: "Get Embed Code", href: "/dashboard/embed", done: false },
  ];

  const completedSteps = quickActions.filter((a) => a.done).length;
  const progressPercent = Math.round((completedSteps / quickActions.length) * 100);

  const chartData = dailyCounts.map((d) => d.count);
  const dayLabels = dailyCounts.map((d) => {
    const date = new Date(d.date + "T00:00:00");
    return date.toLocaleDateString("en", { weekday: "short" });
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Your ChatSathi performance and setup progress.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${stat.statusColor}`} />
                <p className="text-[13px] font-medium text-slate-500">{stat.label}</p>
              </div>
              <stat.icon size={16} className="text-slate-400" />
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
              <TrendingUp size={14} className="text-slate-300 mb-1.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Setup Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200/60 flex items-center justify-between bg-[#FBFBFC]">
            <h2 className="text-[14px] font-semibold text-slate-900">Conversations (7 Days)</h2>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/60">
              {chartData.reduce((a, b) => a + b, 0)} total
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-end">
            <div className="h-[160px] w-full mb-3">
              <MiniChart data={chartData} color="#0f172a" />
            </div>
            <div className="flex justify-between px-1">
              {dayLabels.map((label, i) => (
                <span key={i} className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Setup */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200/60 flex items-center justify-between bg-[#FBFBFC]">
            <h2 className="text-[14px] font-semibold text-slate-900">Setup Guide</h2>
            <span className="text-[12px] font-medium text-slate-500">{completedSteps}/{quickActions.length}</span>
          </div>
          <div className="p-5 pb-2">
            <div className="w-full bg-slate-100 h-1.5 rounded-full mb-5 overflow-hidden">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.href)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left group"
              >
                {action.done ? (
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-slate-300 shrink-0 group-hover:text-amber-500 transition-colors" />
                )}
                <span className={`text-[13px] font-medium flex-1 ${action.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                  {action.label}
                </span>
                <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/60 flex items-center justify-between bg-[#FBFBFC]">
          <h2 className="text-[14px] font-semibold text-slate-900">Recent Activity</h2>
          {recentActivity.length > 0 && (
            <button
              onClick={() => router.push("/dashboard/conversations")}
              className="text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              View all
            </button>
          )}
        </div>

        {recentActivity.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <MessageSquare size={24} className="text-slate-300 mb-3" />
            <h3 className="text-[14px] font-medium text-slate-900">No conversations yet</h3>
            <p className="text-[13px] text-slate-500 mt-1">Activity will appear here once visitors start chatting.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivity.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(`/dashboard/conversations/${item.id}`)}
                className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                  <User size={14} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[13px] font-medium text-slate-900">
                      Visitor {item.visitorId.slice(0, 8)}
                    </p>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-medium border border-slate-200/60">
                      {item.messageCount} msgs
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-500 truncate">{item.lastMessage}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-[12px] text-slate-400 hidden sm:block">
                    {new Date(item.lastMessageAt).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
