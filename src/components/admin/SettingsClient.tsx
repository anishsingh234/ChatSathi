"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Save, Building2, Mail, BookOpen, Check, Loader2, Sparkles,
} from "lucide-react";
import axios from "axios";

export default function SettingsClient({ userId }: { userId: string }) {
  const [businessName, setBusinessName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [knowledge, setKnowledge] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    axios.post("/api/settings/get", { ownerId: userId })
      .then((res) => {
        setBusinessName(res.data.businessName || "");
        setSupportEmail(res.data.supportEmail || "");
        setKnowledge(res.data.knowledge || "");
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [userId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post("/api/settings", { ownerId: userId, businessName, supportEmail, knowledge });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Business Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure your AI assistant's identity and base knowledge.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Business Details */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200/60 flex items-center gap-3 bg-[#FBFBFC]">
            <Building2 size={16} className="text-slate-400" />
            <h2 className="text-[14px] font-semibold text-slate-900">Business Details</h2>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="text-[13px] font-medium text-slate-700 mb-2 block">
                Business Name
              </label>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-lg border border-slate-200/60 px-3.5 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all placeholder:text-slate-300 shadow-sm"
                placeholder="e.g. Acme Store" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-slate-700 mb-2 block">
                Support Email
              </label>
              <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200/60 px-3.5 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all placeholder:text-slate-300 shadow-sm"
                placeholder="e.g. support@acme.com" />
            </div>
          </div>
        </div>

        {/* Base Knowledge Base */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200/60 flex items-center gap-3 bg-[#FBFBFC]">
            <BookOpen size={16} className="text-slate-400" />
            <h2 className="text-[14px] font-semibold text-slate-900">Base Knowledge</h2>
          </div>
          <div className="p-5">
            <textarea value={knowledge} onChange={(e) => setKnowledge(e.target.value)}
              className="w-full h-48 sm:h-64 rounded-lg border border-slate-200/60 px-3.5 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all placeholder:text-slate-300 resize-none leading-relaxed shadow-sm"
              placeholder={`Add core information your AI chatbot should know:\n\n• What is the business?\n• Core hours and locations\n• Link to your main website`} />
            <div className="mt-2.5 flex items-center justify-between">
              <p className="text-[11px] text-slate-500">Tip: Use the specific Knowledge Base page to add detailed FAQs and Policies.</p>
              <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">{knowledge.length} characters</p>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm px-5 py-4 flex items-center justify-between">
          <div className="text-[13px] text-slate-500">
            {saved ? (
              <span className="flex items-center gap-2 text-emerald-600 font-semibold">
                <Check size={16} /> Settings saved successfully
              </span>
            ) : "Make sure to save after making changes"}
          </div>
          <button disabled={loading} onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
}
