import { notFound } from "next/navigation";
import { updateTeamMember } from "@/app/actions/crew";
import { AdminPageHeader, ItemForm } from "@/features/admin/components";
import { requirePermission } from "@/features/auth/server";
import { getAdminTeamMember } from "@/features/cms/crew/queries";
import { crewFields } from "@/features/cms/shared/forms";

export default async function EditCrewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("crew.manage");
  const { id } = await params;
  const member = await getAdminTeamMember(id);

  if (!member) notFound();

  const action = updateTeamMember.bind(null, id);

  return (
    <div>
      <AdminPageHeader title="Edit Anggota Tim" />
      <ItemForm
        action={action}
        fields={crewFields}
        imageFolder="crew"
        backHref="/admin/crew"
        defaultValues={{
          name: member.name,
          role: member.role,
          bio: member.bio,
          display_order: member.display_order,
          image_path: member.image_path,
        }}
      />
    </div>
  );
}
