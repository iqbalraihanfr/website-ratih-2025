"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { getSession } from "@/app/actions/auth";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createBlogPost(formData: FormData): Promise<void> {
  await requireSession();
  const supabase = createServerClient();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const author = formData.get("author") as string;
  const cover_image_path = (formData.get("cover_image_path") as string) || "";
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
  redirect("/admin/blog");
}

export async function updateBlogPost(
  id: string,
  formData: FormData
): Promise<void> {
  await requireSession();
  const supabase = createServerClient();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const author = formData.get("author") as string;
  const cover_image_path = (formData.get("cover_image_path") as string) || "";
  const is_published = formData.get("is_published") === "true";

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
      published_at: is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string): Promise<void> {
  await requireSession();
  const supabase = createServerClient();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
}
