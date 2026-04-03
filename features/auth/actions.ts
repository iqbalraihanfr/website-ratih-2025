"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { resolveCmsRole } from "@/features/auth/rbac";
import {
  CMS_TEST_EMAIL_COOKIE,
  CMS_TEST_PASSWORD,
  CMS_TEST_ROLE_COOKIE,
  getCmsTestRoleFromEmail,
  isCmsTestMode,
} from "@/lib/cms-test-mode";

function createAuthClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function login(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (isCmsTestMode()) {
    const testRole = getCmsTestRoleFromEmail(email);

    if (!testRole || password !== CMS_TEST_PASSWORD) {
      return "Email atau password tidak valid.";
    }

    const cookieStore = await cookies();
    cookieStore.set(CMS_TEST_ROLE_COOKIE, testRole, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });
    cookieStore.set(CMS_TEST_EMAIL_COOKIE, email.toLowerCase(), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    redirect("/admin");
  }

  const supabase = createAuthClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return "Email atau password tidak valid.";
  }

  const sessionUser = data.session.user;
  const cmsRole = resolveCmsRole(sessionUser);

  if (!cmsRole) {
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
  cookieStore.delete(CMS_TEST_ROLE_COOKIE);
  cookieStore.delete(CMS_TEST_EMAIL_COOKIE);
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");
  redirect("/admin/login");
}
