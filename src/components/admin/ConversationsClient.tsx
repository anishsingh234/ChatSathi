"use client";
import React from "react";
import { motion } from "motion/react";
import { MessageSquare, Clock, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConversationItem {
  id: string;
  visitorId: string;
  messageCount: number;
  lastMessage: string;
  lastMessageAt: string;
}

export default function ConversationsClient({ conversations }: { conversations: ConversationItem[] }) {
  const router = useRouter();

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Conversations</h1>
          <p className="text-sm text-slate-500 mt-1">View all chatbot conversations with your visitors.</p>
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-12 text-center flex flex-col items-center">
          <MessageSquare size={24} className="text-slate-300 mb-3" />
          <h3 className="text-[14px] font-medium text-slate-900">No conversations yet</h3>
          <p className="text-[13px] text-slate-500 mt-1 max-w-sm mx-auto">
            Once visitors start chatting with your bot, conversations will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200/60">
            {conversations.map((conv, i) => (
              <button key={conv.id}
                onClick={() => router.push(`/dashboard/conversations/${conv.id}`)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left group">
                <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0 shadow-sm">
                  <User size={14} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[13px] font-semibold text-slate-900">Visitor {conv.visitorId.slice(0, 8)}</p>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-[10px] font-medium text-slate-500 uppercase tracking-wide">{conv.messageCount} msgs</span>
                  </div>
                  <p className="text-[13px] text-slate-500 truncate">{conv.lastMessage}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[12px] font-medium text-slate-400 flex items-center gap-1.5">
                      <Clock size={12} /> {new Date(conv.lastMessageAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
