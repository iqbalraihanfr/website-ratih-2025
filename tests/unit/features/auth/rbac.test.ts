import type { User } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getPermissionsForRole,
  getRoleFromEmailAllowlist,
  hasPermission,
  resolveCmsRole,
} from "@/features/auth/rbac";

function createUser(overrides: Partial<User> = {}) {
  return {
    id: "user-1",
    email: "admin@example.com",
    aud: "authenticated",
    role: "authenticated",
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
    ...overrides,
  } as User;
}

describe("rbac", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("resolves roles from ordered email allowlists", () => {
    vi.stubEnv("OWNER_EMAILS", "owner@example.com");
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    vi.stubEnv("EDITOR_EMAILS", "editor@example.com");
    vi.stubEnv("VIEWER_EMAILS", "viewer@example.com");

    expect(getRoleFromEmailAllowlist("owner@example.com")).toBe("owner");
    expect(getRoleFromEmailAllowlist("admin@example.com")).toBe("admin");
    expect(getRoleFromEmailAllowlist("editor@example.com")).toBe("editor");
    expect(getRoleFromEmailAllowlist("viewer@example.com")).toBe("viewer");
    expect(getRoleFromEmailAllowlist("other@example.com")).toBeNull();
  });

  it("prioritizes explicit app_metadata role over email allowlist", () => {
    vi.stubEnv("VIEWER_EMAILS", "editor@example.com");

    const user = createUser({
      email: "editor@example.com",
      app_metadata: { role: "admin" },
    });

    expect(resolveCmsRole(user)).toBe("admin");
  });

  it("returns permissions by role and enforces access checks", () => {
    expect(getPermissionsForRole("editor")).toContain("blog.manage");
    expect(getPermissionsForRole("viewer")).not.toContain("blog.manage");
    expect(hasPermission("editor", "media.upload")).toBe(true);
    expect(hasPermission("viewer", "media.upload")).toBe(false);
  });
});
