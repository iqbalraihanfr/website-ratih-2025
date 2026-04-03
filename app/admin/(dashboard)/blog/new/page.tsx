import { createBlogPost } from "@/features/cms/blog/actions";
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
