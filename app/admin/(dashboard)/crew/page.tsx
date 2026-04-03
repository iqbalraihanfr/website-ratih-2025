import Link from "next/link";
import { deleteTeamMember } from "@/app/actions/crew";
import { AdminPageHeader } from "@/features/admin/components";
import { listAdminTeamMembers } from "@/features/cms/crew/queries";

export default async function AdminCrewPage() {
  const members = await listAdminTeamMembers();

  return (
    <div>
      <AdminPageHeader
        title="Tim"
        ctaHref="/admin/crew/new"
        ctaLabel="Tambah Anggota"
      />

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {!members?.length ? (
          <p className="text-zinc-400 text-sm p-6">Belum ada anggota tim.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Nama
                </th>
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Role
                </th>
                <th className="text-left text-zinc-400 font-medium px-6 py-3">
                  Urutan
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-zinc-800 last:border-0"
                >
                  <td className="px-6 py-4 text-white">{member.name}</td>
                  <td className="px-6 py-4 text-zinc-400">{member.role}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    {member.display_order}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/crew/${member.id}`}
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        <i className="ri-edit-line text-lg" />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteTeamMember(member.id);
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
