import { requirePermission } from "@/features/auth/server";
import type { CmsPermission } from "@/features/auth/rbac";
import { createServerClient } from "@/lib/supabase-server";

export async function createAdminSupabaseClient(permission: CmsPermission) {
  await requirePermission(permission);
  return createServerClient();
}
