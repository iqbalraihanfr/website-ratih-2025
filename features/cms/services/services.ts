import type { ServiceInput } from "@/features/cms/services/schemas";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

export async function createServiceRecord(input: ServiceInput) {
  const supabase = await createAdminSupabaseClient("services.manage");
  const { error } = await supabase.from("services").insert(input);

  if (error) throw new Error(error.message);
}

export async function updateServiceRecord(id: string, input: ServiceInput) {
  const supabase = await createAdminSupabaseClient("services.manage");
  const { error } = await supabase
    .from("services")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteServiceRecord(id: string) {
  const supabase = await createAdminSupabaseClient("services.manage");
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
