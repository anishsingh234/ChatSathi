"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MessageCircle, Zap, Shield, Clock, ArrowRight, Sparkles,
  Code2, Bot, ChevronRight, Send, X, Loader2, Eye, EyeOff,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

function HomeClient({ user }: { user: User | null }) {
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useRouter();
  const firstLetter = currentUser?.name?.[0]?.toUpperCase();

  const [profileOpen, setProfileOpen] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (authMode === "signup") {
        const res = await axios.post("/api/auth/signup", { name, email, password });
        setCurrentUser(res.data);
      } else {
        const res = await axios.post("/api/auth/login", { email, password });
        setCurrentUser(res.data);
      }
      setShowAuth(false);
      setName(""); setEmail(""); setPassword("");
      // Full navigation so server reads the new cookie
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.post("/api/auth/logout");
      setCurrentUser(null);
      setProfileOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const features = [
    { icon: <Zap size={22} />, title: "Instant Setup", desc: "Go live in under 2 minutes. Just paste one script tag — no coding required." },
    { icon: <Shield size={22} />, title: "You Control the Knowledge", desc: "Define exactly what your AI knows from a simple dashboard." },
    { icon: <Clock size={22} />, title: "24/7 Always Online", desc: "Your AI assistant never sleeps. Instant answers any time of day." },
    { icon: <Bot size={22} />, title: "Powered by Gemini AI", desc: "Built on Google's most advanced AI for natural conversations." },
    { icon: <Code2 size={22} />, title: "Works Everywhere", desc: "One script works on any website — React, WordPress, Shopify, HTML." },
    { icon: <Sparkles size={22} />, title: "Smart Escalation", desc: "When the AI can't answer, it directs customers to your support email." },
  ];

  const steps = [
    { num: "01", title: "Sign up & configure", desc: "Create your account and add your business knowledge." },
    { num: "02", title: "Copy your embed code", desc: "Get a single script tag from the dashboard." },
    { num: "03", title: "Go live instantly", desc: "Paste the script into your website. Done." },
  ];

  const stats = [
    { value: "2min", label: "Setup Time" },
    { value: "24/7", label: "Availability" },
    { value: "1", label: "Line of Code" },
    { value: "∞", label: "Conversations" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* ─── AUTH MODAL ─── */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold">Chat<span className="gradient-text">Sathi</span></span>
              </div>

              <h2 className="text-2xl font-extrabold mb-1">
                {authMode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                {authMode === "login" ? "Sign in to your account" : "Get started with ChatSathi"}
              </p>

              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === "signup" && (
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                      placeholder="John Doe" />
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                    placeholder="you@example.com" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                      placeholder="Min 6 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Please wait...</> :
                    authMode === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setError(""); }}
                  className="text-primary-600 font-semibold hover:underline">
                  {authMode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── NAVBAR ─── */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">Chat<span className="gradient-text">Sathi</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
          </div>

          {currentUser ? (
            <div className="relative">
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 text-white flex items-center justify-center text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                onClick={() => setProfileOpen(!profileOpen)}>
                {firstLetter}
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{currentUser.email}</p>
                    </div>
                    <button onClick={() => navigate.push("/dashboard")}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-50 text-slate-700 hover:text-primary-700 transition-colors">Dashboard</button>
                    <button onClick={handleLogOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
              onClick={() => { setAuthMode("login"); setShowAuth(true); }}>
              Get Started
            </button>
          )}
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 mesh-bg overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-8">
              <Sparkles size={14} /> Powered by Google Gemini AI
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              AI Support That <span className="gradient-text">Knows Your Business</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg">
              Add an intelligent customer support chatbot to your website with one line of code. Trained on your knowledge, available 24/7.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              {currentUser ? (
                <button onClick={() => navigate.push("/dashboard")}
                  className="group px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:shadow-xl hover:shadow-primary-500/25 transition-all flex items-center gap-2">
                  Go to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button className="group px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:shadow-xl hover:shadow-primary-500/25 transition-all flex items-center gap-2"
                  onClick={() => { setAuthMode("signup"); setShowAuth(true); }}>
                  Start Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <a href="#how-it-works" className="px-7 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all">
                See How It Works
              </a>
            </div>
            <p className="mt-8 text-sm text-slate-400">No credit card required &middot; Setup in 2 minutes</p>
          </motion.div>

          {/* Chat Preview */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative hidden sm:block">
            <div className="rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden glow">
              <div className="px-5 py-4 bg-gradient-to-r from-primary-600 to-primary-500 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><Bot size={18} className="text-white" /></div>
                <div>
                  <p className="text-white text-sm font-semibold">ChatSathi Assistant</p>
                  <p className="text-white/70 text-xs">Always online</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/70 text-xs">Live</span>
                </div>
              </div>
              <div className="p-5 space-y-4 min-h-[260px] bg-slate-50/50">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shrink-0 mt-0.5"><Bot size={14} className="text-white" /></div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-700 shadow-sm border border-slate-100 max-w-[80%]">Hi! 👋 I&apos;m your AI assistant. How can I help you today?</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }} className="flex justify-end">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%] shadow-sm">Do you offer cash on delivery?</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shrink-0 mt-0.5"><Bot size={14} className="text-white" /></div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-700 shadow-sm border border-slate-100 max-w-[80%]">Yes! We offer Cash on Delivery across all serviceable pin codes. 🎉</div>
                </motion.div>
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2 bg-white">
                <input type="text" placeholder="Type your message..." className="flex-1 text-sm bg-slate-50 rounded-lg px-4 py-2.5 outline-none border border-slate-200" readOnly />
                <button className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center text-white"><Send size={16} /></button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text">{s.value}</p>
              <p className="mt-1 text-sm text-slate-400 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-16 sm:py-28 px-4 sm:px-6 relative">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 tracking-wide uppercase">Features</span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Everything You Need to <span className="gradient-text">Delight Customers</span></h2>
            <p className="mt-4 text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">ChatSathi gives you all the tools to deploy intelligent, context-aware support.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
                className="group bg-white rounded-2xl p-7 border border-slate-200 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary-600 group-hover:to-primary-500 group-hover:text-white transition-all duration-300">{f.icon}</div>
                <h3 className="mt-5 text-lg font-bold text-slate-800">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-16 sm:py-28 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-slate-900 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/10 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-400 tracking-wide uppercase">How It Works</span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Live in 3 Simple Steps</h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-xl mx-auto">From sign-up to a working AI chatbot — it takes less than 2 minutes.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all">
                <span className="text-5xl font-extrabold text-primary-500/20">{s.num}</span>
                <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                {i < 2 && <ChevronRight size={24} className="hidden md:block absolute top-1/2 -right-5 text-primary-500/40" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 sm:py-28 px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-500 rounded-2xl sm:rounded-3xl px-5 sm:px-8 py-10 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">Ready to Transform Your<br />Customer Support?</h2>
            <p className="mt-4 text-white/80 text-lg max-w-lg mx-auto">Join businesses using ChatSathi to provide instant, intelligent support around the clock.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {currentUser ? (
                <button onClick={() => navigate.push("/dashboard")}
                  className="group px-8 py-3.5 rounded-xl bg-white text-primary-700 font-semibold hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg">
                  Open Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button className="group px-8 py-3.5 rounded-xl bg-white text-primary-700 font-semibold hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg"
                  onClick={() => { setAuthMode("signup"); setShowAuth(true); }}>
                  Get Started — It&apos;s Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center">
                <MessageCircle size={14} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Chat<span className="gradient-text">Sathi</span></span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} ChatSathi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomeClient;
