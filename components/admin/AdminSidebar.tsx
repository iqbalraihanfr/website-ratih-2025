"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "ri-dashboard-line" },
  { label: "Blog", href: "/admin/blog", icon: "ri-article-line" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "ri-image-line" },
  { label: "Tim", href: "/admin/crew", icon: "ri-group-line" },
  { label: "Layanan", href: "/admin/services", icon: "ri-briefcase-line" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-900 min-h-screen flex flex-col flex-shrink-0">
      <div className="p-6">
        <span className="text-white font-bold text-lg">Ratih CMS</span>
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <i className={`${item.icon} text-lg`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors w-full"
          >
            <i className="ri-logout-box-line text-lg" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
