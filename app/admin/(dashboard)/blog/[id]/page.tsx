import { notFound } from "next/navigation";
import { updateBlogPost } from "@/app/actions/blog";
import { AdminPageHeader, BlogPostForm } from "@/features/admin/components";
import { requirePermission } from "@/features/auth/server";
import { getAdminBlogPost } from "@/features/cms/blog/queries";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("blog.manage");
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
