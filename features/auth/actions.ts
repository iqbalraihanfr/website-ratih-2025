"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function createAuthClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function getAllowedAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

function isAllowedAdminEmail(email: string | undefined) {
  if (!email) return false;
  return getAllowedAdminEmails().has(email.toLowerCase());
}

function isAdminRole(role: unknown) {
  return role === "admin" || role === "owner";
}

export async function login(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = createAuthClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return "Email atau password tidak valid.";
  }

  const sessionUser = data.session.user;
  const canAccessAdmin =
    isAdminRole(sessionUser.app_metadata?.role) ||
    isAllowedAdminEmail(sessionUser.email);

  if (!canAccessAdmin) {
    return "Akun ini belum diizinkan mengakses CMS.";
  }

  const cookieStore = await cookies();
  cookieStore.set("sb-access-token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: data.session.expires_in,
    path: "/",
  });
  cookieStore.set("sb-refresh-token", data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/admin");
  return null;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");
  redirect("/admin/login");
}
