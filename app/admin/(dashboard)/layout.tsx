import { AdminShell } from "@/features/admin/components";
import { requireCmsSession } from "@/features/auth/server";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cmsSession = await requireCmsSession();

  return (
    <AdminShell
      permissions={cmsSession.permissions}
      role={cmsSession.role}
    >
      {children}
    </AdminShell>
  );
}
