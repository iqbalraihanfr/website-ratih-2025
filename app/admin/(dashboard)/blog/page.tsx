import Link from "next/link";
import { deleteBlogPost } from "@/app/actions/blog";
import { AdminPageHeader } from "@/features/admin/components";
import { requirePermission } from "@/features/auth/server";
import { listAdminBlogPosts } from "@/features/cms/blog/queries";

export default async function AdminBlogPage() {
  await requirePermission("blog.manage");
  const posts = await listAdminBlogPosts();

  return (
    <div>
      <AdminPageHeader
        title="Blog Posts"
        ctaHref="/admin/blog/new"
        ctaLabel="Tambah Post"
      />

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {!posts?.length ? (
          <p className="text-zinc-400 text-sm p-6">Belum ada blog post.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Judul
                </th>
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Author
                </th>
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Status
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-zinc-800 last:border-0"
                >
                  <td className="px-6 py-4 text-white">{post.title}</td>
                  <td className="px-6 py-4 text-zinc-400">{post.author}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        post.is_published
                          ? "bg-green-900/50 text-green-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        aria-label={`Edit blog post ${post.title}`}
                        title={`Edit blog post ${post.title}`}
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        <i className="ri-edit-line text-lg" />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteBlogPost(post.id);
                        }}
                      >
                        <button
                          type="submit"
                          aria-label={`Hapus blog post ${post.title}`}
                          title={`Hapus blog post ${post.title}`}
                          className="text-zinc-400 hover:text-red-400 transition-colors"
                        >
                          <i className="ri-delete-bin-line text-lg" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
