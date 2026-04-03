import { notFound } from "next/navigation";
import { updateBlogPost } from "@/features/cms/blog/actions";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { BlogPostForm } from "@/features/admin/components/BlogPostForm";
import { getAdminBlogPost } from "@/features/cms/blog/queries";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getAdminBlogPost(id);

  if (!post) notFound();

  const action = updateBlogPost.bind(null, id);

  return (
    <div>
      <AdminPageHeader title="Edit Blog Post" />
      <BlogPostForm action={action} defaultValues={post} />
    </div>
  );
}
