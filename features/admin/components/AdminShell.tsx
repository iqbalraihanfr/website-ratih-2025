"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import type { CmsPermission, CmsRole } from "@/features/auth/rbac";
import { siteConfig } from "@/lib/site";

interface AdminShellProps {
  children: React.ReactNode;
  permissions: CmsPermission[];
  role: CmsRole;
}

export function AdminShell({ children, permissions, role }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 md:flex">
      <div className="hidden md:flex">
        <AdminSidebar permissions={permissions} role={role} className="min-h-screen border-r border-zinc-800" />
      </div>

      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <Image
            src={siteConfig.logoSquarePath}
            alt="Logo Ratih Creative"
            width={36}
            height={36}
            priority
            quality={90}
            sizes="36px"
            className="h-9 w-9 object-contain"
          />
          <div>
            <p className="text-sm font-semibold text-white">Ratih CMS</p>
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              Role: {role}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label={sidebarOpen ? "Tutup navigasi admin" : "Buka navigasi admin"}
          aria-expanded={sidebarOpen}
          aria-controls="admin-mobile-sidebar"
          onClick={() => setSidebarOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-white transition hover:bg-zinc-800"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup navigasi admin"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        id="admin-mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-[min(82vw,20rem)] transition-transform duration-300 ease-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar
          permissions={permissions}
          role={role}
          className="min-h-dvh border-r border-zinc-800 shadow-2xl"
          onNavigate={() => setSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
