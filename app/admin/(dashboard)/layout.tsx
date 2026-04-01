import { AdminShell } from "@/features/admin/components/AdminShell";
import { requireAdminSession } from "@/features/auth/server";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return <AdminShell>{children}</AdminShell>;
}
