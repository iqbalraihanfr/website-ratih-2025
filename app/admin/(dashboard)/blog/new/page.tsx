import { createBlogPost } from "@/app/actions/blog";
import { AdminPageHeader, BlogPostForm } from "@/features/admin/components";
import { requirePermission } from "@/features/auth/server";

export default async function NewBlogPostPage() {
  await requirePermission("blog.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Blog Post" />
      <BlogPostForm action={createBlogPost} />
    </div>
  );
}
