import type { BlogPost } from "@/lib/types/database";
import { isCmsTestMode } from "@/lib/cms-test-mode";
import { createPublicServerClient } from "@/lib/supabase-public-server";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";
import {
  getMockRecordById,
  listMockRecords,
} from "@/features/cms/shared/mock-store";

export async function listPublishedBlogPosts() {
  if (isCmsTestMode()) {
    const posts = await listMockRecords("blogPosts");
    return posts
      .filter((post) => post.is_published)
      .sort((a, b) =>
        (b.published_at ?? b.created_at).localeCompare(
          a.published_at ?? a.created_at
        )
      );
  }

  const supabase = createPublicServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (data as BlogPost[]) ?? [];
}

export async function listAdminBlogPosts() {
  if (isCmsTestMode()) {
    const posts = await listMockRecords("blogPosts");
    return posts.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  const supabase = await createAdminSupabaseClient("blog.manage");
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as BlogPost[]) ?? [];
}

export async function getAdminBlogPost(id: string) {
  if (isCmsTestMode()) {
    return getMockRecordById("blogPosts", id);
  }

  const supabase = await createAdminSupabaseClient("blog.manage");
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  return (data as BlogPost | null) ?? null;
}
