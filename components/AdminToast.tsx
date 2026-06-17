"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface AdminToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

const ICONS: Record<ToastVariant, string> = {
  success: "ri-checkbox-circle-fill",
  error: "ri-error-warning-fill",
  info: "ri-information-fill",
};

const COLORS: Record<ToastVariant, { bar: string; icon: string; bg: string; border: string }> = {
  success: {
    bar: "bg-emerald-500",
    icon: "text-emerald-400",
    bg: "bg-[#0a1a10]",
    border: "border-emerald-500/20",
  },
  error: {
    bar: "bg-red-500",
    icon: "text-red-400",
    bg: "bg-[#1a0a0a]",
    border: "border-red-500/20",
  },
  info: {
    bar: "bg-yellow-500",
    icon: "text-yellow-400",
    bg: "bg-[#1a1600]",
    border: "border-yellow-500/20",
  },
};

function ToastCard({ toast, onRemove }: { toast: ToastItem; onRemove: () => void }) {
  const [visible, setVisible] = useState(false);
  const color = COLORS[toast.variant];

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 4s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onRemove, 350);
    }, 4000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onRemove]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onRemove, 350);
  };

  return (
    <div
      className={`relative flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl min-w-[260px] max-w-[360px] transition-all duration-350 ease-out overflow-hidden
        ${color.bg} ${color.border}
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"}`}
    >
      {/* Progress bar */}
      <div className={`absolute bottom-0 left-0 h-[2px] ${color.bar} animate-shrink`} />

      <i className={`${ICONS[toast.variant]} text-lg mt-0.5 shrink-0 ${color.icon}`} />
      <p className="text-xs text-white/85 leading-relaxed flex-1 font-medium">{toast.message}</p>
      <button
        onClick={handleClose}
        className="shrink-0 text-white/30 hover:text-white/70 transition-colors ml-1 cursor-pointer mt-0.5"
      >
        <i className="ri-close-line text-sm" />
      </button>
    </div>
  );
}

export function AdminToastContainer({ toasts, onRemove }: AdminToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastCard toast={toast} onRemove={() => onRemove(toast.id)} />
        </div>
      ))}
    </div>
  );
}

// Hook to manage toasts
export function useAdminToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useMemo(() => ({
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    info: (msg: string) => addToast(msg, "info"),
  }), [addToast]);

  return { toasts, removeToast, toast };
}
