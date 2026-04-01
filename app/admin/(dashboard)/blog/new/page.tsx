import { createBlogPost } from "@/app/actions/blog";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { BlogPostForm } from "@/features/admin/components/BlogPostForm";

export default async function NewBlogPostPage() {
  return (
    <div>
      <AdminPageHeader title="Tambah Blog Post" />
      <BlogPostForm action={createBlogPost} />
    </div>
  );
}
