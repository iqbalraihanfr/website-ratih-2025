import { createTeamMember } from "@/app/actions/crew";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ItemForm } from "@/features/admin/components/ItemForm";
import { crewFields } from "@/features/cms/shared/forms";

export default async function NewCrewPage() {
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
