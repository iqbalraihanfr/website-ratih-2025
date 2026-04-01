"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { getSession } from "@/app/actions/auth";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function createPortfolioItem(formData: FormData): Promise<void> {
  await requireSession();
  const supabase = createServerClient();

  const { error } = await supabase.from("portfolio_items").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    image_path: (formData.get("image_path") as string) || "",
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
  await requireSession();
  const supabase = createServerClient();

  const { error } = await supabase
    .from("portfolio_items")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      image_path: (formData.get("image_path") as string) || "",
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
  await requireSession();
  const supabase = createServerClient();

  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}
