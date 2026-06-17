"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import Link from "next/link";
import Image from "next/image";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // If not loading, and there's no authorized admin, redirect to login
    if (!loading && !isLoginPage && (!user || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [user, isAdmin, loading, isLoginPage, router]);

  // Direct return for login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (loading || (!user || !isAdmin)) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
        <svg className="animate-spin h-10 w-10 text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-white/50 text-xs uppercase tracking-widest animate-pulse">Memuat Sesi Admin...</span>
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: "ri-dashboard-line" },
    { label: "Portfolio", href: "/admin/portfolio", icon: "ri-gallery-line" },
    { label: "Blog Posts", href: "/admin/posts", icon: "ri-article-line" },
    { label: "Creative Team", href: "/admin/crew", icon: "ri-group-line" },
    { label: "Services", href: "/admin/services", icon: "ri-customer-service-2-line" },
    { label: "Inbox Messages", href: "/admin/messages", icon: "ri-mail-line" },
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-black border-r border-white/5 flex flex-col shrink-0 overflow-hidden">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <Image
            src="/images/logo-ratih.svg"
            alt="Ratih Logo"
            width={32}
            height={32}
          />
          <div>
            <h2 className="font-bold italic text-sm leading-none uppercase text-white tracking-wider">Ratih Admin</h2>
            <span className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1 inline-block">Control Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/10 font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <i className={`${item.icon} text-lg`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full border border-white/10"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold text-sm uppercase">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {user.displayName || "Administrator"}
              </p>
              <p className="text-[10px] text-white/45 truncate mt-0.5 leading-none">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setLogoutConfirmOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border border-red-500/20 hover:border-red-500/35 transition-all cursor-pointer"
          >
            <i className="ri-logout-box-line text-sm" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black/30 backdrop-blur-md sticky top-0 z-30">
          <h1 className="font-bold text-lg uppercase tracking-wider italic text-white/80">
            {menuItems.find((m) => m.href === pathname)?.label || "Dashboard"}
          </h1>
          <Link
            href="/"
            target="_blank"
            className="text-xs text-white/50 hover:text-yellow-500 transition-colors uppercase tracking-widest flex items-center gap-1.5"
          >
            <span>Buka Website</span>
            <i className="ri-external-link-line" />
          </Link>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>

      <ConfirmModal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={() => {
          setLogoutConfirmOpen(false);
          logout();
        }}
        title="Keluar Sesi"
        message="Apakah Anda yakin ingin keluar dari panel admin Ratih?"
        confirmText="Keluar"
        variant="warning"
      />
    </div>
  );
}
