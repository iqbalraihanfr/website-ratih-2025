import Link from "next/link";
import { deletePortfolioItem } from "@/app/actions/portfolio";
import { AdminPageHeader } from "@/features/admin/components";
import { requirePermission } from "@/features/auth/server";
import { listAdminPortfolioItems } from "@/features/cms/portfolio/queries";

export default async function AdminPortfolioPage() {
  await requirePermission("portfolio.manage");
  const items = await listAdminPortfolioItems();

  return (
    <div>
      <AdminPageHeader
        title="Portfolio"
        ctaHref="/admin/portfolio/new"
        ctaLabel="Tambah Item"
      />

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {!items?.length ? (
          <p className="text-zinc-400 text-sm p-6">Belum ada portfolio.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Judul
                </th>
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Kategori
                </th>
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Urutan
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-zinc-800 last:border-0"
                >
                  <td className="px-6 py-4 text-white">{item.title}</td>
                  <td className="px-6 py-4 text-zinc-400">{item.category}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    {item.display_order}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/portfolio/${item.id}`}
                        aria-label={`Edit portfolio ${item.title}`}
                        title={`Edit portfolio ${item.title}`}
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        <i className="ri-edit-line text-lg" />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deletePortfolioItem(item.id);
                        }}
                      >
                        <button
                          type="submit"
                          aria-label={`Hapus portfolio ${item.title}`}
                          title={`Hapus portfolio ${item.title}`}
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
