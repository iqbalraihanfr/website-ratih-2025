"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { getSession } from "@/app/actions/auth";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function createTeamMember(formData: FormData): Promise<void> {
  await requireSession();
  const supabase = createServerClient();

  const { error } = await supabase.from("team_members").insert({
    name: formData.get("name") as string,
    role: formData.get("role") as string,
    bio: formData.get("bio") as string,
    image_path: (formData.get("image_path") as string) || "",
    display_order: Number(formData.get("display_order") || 0),
    social_links: [],
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/crew");
  redirect("/admin/crew");
}

export async function updateTeamMember(
  id: string,
  formData: FormData
): Promise<void> {
  await requireSession();
  const supabase = createServerClient();

  const { error } = await supabase
    .from("team_members")
    .update({
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      bio: formData.get("bio") as string,
      image_path: (formData.get("image_path") as string) || "",
      display_order: Number(formData.get("display_order") || 0),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/crew");
  redirect("/admin/crew");
}

export async function deleteTeamMember(id: string): Promise<void> {
  await requireSession();
  const supabase = createServerClient();

  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/crew");
}
