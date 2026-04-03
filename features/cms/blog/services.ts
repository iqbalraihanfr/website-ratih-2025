import type { BlogPostInput } from "@/features/cms/blog/schemas";
import { isCmsTestMode } from "@/lib/cms-test-mode";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";
import {
  createMockRecord,
  deleteMockRecord,
  getMockRecordById,
  updateMockRecord,
} from "@/features/cms/shared/mock-store";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createBlogPostRecord(input: BlogPostInput) {
  if (isCmsTestMode()) {
    const createdAt = new Date().toISOString();
    await createMockRecord("blogPosts", {
      id: crypto.randomUUID(),
      title: input.title,
      slug: slugify(input.title),
      content: input.content,
      excerpt: input.excerpt,
      cover_image_path: input.cover_image_path,
      author: input.author,
      is_published: input.is_published,
      published_at: input.is_published ? createdAt : null,
      created_at: createdAt,
      updated_at: createdAt,
    });
    return;
  }

  const supabase = await createAdminSupabaseClient("blog.manage");
  const { error } = await supabase.from("blog_posts").insert({
    ...input,
    slug: slugify(input.title),
    published_at: input.is_published ? new Date().toISOString() : null,
  });

  if (error) throw new Error(error.message);
}

export async function updateBlogPostRecord(id: string, input: BlogPostInput) {
  if (isCmsTestMode()) {
    const existing = await getMockRecordById("blogPosts", id);

    if (!existing) {
      throw new Error("Blog post tidak ditemukan.");
    }

    let published_at: string | null = existing.published_at;
    if (input.is_published && !existing.is_published) {
      published_at = new Date().toISOString();
    } else if (!input.is_published) {
      published_at = null;
    }

    await updateMockRecord("blogPosts", id, (post) => ({
      ...post,
      ...input,
      slug: slugify(input.title),
      published_at,
      updated_at: new Date().toISOString(),
    }));
    return;
  }

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
  if (isCmsTestMode()) {
    await deleteMockRecord("blogPosts", id);
    return;
  }

  const supabase = await createAdminSupabaseClient("blog.manage");
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
