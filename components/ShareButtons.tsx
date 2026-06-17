"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url?: string;
  title: string;
}

export default function ShareButtons({ url: propUrl, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = propUrl || (typeof window !== "undefined" ? window.location.href : "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: "ri-whatsapp-line",
      hoverIcon: "ri-whatsapp-fill",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " — " + shareUrl)}`,
      colorClass: "hover:text-emerald-500 hover:border-emerald-500/30 hover:bg-emerald-500/5",
    },
    {
      name: "Facebook",
      icon: "ri-facebook-box-line",
      hoverIcon: "ri-facebook-box-fill",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      colorClass: "hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5",
    },
    {
      name: "X / Twitter",
      icon: "ri-twitter-x-line",
      hoverIcon: "ri-twitter-x-fill",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      colorClass: "hover:text-yellow-500 hover:border-yellow-500/30 hover:bg-yellow-500/5",
    },
  ];

  return (
    <div className="flex flex-col gap-4 py-8 border-y border-white/10 my-10">
      <p className="text-[11px] font-bold italic uppercase tracking-[0.2em] text-white/50">
        Bagikan Artikel Ini
      </p>
      
      <div className="flex flex-wrap items-center gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Bagikan ke ${link.name}`}
            className={`inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white/70 transition-all duration-300 ${link.colorClass}`}
          >
            <i className={`${link.icon} text-lg transition-transform duration-300 group-hover:scale-110`} />
            <span>{link.name}</span>
          </a>
        ))}

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className={`relative inline-flex items-center gap-2 border px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            copied
              ? "text-yellow-500 border-yellow-500/40 bg-yellow-500/5"
              : "text-white/70 border-white/15 hover:text-yellow-500 hover:border-yellow-500/30 hover:bg-yellow-500/5"
          }`}
          title="Salin Tautan"
        >
          <i className={`${copied ? "ri-checkbox-circle-line" : "ri-link"} text-lg`} />
          <span>{copied ? "Tersalin!" : "Salin Link"}</span>

          {/* Success Tooltip */}
          {copied && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-lg animate-bounce pointer-events-none whitespace-nowrap">
              Link disalin ke clipboard!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
