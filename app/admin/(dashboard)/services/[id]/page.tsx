import { notFound } from "next/navigation";
import { updateService } from "@/app/actions/services";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ItemForm } from "@/features/admin/components/ItemForm";
import { getAdminService } from "@/features/cms/services/queries";
import { serviceFields } from "@/features/cms/shared/forms";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getAdminService(id);

  if (!service) notFound();

  const action = updateService.bind(null, id);

  return (
    <div>
      <AdminPageHeader title="Edit Layanan" />
      <ItemForm
        action={action}
        fields={serviceFields}
        imageFolder="services"
        backHref="/admin/services"
        defaultValues={{
          title: service.title,
          description: service.description,
          display_order: service.display_order,
          image_path: service.image_path,
        }}
      />
    </div>
  );
}
