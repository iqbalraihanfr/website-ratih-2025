import type { ServiceInput } from "@/features/cms/services/schemas";
import { isCmsTestMode } from "@/lib/cms-test-mode";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";
import {
  createMockRecord,
  deleteMockRecord,
  updateMockRecord,
} from "@/features/cms/shared/mock-store";

export async function createServiceRecord(input: ServiceInput) {
  if (isCmsTestMode()) {
    const createdAt = new Date().toISOString();
    await createMockRecord("services", {
      id: crypto.randomUUID(),
      ...input,
      created_at: createdAt,
      updated_at: createdAt,
    });
    return;
  }

  const supabase = await createAdminSupabaseClient("services.manage");
  const { error } = await supabase.from("services").insert(input);

  if (error) throw new Error(error.message);
}

export async function updateServiceRecord(id: string, input: ServiceInput) {
  if (isCmsTestMode()) {
    await updateMockRecord("services", id, (service) => ({
      ...service,
      ...input,
      updated_at: new Date().toISOString(),
    }));
    return;
  }

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
  if (isCmsTestMode()) {
    await deleteMockRecord("services", id);
    return;
  }

  const supabase = await createAdminSupabaseClient("services.manage");
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
