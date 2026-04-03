import { createClient, type Session, type User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getPermissionsForRole,
  hasPermission,
  resolveCmsRole,
  type CmsPermission,
  type CmsRole,
} from "@/features/auth/rbac";

function createAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase auth credentials.");
  }

  return createClient(url, key);
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  if (!accessToken || !refreshToken) return null;

  const supabase = createAuthClient();
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) return null;
  return data.session;
}

export interface CmsSessionContext {
  session: Session;
  user: User;
  role: CmsRole;
  permissions: CmsPermission[];
}

export async function getCmsSessionContext(): Promise<CmsSessionContext | null> {
  const session = await getSession();
  if (!session?.user) return null;

  const role = resolveCmsRole(session.user);
  if (!role) return null;

  return {
    session,
    user: session.user,
    role,
    permissions: getPermissionsForRole(role),
  };
}

export async function getAdminSession(): Promise<Session | null> {
  const context = await getCmsSessionContext();
  return context?.session ?? null;
}

export async function requireCmsSession() {
  const context = await getCmsSessionContext();
  if (!context) redirect("/admin/login");
  return context;
}

export async function requirePermission(permission: CmsPermission) {
  const context = await requireCmsSession();

  if (!hasPermission(context.role, permission)) {
    redirect("/admin");
  }

  return context;
}

export async function requireAdminSession() {
  return requireCmsSession();
}
