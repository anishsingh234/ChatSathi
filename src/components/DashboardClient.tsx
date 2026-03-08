"use client";
import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  MessageCircle,
  Save,
  Code2,
  Building2,
  Mail,
  BookOpen,
  Check,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

function DashboardClient({ ownerId }: { ownerId: string }) {
  const navigate = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [knowledge, setKnowledge] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetching, setFetching] = useState(true);

  const handleSettings = async () => {
    setLoading(true);
    try {
      await axios.post("/api/settings", {
        ownerId,
        businessName,
        supportEmail,
        knowledge,
      });
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) {
      const handleGetDetails = async () => {
        try {
          const result = await axios.post("/api/settings/get", { ownerId });
          setBusinessName(result.data.businessName || "");
          setSupportEmail(result.data.supportEmail || "");
          setKnowledge(result.data.knowledge || "");
        } catch (error) {
          console.log(error);
        } finally {
          setFetching(false);
        }
      };
      handleGetDetails();
    }
  }, [ownerId]);

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
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate.push("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-600 to-primary-500 flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                Chat<span className="gradient-text">Sathi</span>
              </span>
            </button>
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <span className="hidden sm:inline-block text-sm text-slate-400 font-medium">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate.push("/")}
              className="px-3 sm:px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button
              onClick={() => navigate.push("/embed")}
              className="px-3 sm:px-4 py-2 rounded-lg bg-linear-to-r from-primary-600 to-primary-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all flex items-center gap-2"
            >
              <Code2 size={16} />
              <span className="hidden sm:inline">Embed ChatBot</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ─── MAIN CONTENT ─── */}
      <div className="pt-28 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <Sparkles size={20} className="text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  ChatBot Settings
                </h1>
                <p className="text-sm text-slate-400">
                  Configure your AI assistant&apos;s knowledge and identity
                </p>
              </div>
            </div>
          </motion.div>

          {fetching ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-32"
            >
              <Loader2
                size={28}
                className="animate-spin text-primary-500"
              />
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* ─── BUSINESS DETAILS CARD ─── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building2 size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">
                      Business Details
                    </h2>
                    <p className="text-xs text-slate-400">
                      Your brand identity for the chatbot
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-7 space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Building2 size={14} className="text-slate-400" />
                      Business Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-slate-300"
                      placeholder="e.g. Acme Store"
                      onChange={(e) => setBusinessName(e.target.value)}
                      value={businessName}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Mail size={14} className="text-slate-400" />
                      Support Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-slate-300"
                      placeholder="e.g. support@acme.com"
                      onChange={(e) => setSupportEmail(e.target.value)}
                      value={supportEmail}
                    />
                  </div>
                </div>
              </motion.div>

              {/* ─── KNOWLEDGE BASE CARD ─── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <BookOpen size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">
                      Knowledge Base
                    </h2>
                    <p className="text-xs text-slate-400">
                      Everything your AI should know about your business
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-7">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {[
                      "FAQs",
                      "Refund Policy",
                      "Delivery Info",
                      "Pricing",
                      "Business Hours",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-xs text-slate-500 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <textarea
                    className="w-full h-48 sm:h-64 rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-slate-300 resize-none leading-relaxed"
                    placeholder={`Add information your AI chatbot should know:\n\n• What products/services do you offer?\n• What is your refund/return policy?\n• What are your business hours?\n• How can customers contact you?\n• Common questions customers ask\n• Shipping & delivery details\n• Pricing information`}
                    onChange={(e) => setKnowledge(e.target.value)}
                    value={knowledge}
                  />

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-slate-300">
                      The more detail you add, the better your AI responds
                    </p>
                    <p className="text-xs text-slate-300">
                      {knowledge.length} characters
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ─── SAVE BAR ─── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 sm:px-7 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
              >
                <div className="text-sm text-slate-400">
                  {saved ? (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-emerald-600 font-semibold"
                    >
                      <Check size={16} />
                      Settings saved successfully
                    </motion.span>
                  ) : (
                    "Make sure to save after making changes"
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  onClick={handleSettings}
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Settings
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardClient;
