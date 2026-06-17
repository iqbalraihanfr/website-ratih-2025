"use client";

import React, { useState, useEffect } from "react";

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string, url: string) => void;
  initialText: string;
}

export default function LinkModal({
  isOpen,
  onClose,
  onSave,
  initialText,
}: LinkModalProps) {
  const [text, setText] = useState(initialText || "");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!url) return;
    onSave(text, url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-10 pointer-events-none bg-yellow-500" />

        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center border border-yellow-500/20 text-lg">
              <i className="ri-link" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase italic">
              Tambahkan Tautan
            </h3>
          </div>

          <div onKeyDown={handleKeyDown} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                Teks Tautan (Teks yang Tampil)
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Contoh: Baca selengkapnya"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                URL / Tautan
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Contoh: https://example.com"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors"
                required
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/[0.03] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
