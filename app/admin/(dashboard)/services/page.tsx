import Link from "next/link";
import { deleteService } from "@/app/actions/services";
import { AdminPageHeader } from "@/features/admin/components";
import { requirePermission } from "@/features/auth/server";
import { listAdminServices } from "@/features/cms/services/queries";

export default async function AdminServicesPage() {
  await requirePermission("services.manage");
  const services = await listAdminServices();

  return (
    <div>
      <AdminPageHeader
        title="Layanan"
        ctaHref="/admin/services/new"
        ctaLabel="Tambah Layanan"
      />

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {!services?.length ? (
          <p className="text-zinc-400 text-sm p-6">Belum ada layanan.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Judul
                </th>
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Urutan
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-zinc-800 last:border-0"
                >
                  <td className="px-6 py-4 text-white">{service.title}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    {service.display_order}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/services/${service.id}`}
                        aria-label={`Edit layanan ${service.title}`}
                        title={`Edit layanan ${service.title}`}
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        <i className="ri-edit-line text-lg" />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteService(service.id);
                        }}
                      >
                        <button
                          type="submit"
                          aria-label={`Hapus layanan ${service.title}`}
                          title={`Hapus layanan ${service.title}`}
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
