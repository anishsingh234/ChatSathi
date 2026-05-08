"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Bot, User, Clock, Send, Loader2, ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  role: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  visitorId: string;
  createdAt: string;
  messages: Message[];
}

export default function ConversationDetail({
  conversation,
}: {
  conversation: Conversation;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async () => {
    const text = reply.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const res = await axios.post("/api/conversations/reply", {
        conversationId: conversation.id,
        content: text,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: res.data.id,
          content: text,
          role: "admin",
          createdAt: new Date().toISOString(),
        },
      ]);
      setReply("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "user":
        return { icon: User, bg: "bg-slate-100", iconClass: "text-slate-600", bubbleBg: "bg-slate-100 text-slate-800 rounded-tr-sm border border-slate-200/60", label: "Visitor" };
      case "admin":
        return { icon: ShieldCheck, bg: "bg-slate-800", iconClass: "text-white", bubbleBg: "bg-slate-50 text-slate-800 border border-slate-300 rounded-tl-sm", label: "Admin" };
      default:
        return { icon: Bot, bg: "bg-primary-50", iconClass: "text-primary-700", bubbleBg: "bg-primary-50/50 text-slate-800 border border-primary-100 rounded-tl-sm", label: "AI Bot" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-4">
        <button
          onClick={() => router.push("/dashboard/conversations")}
          className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-900 mb-3 transition-colors w-fit"
        >
          <ArrowLeft size={14} /> Back to conversations
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Visitor {conversation.visitorId.slice(0, 8)}
            </h1>
            <p className="text-[13px] text-slate-500 flex items-center gap-1.5 mt-1">
              <Clock size={12} /> Started{" "}
              {new Date(conversation.createdAt).toLocaleString()}
              <span className="mx-1.5 text-slate-300">|</span>
              {messages.length} messages
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm flex flex-col flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-5 space-y-5 overflow-y-auto bg-[#FBFBFC]">
          {messages.map((msg, i) => {
            const badge = getRoleBadge(msg.role);
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${isUser ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${badge.bg} shadow-sm border border-slate-200/60`}
                >
                  <badge.icon size={13} className={badge.iconClass} />
                </div>
                <div className={`max-w-[75%]`}>
                  {msg.role === "admin" && (
                    <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                      <ShieldCheck size={10} /> Admin Reply
                    </p>
                  )}
                  <div
                    className={`rounded-lg px-3.5 py-2.5 text-[13px] shadow-sm ${badge.bubbleBg}`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                    <p className={`text-[10px] mt-1.5 font-medium ${isUser ? "text-slate-400" : "text-slate-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply Bar */}
        <div className="border-t border-slate-200/60 p-4 bg-white flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-slate-200/60 bg-slate-50 flex items-center justify-center shrink-0">
            <ShieldCheck size={14} className="text-slate-600" />
          </div>
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendReply();
              }
            }}
            placeholder="Reply as admin…"
            className="flex-1 rounded-lg border border-slate-200/60 px-3.5 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all shadow-sm"
          />
          <button
            onClick={handleSendReply}
            disabled={sending || !reply.trim()}
            className="px-4 h-[42px] rounded-lg bg-slate-900 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm shrink-0"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
