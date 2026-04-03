import type { User } from "@supabase/supabase-js";

export type CmsRole = "owner" | "admin" | "editor" | "viewer";

export type CmsPermission =
  | "dashboard.view"
  | "blog.manage"
  | "portfolio.manage"
  | "services.manage"
  | "crew.manage"
  | "media.upload";

const rolePermissions: Record<CmsRole, CmsPermission[]> = {
  owner: [
    "dashboard.view",
    "blog.manage",
    "portfolio.manage",
    "services.manage",
    "crew.manage",
    "media.upload",
  ],
  admin: [
    "dashboard.view",
    "blog.manage",
    "portfolio.manage",
    "services.manage",
    "crew.manage",
    "media.upload",
  ],
  editor: [
    "dashboard.view",
    "blog.manage",
    "portfolio.manage",
    "services.manage",
    "media.upload",
  ],
  viewer: ["dashboard.view"],
};

function getEmailAllowlist(envName: string) {
  return new Set(
    (process.env[envName] ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function getRoleFromEmailAllowlist(email: string | undefined) {
  const normalizedEmail = email?.toLowerCase();
  if (!normalizedEmail) return null;

  if (getEmailAllowlist("OWNER_EMAILS").has(normalizedEmail)) return "owner";
  if (getEmailAllowlist("ADMIN_EMAILS").has(normalizedEmail)) return "admin";
  if (getEmailAllowlist("EDITOR_EMAILS").has(normalizedEmail)) return "editor";
  if (getEmailAllowlist("VIEWER_EMAILS").has(normalizedEmail)) return "viewer";

  return null;
}

export function resolveCmsRole(user: User): CmsRole | null {
  const appRole = user.app_metadata?.role;

  if (
    appRole === "owner" ||
    appRole === "admin" ||
    appRole === "editor" ||
    appRole === "viewer"
  ) {
    return appRole;
  }

  return getRoleFromEmailAllowlist(user.email);
}

export function getPermissionsForRole(role: CmsRole) {
  return rolePermissions[role];
}

export function hasPermission(
  role: CmsRole,
  permission: CmsPermission
) {
  return rolePermissions[role].includes(permission);
}
