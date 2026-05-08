"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Copy, Check, Code2, Terminal, Bot, Send, ExternalLink, MessageCircle,
} from "lucide-react";

function EmbedClient({ ownerId }: { ownerId: string }) {
  const [copied, setCopied] = useState(false);
  const appUrl = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL;
  const embedCode = `<script \n  src="${appUrl}/chatBot.js" \n  data-owner-id="${ownerId}">\n</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { num: "1", title: "Copy the embed script", desc: "Click the copy button above to copy the code snippet." },
    { num: "2", title: "Paste before </body>", desc: "Open your website's HTML and paste the script before the closing body tag." },
    { num: "3", title: "Reload & go live", desc: "Refresh your website — the chat widget will appear in the bottom-right corner." },
  ];

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Embed Your ChatBot</h1>
          <p className="text-sm text-slate-500 mt-1">Add ChatSathi to any website with one script tag.</p>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden mb-6 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200/60 flex items-center gap-3 bg-[#FBFBFC]">
          <Terminal size={16} className="text-slate-400" />
          <h2 className="text-[14px] font-semibold text-slate-900">Your Embed Code</h2>
        </div>
        <div className="p-5">
          <div className="relative bg-slate-950 rounded-lg overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-slate-500 font-mono">index.html</span>
            </div>
            <div className="p-5">
              <pre className="text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
                <span className="text-slate-500">{"<!-- Add before </body> -->\n"}</span>
                <span className="text-purple-400">{"<script"}</span>
                {"\n  "}
                <span className="text-cyan-400">src</span>
                <span className="text-slate-500">=</span>
                <span className="text-green-400">{`"${appUrl}/chatBot.js"`}</span>
                {"\n  "}
                <span className="text-cyan-400">data-owner-id</span>
                <span className="text-slate-500">=</span>
                <span className="text-green-400">{`"${ownerId}"`}</span>
                {"\n"}
                <span className="text-purple-400">{">"}</span>
                <span className="text-purple-400">{"</script>"}</span>
              </pre>
            </div>
            <button onClick={copyCode}
              className={`absolute top-3 right-3 px-3 py-1.5 rounded-md text-[11px] font-medium uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/10 text-slate-300 border border-white/10 hover:bg-white/20"
              }`}>
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <p className="text-[12px] text-slate-500 mt-3">Copy and paste this snippet just before the closing {"</body>"} tag of your website.</p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden mb-6 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200/60 bg-[#FBFBFC]">
          <h2 className="text-[14px] font-semibold text-slate-900">Integration Steps</h2>
        </div>
        <div className="p-5 space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center shrink-0 text-white text-[11px] font-bold shadow-sm">
                {step.num}
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-slate-900">{step.title}</h3>
                <p className="text-[13px] text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
          <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-3">
            <ExternalLink size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-medium text-slate-900">Works everywhere</p>
              <p className="text-[12px] text-slate-500 mt-0.5">React, Next.js, WordPress, Shopify, Wix, plain HTML — any website.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmbedClient;
