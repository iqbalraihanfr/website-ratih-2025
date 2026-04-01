import type { BlogPost } from "@/lib/types/database";
import { createPublicServerClient } from "@/lib/supabase-public-server";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

export async function listPublishedBlogPosts() {
  const supabase = createPublicServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (data as BlogPost[]) ?? [];
}

export async function listAdminBlogPosts() {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as BlogPost[]) ?? [];
}

export async function getAdminBlogPost(id: string) {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  return (data as BlogPost | null) ?? null;
}
