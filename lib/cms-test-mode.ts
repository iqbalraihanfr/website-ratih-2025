import type { CmsRole } from "@/features/auth/rbac";

export const CMS_TEST_ROLE_COOKIE = "cms-test-role";
export const CMS_TEST_EMAIL_COOKIE = "cms-test-email";
export const CMS_TEST_PASSWORD = "ratih-admin-test-password";

const cmsTestRolesByEmail: Record<string, CmsRole> = {
  "owner@ratih.test": "owner",
  "admin@ratih.test": "admin",
  "editor@ratih.test": "editor",
  "viewer@ratih.test": "viewer",
};

export function isCmsTestMode() {
  return process.env.CMS_TEST_MODE === "true";
}

export function getCmsTestRoleFromEmail(
  email: string | null | undefined
): CmsRole | null {
  if (!email) return null;

  return cmsTestRolesByEmail[email.trim().toLowerCase()] ?? null;
}
