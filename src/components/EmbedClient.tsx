"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MessageCircle,
  Copy,
  Check,
  ArrowLeft,
  Code2,
  Terminal,
  Bot,
  Send,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

function EmbedClient({ ownerId }: { ownerId: string }) {
  const navigate = useRouter();
  const [copied, setCopied] = useState(false);
  const embedCode = `<script 
  src="${process.env.NEXT_PUBLIC_APP_URL}/chatBot.js" 
  data-owner-id="${ownerId}">
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      num: "1",
      title: "Copy the embed script",
      desc: "Click the copy button above to copy the code snippet to your clipboard.",
    },
    {
      num: "2",
      title: "Paste before </body>",
      desc: "Open your website's HTML and paste the script just before the closing body tag.",
    },
    {
      num: "3",
      title: "Reload & go live",
      desc: "Refresh your website — the chat widget will appear in the bottom-right corner.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ─── NAVBAR ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate.push("/")}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-600 to-primary-500 flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Chat<span className="gradient-text">Sathi</span>
              </span>
            </button>
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <span className="hidden sm:inline-block text-sm text-slate-400 font-medium">
              Embed
            </span>
          </div>

          <button
            className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-2"
            onClick={() => navigate.push("/dashboard")}
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>
      </motion.nav>

      {/* ─── MAIN CONTENT ─── */}
      <div className="pt-28 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <Code2 size={20} className="text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Embed Your ChatBot
                </h1>
                <p className="text-sm text-slate-400">
                  Add ChatSathi to any website with one script tag
                </p>
              </div>
            </div>
          </motion.div>

          {/* ─── CODE SNIPPET CARD ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6"
          >
            <div className="px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <Terminal size={16} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Your Embed Code
                </h2>
                <p className="text-xs text-slate-400">
                  Copy and paste this into your website&apos;s HTML
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="relative bg-slate-900 rounded-xl overflow-hidden">
                {/* Terminal dots */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs text-slate-500 font-mono">
                    index.html
                  </span>
                </div>

                <div className="p-3 sm:p-5">
                  <pre className="text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
                    <span className="text-slate-500">
                      {"<!-- Add before </body> -->\n"}
                    </span>
                    <span className="text-purple-400">{"<script"}</span>
                    {"\n  "}
                    <span className="text-cyan-400">src</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-green-400">
                      {`"${process.env.NEXT_PUBLIC_APP_URL}/chatBot.js"`}
                    </span>
                    {"\n  "}
                    <span className="text-cyan-400">data-owner-id</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-green-400">
                      {`"${ownerId}"`}
                    </span>
                    {"\n"}
                    <span className="text-purple-400">{">"}</span>
                    <span className="text-purple-400">{"</script>"}</span>
                  </pre>
                </div>

                <button
                  onClick={copyCode}
                  className={`absolute top-3 right-3 px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    copied
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/10 text-slate-300 border border-white/10 hover:bg-white/20"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={12} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ─── STEPS CARD ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6"
          >
            <div className="px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Integration Steps
              </h2>
            </div>

            <div className="p-4 sm:p-7">
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-600 to-primary-500 flex items-center justify-center shrink-0 text-white text-sm font-bold">
                      {step.num}
                    </div>
                    <div className="pt-0.5">
                      <h3 className="text-sm font-bold text-slate-800">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-primary-50 border border-primary-100 flex items-start gap-3">
                <ExternalLink
                  size={18}
                  className="text-primary-600 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-semibold text-primary-800">
                    Works everywhere
                  </p>
                  <p className="text-xs text-primary-600 mt-0.5">
                    React, Next.js, WordPress, Shopify, Wix, Squarespace,
                    plain HTML — any website that supports custom scripts.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── LIVE PREVIEW CARD ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <MessageCircle size={16} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Live Preview
                </h2>
                <p className="text-xs text-slate-400">
                  How the chatbot appears on your website
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {/* Browser mockup */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 h-10 bg-slate-100 border-b border-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  <div className="ml-3 flex-1 max-w-xs">
                    <div className="bg-white rounded-md px-3 py-1 text-xs text-slate-400 border border-slate-200">
                      your-website.com
                    </div>
                  </div>
                </div>

                {/* Website content area */}
                <div className="relative h-64 sm:h-80 bg-slate-50/50 p-4 sm:p-8">
                  {/* Fake page content */}
                  <div className="space-y-3 max-w-xs">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                    <div className="h-8 bg-slate-200 rounded w-24 mt-4" />
                  </div>

                  {/* Chat widget popup */}
                  <div className="absolute bottom-16 sm:bottom-20 right-3 sm:right-6 w-56 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden hidden xs:block">
                    {/* Widget header */}
                    <div className="px-4 py-3 bg-linear-to-r from-primary-600 to-primary-500 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">
                          ChatSathi
                        </p>
                        <p className="text-white/60 text-[10px]">Online</p>
                      </div>
                      <span className="ml-auto text-white/60 text-xs cursor-pointer">
                        ✕
                      </span>
                    </div>

                    {/* Widget messages */}
                    <div className="p-3 space-y-2.5 bg-slate-50/80 min-h-[100px]">
                      <div className="flex gap-2">
                        <div className="w-5 h-5 rounded-full bg-linear-to-br from-primary-600 to-primary-500 flex items-center justify-center shrink-0">
                          <Bot size={10} className="text-white" />
                        </div>
                        <div className="bg-white text-[11px] text-slate-600 rounded-xl rounded-tl-sm px-3 py-1.5 shadow-sm border border-slate-100">
                          Hi! 👋 How can I help?
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-linear-to-r from-primary-600 to-primary-500 text-white text-[11px] rounded-xl rounded-tr-sm px-3 py-1.5">
                          What&apos;s your return policy?
                        </div>
                      </div>
                    </div>

                    {/* Widget input */}
                    <div className="px-3 py-2 border-t border-slate-100 flex items-center gap-2 bg-white">
                      <div className="flex-1 bg-slate-50 rounded-md px-2.5 py-1.5 text-[10px] text-slate-300 border border-slate-100">
                        Type a message...
                      </div>
                      <div className="w-6 h-6 rounded-md bg-linear-to-r from-primary-600 to-primary-500 flex items-center justify-center">
                        <Send size={10} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Floating chat button */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-primary-600 to-primary-500 text-white flex items-center justify-center shadow-xl pulse-glow cursor-pointer"
                  >
                    <MessageCircle size={18} className="sm:hidden" />
                    <MessageCircle size={20} className="hidden sm:block" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default EmbedClient;
