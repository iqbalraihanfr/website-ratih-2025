import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createServerClient } from "@/lib/supabase-server";
import { deleteTeamMember } from "@/app/actions/crew";
import type { TeamMember } from "@/lib/types/database";

export default async function AdminCrewPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const supabase = createServerClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Tim</h1>
        <Link
          href="/admin/crew/new"
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
        >
          <i className="ri-add-line" />
          Tambah Anggota
        </Link>
      </div>

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
              {(members as TeamMember[]).map((member) => (
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
