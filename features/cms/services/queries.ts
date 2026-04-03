import type { Service } from "@/lib/types/database";
import { createPublicServerClient } from "@/lib/supabase-public-server";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

export async function listServices() {
  const supabase = createPublicServerClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as Service[]) ?? [];
}

export async function listAdminServices() {
  const supabase = await createAdminSupabaseClient("services.manage");
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as Service[]) ?? [];
}

export async function getAdminService(id: string) {
  const supabase = await createAdminSupabaseClient("services.manage");
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  return (data as Service | null) ?? null;
}
