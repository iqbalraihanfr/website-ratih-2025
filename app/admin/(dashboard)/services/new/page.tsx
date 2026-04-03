import { createService } from "@/app/actions/services";
import { AdminPageHeader, ItemForm } from "@/features/admin/components";
import { requirePermission } from "@/features/auth/server";
import { serviceFields } from "@/features/cms/shared/forms";

export default async function NewServicePage() {
  await requirePermission("services.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Layanan" />
      <ItemForm
        action={createService}
        fields={serviceFields}
        imageFolder="services"
        backHref="/admin/services"
      />
    </div>
  );
}
