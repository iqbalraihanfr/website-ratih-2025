"use client";

import React, { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  // Prevent scrolling on the page when the modal is open
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

  const colorClasses = {
    danger: {
      iconBg: "bg-red-500/10 text-red-500 border-red-500/20",
      buttonBg: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
      icon: "ri-delete-bin-6-line",
    },
    warning: {
      iconBg: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      buttonBg: "bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg shadow-yellow-500/20 font-bold",
      icon: "ri-logout-box-r-line",
    },
  };

  const activeColor = colorClasses[variant] || colorClasses.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative background gradient */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-10 pointer-events-none ${variant === 'danger' ? 'bg-red-500' : 'bg-yellow-500'}`} />

        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border text-2xl ${activeColor.iconBg}`}>
            <i className={activeColor.icon} />
          </div>

          {/* Text Content */}
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white tracking-wide uppercase italic">
              {title}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed font-sans px-2">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/[0.03] text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
              }}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 ${activeColor.buttonBg}`}
            >
              {isLoading && (
                <svg className="animate-spin h-3.5 w-3.5 text-current animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
