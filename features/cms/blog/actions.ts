"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createBlogPost(formData: FormData): Promise<void> {
  const supabase = await createAdminSupabaseClient();

  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "");
  const author = String(formData.get("author") ?? "");
  const cover_image_path = String(formData.get("cover_image_path") ?? "");
  const is_published = formData.get("is_published") === "true";

  const { error } = await supabase.from("blog_posts").insert({
    title,
    slug: slugify(title),
    content,
    excerpt,
    author,
    cover_image_path,
    is_published,
    published_at: is_published ? new Date().toISOString() : null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(
  id: string,
  formData: FormData
): Promise<void> {
  const supabase = await createAdminSupabaseClient();

  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "");
  const author = String(formData.get("author") ?? "");
  const cover_image_path = String(formData.get("cover_image_path") ?? "");
  const is_published = formData.get("is_published") === "true";

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published_at, is_published")
    .eq("id", id)
    .single();

  let published_at: string | null = existing?.published_at ?? null;
  if (is_published && !existing?.is_published) {
    published_at = new Date().toISOString();
  } else if (!is_published) {
    published_at = null;
  }

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      slug: slugify(title),
      content,
      excerpt,
      author,
      cover_image_path,
      is_published,
      published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = await createAdminSupabaseClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
