import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createTeamMember } from "@/app/actions/crew";
import { ItemForm } from "@/components/admin/ItemForm";

const fields = [
  { name: "name", label: "Nama", required: true },
  { name: "role", label: "Role", required: true },
  { name: "bio", label: "Bio", type: "textarea" as const, rows: 3 },
  { name: "display_order", label: "Urutan" },
];

export default async function NewCrewPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Tambah Anggota Tim</h1>
      <ItemForm
        action={createTeamMember}
        fields={fields}
        imageFolder="crew"
        backHref="/admin/crew"
      />
    </div>
  );
}
