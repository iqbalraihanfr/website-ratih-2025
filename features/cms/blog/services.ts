import type { BlogPostInput } from "@/features/cms/blog/schemas";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createBlogPostRecord(input: BlogPostInput) {
  const supabase = await createAdminSupabaseClient("blog.manage");
  const { error } = await supabase.from("blog_posts").insert({
    ...input,
    slug: slugify(input.title),
    published_at: input.is_published ? new Date().toISOString() : null,
  });

  if (error) throw new Error(error.message);
}

export async function updateBlogPostRecord(id: string, input: BlogPostInput) {
  const supabase = await createAdminSupabaseClient("blog.manage");
  const { data: existing, error: existingError } = await supabase
    .from("blog_posts")
    .select("published_at, is_published")
    .eq("id", id)
    .single();

  if (existingError) throw new Error(existingError.message);

  let published_at: string | null = existing?.published_at ?? null;
  if (input.is_published && !existing?.is_published) {
    published_at = new Date().toISOString();
  } else if (!input.is_published) {
    published_at = null;
  }

  const { error } = await supabase
    .from("blog_posts")
    .update({
      ...input,
      slug: slugify(input.title),
      published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteBlogPostRecord(id: string) {
  const supabase = await createAdminSupabaseClient("blog.manage");
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
