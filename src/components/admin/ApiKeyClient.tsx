"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Key, Save, Check, Loader2, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import axios from "axios";

export default function ApiKeyClient({ hasKey }: { hasKey: boolean }) {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/user/api-key", { apiKey });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setApiKey("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Gemini API Key</h1>
          <p className="text-sm text-slate-500 mt-1">Use your own Google Gemini API key for the chatbot.</p>
        </div>
      </div>

      {/* Status Card */}
      <div className={`rounded-xl border p-5 mb-6 flex items-center gap-4 ${
          hasKey || saved ? "bg-emerald-50/50 border-emerald-200/60" : "bg-amber-50/50 border-amber-200/60"
        }`}>
        {hasKey || saved ? (
          <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
        ) : (
          <AlertCircle size={20} className="text-amber-600 shrink-0" />
        )}
        <div>
          <p className={`text-[14px] font-medium ${hasKey || saved ? "text-emerald-900" : "text-amber-900"}`}>
            {hasKey || saved ? "API Key is configured" : "No API key set — using shared key"}
          </p>
          <p className={`text-[13px] mt-0.5 ${hasKey || saved ? "text-emerald-700" : "text-amber-700"}`}>
            {hasKey || saved ? "Your chatbot is using your personal Gemini API key." : "Set your own key for better performance and no rate limits."}
          </p>
        </div>
      </div>

      {/* Key Input */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200/60 flex items-center justify-between bg-[#FBFBFC]">
          <h2 className="text-[14px] font-semibold text-slate-900">{hasKey ? "Update" : "Add"} API Key</h2>
        </div>
        <div className="p-5 space-y-4">
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-red-50/50 border border-red-200/60 text-red-700 text-[13px] font-medium">{error}</div>
          )}
          <div>
            <label className="text-[13px] font-medium text-slate-700 mb-2 block">API Key</label>
            <div className="relative">
              <input type={showKey ? "text" : "password"} value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-lg border border-slate-200/60 px-3.5 py-2.5 pr-11 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all font-mono placeholder:font-sans placeholder:text-slate-300 shadow-sm"
                placeholder="AIzaSy..." />
              <button type="button" onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-4">
            <p className="text-[12px] text-slate-500 mt-4">Your key is stored securely and never exposed to clients.</p>
            <button disabled={loading || !apiKey.trim()} onClick={handleSave}
              className="px-5 py-2.5 mt-4 rounded-lg bg-slate-900 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> :
                saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Key</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
