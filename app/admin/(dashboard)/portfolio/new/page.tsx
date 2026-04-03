import { createPortfolioItem } from "@/app/actions/portfolio";
import { AdminPageHeader, ItemForm } from "@/features/admin/components";
import { portfolioFields } from "@/features/cms/shared/forms";

export default async function NewPortfolioPage() {
  return (
    <div>
      <AdminPageHeader title="Tambah Portfolio" />
      <ItemForm
        action={createPortfolioItem}
        fields={portfolioFields}
        imageFolder="portfolio"
        backHref="/admin/portfolio"
      />
    </div>
  );
}
