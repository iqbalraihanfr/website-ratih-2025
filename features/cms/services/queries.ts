import type { Service } from "@/lib/types/database";
import { isCmsTestMode } from "@/lib/cms-test-mode";
import { createPublicServerClient } from "@/lib/supabase-public-server";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";
import {
  getMockRecordById,
  listMockRecords,
} from "@/features/cms/shared/mock-store";

export async function listServices() {
  if (isCmsTestMode()) {
    const services = await listMockRecords("services");
    return services.sort((a, b) => a.display_order - b.display_order);
  }

  const supabase = createPublicServerClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as Service[]) ?? [];
}

export async function listAdminServices() {
  if (isCmsTestMode()) {
    const services = await listMockRecords("services");
    return services.sort((a, b) => a.display_order - b.display_order);
  }

  const supabase = await createAdminSupabaseClient("services.manage");
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as Service[]) ?? [];
}

export async function getAdminService(id: string) {
  if (isCmsTestMode()) {
    return getMockRecordById("services", id);
  }

  const supabase = await createAdminSupabaseClient("services.manage");
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  return (data as Service | null) ?? null;
}
