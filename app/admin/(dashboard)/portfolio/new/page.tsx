import { createPortfolioItem } from "@/features/cms/portfolio/actions";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ItemForm } from "@/features/admin/components/ItemForm";
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
