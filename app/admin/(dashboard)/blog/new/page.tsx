import { createBlogPost } from "@/app/actions/blog";
import { AdminPageHeader, BlogPostForm } from "@/features/admin/components";

export default async function NewBlogPostPage() {
  return (
    <div>
      <AdminPageHeader title="Tambah Blog Post" />
      <BlogPostForm action={createBlogPost} />
    </div>
  );
}
