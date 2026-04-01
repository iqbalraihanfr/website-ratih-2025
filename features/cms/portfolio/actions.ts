"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

export async function createPortfolioItem(formData: FormData): Promise<void> {
  const supabase = await createAdminSupabaseClient();

  const { error } = await supabase.from("portfolio_items").insert({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    image_path: String(formData.get("image_path") ?? ""),
    display_order: Number(formData.get("display_order") || 0),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function updatePortfolioItem(
  id: string,
  formData: FormData
): Promise<void> {
  const supabase = await createAdminSupabaseClient();

  const { error } = await supabase
    .from("portfolio_items")
    .update({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? ""),
      image_path: String(formData.get("image_path") ?? ""),
      display_order: Number(formData.get("display_order") || 0),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const supabase = await createAdminSupabaseClient();
  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}
