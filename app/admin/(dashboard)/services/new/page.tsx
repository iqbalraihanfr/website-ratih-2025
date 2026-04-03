import { createService } from "@/app/actions/services";
import { AdminPageHeader, ItemForm } from "@/features/admin/components";
import { serviceFields } from "@/features/cms/shared/forms";

export default async function NewServicePage() {
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
