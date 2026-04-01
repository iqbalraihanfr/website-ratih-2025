import { redirect, notFound } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createServerClient } from "@/lib/supabase-server";
import { updateTeamMember } from "@/app/actions/crew";
import { ItemForm } from "@/components/admin/ItemForm";
import type { TeamMember } from "@/lib/types/database";

const fields = [
  { name: "name", label: "Nama", required: true },
  { name: "role", label: "Role", required: true },
  { name: "bio", label: "Bio", type: "textarea" as const, rows: 3 },
  { name: "display_order", label: "Urutan" },
];

export default async function EditCrewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const supabase = createServerClient();
  const { data: member } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  if (!member) notFound();

  const action = updateTeamMember.bind(null, id);
  const m = member as TeamMember;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Edit Anggota Tim</h1>
      <ItemForm
        action={action}
        fields={fields}
        imageFolder="crew"
        backHref="/admin/crew"
        defaultValues={{
          name: m.name,
          role: m.role,
          bio: m.bio,
          display_order: m.display_order,
          image_path: m.image_path,
        }}
      />
    </div>
  );
}
