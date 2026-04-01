import { requireAdminSession } from "@/features/auth/server";
import { createServerClient } from "@/lib/supabase-server";

export async function createAdminSupabaseClient() {
  await requireAdminSession();
  return createServerClient();
}
