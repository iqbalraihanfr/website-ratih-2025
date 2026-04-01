import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createBlogPost } from "@/app/actions/blog";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default async function NewBlogPostPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Tambah Blog Post</h1>
      <BlogPostForm action={createBlogPost} />
    </div>
  );
}
