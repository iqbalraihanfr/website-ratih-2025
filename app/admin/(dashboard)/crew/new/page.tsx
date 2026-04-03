import { createTeamMember } from "@/app/actions/crew";
import { AdminPageHeader, ItemForm } from "@/features/admin/components";
import { requirePermission } from "@/features/auth/server";
import { crewFields } from "@/features/cms/shared/forms";

export default async function NewCrewPage() {
  await requirePermission("crew.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Anggota Tim" />
      <ItemForm
        action={createTeamMember}
        fields={crewFields}
        imageFolder="crew"
        backHref="/admin/crew"
      />
    </div>
  );
}
