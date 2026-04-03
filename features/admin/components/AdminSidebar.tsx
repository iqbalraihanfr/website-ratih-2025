"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/features/auth/actions";
import type { CmsPermission, CmsRole } from "@/features/auth/rbac";

const navItems: Array<{
  label: string;
  href: string;
  icon: string;
  permission: CmsPermission;
}> = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "ri-dashboard-line",
    permission: "dashboard.view",
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: "ri-article-line",
    permission: "blog.manage",
  },
  {
    label: "Portfolio",
    href: "/admin/portfolio",
    icon: "ri-image-line",
    permission: "portfolio.manage",
  },
  {
    label: "Tim",
    href: "/admin/crew",
    icon: "ri-group-line",
    permission: "crew.manage",
  },
  {
    label: "Layanan",
    href: "/admin/services",
    icon: "ri-briefcase-line",
    permission: "services.manage",
  },
];

interface AdminSidebarProps {
  permissions: CmsPermission[];
  role: CmsRole;
}

export function AdminSidebar({ permissions, role }: AdminSidebarProps) {
  const pathname = usePathname();
  const availableItems = navItems.filter((item) =>
    permissions.includes(item.permission)
  );

  return (
    <aside className="w-64 bg-zinc-900 min-h-screen flex flex-col flex-shrink-0">
      <div className="p-6">
        <span className="text-white font-bold text-lg">Ratih CMS</span>
        <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
          Role: {role}
        </p>
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-1">
        {availableItems.map((item) => {
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
