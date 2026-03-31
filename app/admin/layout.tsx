import { getSession } from "@/app/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    // Not authenticated — render children (login page will show)
    return <>{children}</>;
  }

  return <>{children}</>;
}
