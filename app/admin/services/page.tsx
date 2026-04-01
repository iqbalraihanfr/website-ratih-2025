import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createServerClient } from "@/lib/supabase-server";
import { deleteService } from "@/app/actions/services";
import type { Service } from "@/lib/types/database";

export default async function AdminServicesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const supabase = createServerClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Layanan</h1>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
        >
          <i className="ri-add-line" />
          Tambah Layanan
        </Link>
      </div>

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
              {(services as Service[]).map((service) => (
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
