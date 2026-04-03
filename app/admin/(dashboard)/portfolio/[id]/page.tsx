import { notFound } from "next/navigation";
import { updatePortfolioItem } from "@/features/cms/portfolio/actions";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ItemForm } from "@/features/admin/components/ItemForm";
import { getAdminPortfolioItem } from "@/features/cms/portfolio/queries";
import { portfolioFields } from "@/features/cms/shared/forms";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getAdminPortfolioItem(id);

  if (!item) notFound();

  const action = updatePortfolioItem.bind(null, id);

  return (
    <div>
      <AdminPageHeader title="Edit Portfolio" />
      <ItemForm
        action={action}
        fields={portfolioFields}
        imageFolder="portfolio"
        backHref="/admin/portfolio"
        defaultValues={{
          title: item.title,
          description: item.description,
          category: item.category,
          display_order: item.display_order,
          image_path: item.image_path,
        }}
      />
    </div>
  );
}
