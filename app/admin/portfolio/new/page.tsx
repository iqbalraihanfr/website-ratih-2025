import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createPortfolioItem } from "@/app/actions/portfolio";
import { ItemForm } from "@/components/admin/ItemForm";

const fields = [
  { name: "title", label: "Judul", required: true },
  { name: "description", label: "Deskripsi", type: "textarea" as const, rows: 3 },
  { name: "category", label: "Kategori", required: true },
  { name: "display_order", label: "Urutan" },
];

export default async function NewPortfolioPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Tambah Portfolio</h1>
      <ItemForm
        action={createPortfolioItem}
        fields={fields}
        imageFolder="portfolio"
        backHref="/admin/portfolio"
      />
    </div>
  );
}
