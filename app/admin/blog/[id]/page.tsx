import { redirect, notFound } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createServerClient } from "@/lib/supabase-server";
import { updateBlogPost } from "@/app/actions/blog";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import type { BlogPost } from "@/lib/types/database";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const supabase = createServerClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  const action = updateBlogPost.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Edit Blog Post</h1>
      <BlogPostForm action={action} defaultValues={post as BlogPost} />
    </div>
  );
}
