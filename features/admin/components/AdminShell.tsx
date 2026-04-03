import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import type { CmsPermission, CmsRole } from "@/features/auth/rbac";

interface AdminShellProps {
  children: React.ReactNode;
  permissions: CmsPermission[];
  role: CmsRole;
}

export function AdminShell({ children, permissions, role }: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar permissions={permissions} role={role} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
