"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

export async function createTeamMember(formData: FormData): Promise<void> {
  const supabase = await createAdminSupabaseClient();

  const { error } = await supabase.from("team_members").insert({
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    image_path: String(formData.get("image_path") ?? ""),
    display_order: Number(formData.get("display_order") || 0),
    social_links: [],
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/crew");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/crew");
}

export async function updateTeamMember(
  id: string,
  formData: FormData
): Promise<void> {
  const supabase = await createAdminSupabaseClient();

  const { error } = await supabase
    .from("team_members")
    .update({
      name: String(formData.get("name") ?? ""),
      role: String(formData.get("role") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      image_path: String(formData.get("image_path") ?? ""),
      display_order: Number(formData.get("display_order") || 0),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/crew");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/crew");
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = await createAdminSupabaseClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/crew");
  revalidatePath("/");
  revalidatePath("/about");
}
