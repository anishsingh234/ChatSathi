"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Palette, Save, Check, Loader2, Bot, Send, Sparkles,
  RotateCcw,
} from "lucide-react";
import axios from "axios";

interface ThemeConfig {
  primaryColor: string;
  headerBg: string;
  botBubbleBg: string;
  userBubbleGrad1: string;
  userBubbleGrad2: string;
  chatBg: string;
  welcomeMessage: string;
  chatTitle: string;
}

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: "#7c3aed",
  headerBg: "#0f0e17",
  botBubbleBg: "rgba(255,255,255,0.05)",
  userBubbleGrad1: "#635bff",
  userBubbleGrad2: "#8b5cf6",
  chatBg: "#0f0e17",
  welcomeMessage: "Hey! 👋 How can I help you today?",
  chatTitle: "ChatSathi",
};

const PRESETS: { name: string; colors: Partial<ThemeConfig> }[] = [
  {
    name: "Midnight Purple",
    colors: {
      primaryColor: "#7c3aed",
      headerBg: "#0f0e17",
      userBubbleGrad1: "#635bff",
      userBubbleGrad2: "#8b5cf6",
      chatBg: "#0f0e17",
    },
  },
  {
    name: "Ocean Blue",
    colors: {
      primaryColor: "#2563eb",
      headerBg: "#0c1222",
      userBubbleGrad1: "#2563eb",
      userBubbleGrad2: "#0ea5e9",
      chatBg: "#0c1222",
    },
  },
  {
    name: "Forest Green",
    colors: {
      primaryColor: "#059669",
      headerBg: "#0a1a14",
      userBubbleGrad1: "#059669",
      userBubbleGrad2: "#10b981",
      chatBg: "#0a1a14",
    },
  },
  {
    name: "Sunset Orange",
    colors: {
      primaryColor: "#ea580c",
      headerBg: "#1a0f0a",
      userBubbleGrad1: "#ea580c",
      userBubbleGrad2: "#f59e0b",
      chatBg: "#1a0f0a",
    },
  },
  {
    name: "Rose Gold",
    colors: {
      primaryColor: "#e11d48",
      headerBg: "#1a0a10",
      userBubbleGrad1: "#e11d48",
      userBubbleGrad2: "#f472b6",
      chatBg: "#1a0a10",
    },
  },
  {
    name: "Slate Modern",
    colors: {
      primaryColor: "#6366f1",
      headerBg: "#1e293b",
      userBubbleGrad1: "#6366f1",
      userBubbleGrad2: "#818cf8",
      chatBg: "#1e293b",
    },
  },
];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function ThemeCustomizer({ userId }: { userId: string }) {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    axios
      .post("/api/settings/get", { ownerId: userId })
      .then((res) => {
        const d = res.data;
        setTheme({
          primaryColor: d.primaryColor || DEFAULT_THEME.primaryColor,
          headerBg: d.headerBg || DEFAULT_THEME.headerBg,
          botBubbleBg: d.botBubbleBg || DEFAULT_THEME.botBubbleBg,
          userBubbleGrad1: d.userBubbleGrad1 || DEFAULT_THEME.userBubbleGrad1,
          userBubbleGrad2: d.userBubbleGrad2 || DEFAULT_THEME.userBubbleGrad2,
          chatBg: d.chatBg || DEFAULT_THEME.chatBg,
          welcomeMessage: d.welcomeMessage || DEFAULT_THEME.welcomeMessage,
          chatTitle: d.chatTitle || DEFAULT_THEME.chatTitle,
        });
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [userId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post("/api/settings", { ownerId: userId, ...theme });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setTheme((prev) => ({ ...prev, ...preset.colors }));
  };

  const updateField = (key: keyof ThemeConfig, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Chat Appearance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Customize colors and text for your embedded chatbot widget.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* ─── LEFT: Controls ─── */}
        <div className="xl:col-span-3 space-y-6">
          {/* Preset Themes */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200/60 flex items-center gap-3 bg-[#FBFBFC]">
              <Sparkles size={16} className="text-slate-400" />
              <h2 className="text-[14px] font-semibold text-slate-900">
                Preset Themes
              </h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="group relative rounded-xl border border-slate-200 p-3 hover:border-primary-300 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${preset.colors.userBubbleGrad1}, ${preset.colors.userBubbleGrad2})`,
                        }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ background: preset.colors.chatBg }}
                      />
                    </div>
                    <p className="text-[12px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                      {preset.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Pickers */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200/60 flex items-center justify-between bg-[#FBFBFC]">
              <div className="flex items-center gap-3">
                <Palette size={16} className="text-slate-400" />
                <h2 className="text-[14px] font-semibold text-slate-900">Colors</h2>
              </div>
              <button
                onClick={() =>
                  setTheme((prev) => ({
                    ...prev,
                    primaryColor: DEFAULT_THEME.primaryColor,
                    headerBg: DEFAULT_THEME.headerBg,
                    userBubbleGrad1: DEFAULT_THEME.userBubbleGrad1,
                    userBubbleGrad2: DEFAULT_THEME.userBubbleGrad2,
                    chatBg: DEFAULT_THEME.chatBg,
                  }))
                }
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(
                [
                  ["primaryColor", "Primary / Accent"],
                  ["headerBg", "Header Background"],
                  ["chatBg", "Chat Background"],
                  ["userBubbleGrad1", "User Bubble Start"],
                  ["userBubbleGrad2", "User Bubble End"],
                ] as [keyof ThemeConfig, string][]
              ).map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  <label className="relative group cursor-pointer">
                    <input
                      type="color"
                      value={theme[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-10 h-10 rounded-xl border-2 border-slate-200 group-hover:border-primary-400 transition-colors shadow-sm"
                      style={{ background: theme[key] }}
                    />
                  </label>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-700">
                      {label}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">
                      {theme[key]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text Settings */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200/60 bg-[#FBFBFC]">
              <h2 className="text-[14px] font-semibold text-slate-900">
                Widget Text
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="text-[13px] font-medium text-slate-700 mb-2 block">
                  Chat Title
                </label>
                <input
                  type="text"
                  value={theme.chatTitle}
                  onChange={(e) => updateField("chatTitle", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  placeholder="e.g. Acme Support"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Welcome Message
                </label>
                <textarea
                  value={theme.welcomeMessage}
                  onChange={(e) =>
                    updateField("welcomeMessage", e.target.value)
                  }
                  className="w-full h-24 rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all resize-none"
                  placeholder="Hey! 👋 How can I help?"
                />
              </div>
            </div>
          </div>

          {/* Save Bar */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm px-5 py-4 flex items-center justify-between">
            <div className="text-[13px] text-slate-500">
              {saved ? (
                <span className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <Check size={16} /> Theme saved successfully
                </span>
              ) : (
                "Changes are reflected in the preview"
              )}
            </div>
            <button
              disabled={loading}
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Theme
                </>
              )}
            </button>
          </div>
        </div>

        {/* ─── RIGHT: Live Preview ─── */}
        <div className="xl:col-span-2">
          <div className="sticky top-8">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Live Preview
            </p>
            <div
              className="rounded-xl overflow-hidden shadow-sm border border-slate-200/80"
              style={{ background: theme.chatBg }}
            >
              {/* Header */}
              <div
                className="px-5 py-4 flex items-center gap-3"
                style={{
                  background: theme.headerBg,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: hexToRgba(theme.primaryColor, 0.2),
                    border: `1px solid ${hexToRgba(theme.primaryColor, 0.4)}`,
                  }}
                >
                  <Bot size={16} style={{ color: theme.primaryColor }} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#f0eeff" }}
                  >
                    {theme.chatTitle}
                  </p>
                  <p
                    className="text-xs flex items-center gap-1.5"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{
                        background: "#4ade80",
                        boxShadow: "0 0 6px rgba(74,222,128,0.6)",
                      }}
                    />
                    online
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 min-h-[240px]">
                {/* Bot message */}
                <div className="flex gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: hexToRgba(theme.primaryColor, 0.2),
                      border: `1px solid ${hexToRgba(theme.primaryColor, 0.3)}`,
                    }}
                  >
                    <Bot
                      size={12}
                      style={{ color: hexToRgba(theme.primaryColor, 0.8) }}
                    />
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] max-w-[80%]"
                    style={{
                      background: theme.botBubbleBg,
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {theme.welcomeMessage}
                  </div>
                </div>

                {/* User message */}
                <div className="flex justify-end">
                  <div
                    className="rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[13px] text-white max-w-[80%]"
                    style={{
                      background: `linear-gradient(135deg, ${theme.userBubbleGrad1}, ${theme.userBubbleGrad2})`,
                    }}
                  >
                    Do you offer free shipping?
                  </div>
                </div>

                {/* Bot reply */}
                <div className="flex gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: hexToRgba(theme.primaryColor, 0.2),
                      border: `1px solid ${hexToRgba(theme.primaryColor, 0.3)}`,
                    }}
                  >
                    <Bot
                      size={12}
                      style={{ color: hexToRgba(theme.primaryColor, 0.8) }}
                    />
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] max-w-[80%]"
                    style={{
                      background: theme.botBubbleBg,
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    Yes! We offer free shipping on orders above ₹499. 🎉
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  background: theme.chatBg,
                }}
              >
                <div
                  className="flex-1 rounded-xl px-3.5 py-2.5 text-[13px]"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  Ask me anything…
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: theme.primaryColor }}
                >
                  <Send size={14} className="text-white" />
                </div>
              </div>
            </div>

            {/* FAB Preview */}
            <div className="mt-4 flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: theme.chatBg,
                  border: "1.5px solid rgba(255,255,255,0.12)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 10H16M8 14H13M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" />
                </svg>
              </div>
              <p className="text-[12px] text-slate-500">
                Floating button (bottom-right on site)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
