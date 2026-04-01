"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

export async function createService(formData: FormData): Promise<void> {
  const supabase = await createAdminSupabaseClient();

  const { error } = await supabase.from("services").insert({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    image_path: String(formData.get("image_path") ?? ""),
    display_order: Number(formData.get("display_order") || 0),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateService(
  id: string,
  formData: FormData
): Promise<void> {
  const supabase = await createAdminSupabaseClient();

  const { error } = await supabase
    .from("services")
    .update({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      image_path: String(formData.get("image_path") ?? ""),
      display_order: Number(formData.get("display_order") || 0),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteService(id: string): Promise<void> {
  const supabase = await createAdminSupabaseClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/services");
  revalidatePath("/");
}
