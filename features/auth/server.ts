import { createClient, type Session, type User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function createAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase auth credentials.");
  }

  return createClient(url, key);
}

function getAllowedAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

function hasAdminRole(user: User) {
  const role = user.app_metadata?.role;
  return role === "admin" || role === "owner";
}

function isAdminUser(user: User) {
  const allowedEmails = getAllowedAdminEmails();
  const email = user.email?.toLowerCase();

  if (hasAdminRole(user)) return true;
  if (!email) return false;

  return allowedEmails.has(email);
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

export async function getAdminSession(): Promise<Session | null> {
  const session = await getSession();
  if (!session?.user) return null;

  return isAdminUser(session.user) ? session : null;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
