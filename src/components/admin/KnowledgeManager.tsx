"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Plus, Trash2, Save, Loader2, X, Search,
  FileText, Tag, Check,
} from "lucide-react";
import axios from "axios";

interface KnowledgeDoc {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
}

export default function KnowledgeManager() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Editor state
  const [editing, setEditing] = useState<KnowledgeDoc | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await axios.get("/api/knowledge");
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    setIsNew(true);
    setTitle("");
    setContent("");
    setTagsInput("");
  };

  const openEdit = (doc: KnowledgeDoc) => {
    setEditing(doc);
    setIsNew(false);
    setTitle(doc.title);
    setContent(doc.content);
    setTagsInput(doc.tags.join(", "));
  };

  const closeEditor = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await axios.post("/api/knowledge", {
        id: editing?.id,
        title,
        content,
        tags: tagsInput,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      fetchDocs();
      closeEditor();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete("/api/knowledge", { data: { id } });
      setDocs((prev) => prev.filter((d) => d.id !== id));
      if (editing?.id === id) closeEditor();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Knowledge Base
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the documents your AI uses to answer customer questions.
          </p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Add Document
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by title, content, or tags..."
            className="w-full rounded-lg border border-slate-200/60 pl-9 pr-4 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {(isNew || editing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
            onClick={closeEditor}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between bg-[#FBFBFC] rounded-t-xl shrink-0">
                <h2 className="text-[14px] font-semibold text-slate-900">
                  {isNew ? "New Knowledge Document" : "Edit Document"}
                </h2>
                <button
                  onClick={closeEditor}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto">
                <div>
                  <label className="text-[13px] font-medium text-slate-700 mb-2 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/60 px-3.5 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all shadow-sm"
                    placeholder="e.g. Refund Policy, Shipping FAQ"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-medium text-slate-700 mb-2 block">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-48 rounded-lg border border-slate-200/60 px-3.5 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all resize-none leading-relaxed shadow-sm"
                    placeholder="Write the knowledge content here. The AI will use this to answer customer questions."
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5 font-medium tracking-wide">
                    {content.length} CHARACTERS
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700 mb-2">
                    <Tag size={12} className="text-slate-400" /> Tags
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/60 px-3.5 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all shadow-sm"
                    placeholder="refund, shipping, payment (comma separated)"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200/60 flex items-center justify-end gap-3 bg-[#FBFBFC] rounded-b-xl shrink-0">
                <button
                  onClick={closeEditor}
                  className="px-4 py-2 rounded-lg border border-slate-200/60 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !title.trim() || !content.trim()}
                  className="px-5 py-2 rounded-lg bg-slate-900 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving…
                    </>
                  ) : saved ? (
                    <>
                      <Check size={16} /> Saved!
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Document
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-12 text-center flex flex-col items-center">
          <BookOpen size={24} className="text-slate-300 mb-3" />
          <h3 className="text-[14px] font-medium text-slate-900">
            {search ? "No matching documents" : "No knowledge docs yet"}
          </h3>
          <p className="text-[13px] text-slate-500 mt-1 max-w-sm mx-auto">
            {search
              ? "Try different search terms."
              : "Add documents so your AI chatbot can answer customer questions accurately."}
          </p>
          {!search && (
            <button
              onClick={openNew}
              className="mt-5 px-4 py-2 rounded-lg border border-slate-200/60 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} /> Add First Document
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden divide-y divide-slate-100">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="p-5 hover:bg-slate-50 transition-colors group flex items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[14px] font-semibold text-slate-900 truncate">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(doc)}
                      className="px-2.5 py-1.5 rounded-md text-[12px] font-medium text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="px-2 py-1.5 rounded-md text-[12px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
                  {doc.content}
                </p>
                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded border border-slate-200/60 bg-white text-[10px] font-medium text-slate-500 tracking-wide uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
