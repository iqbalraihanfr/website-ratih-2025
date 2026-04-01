import { redirect, notFound } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createServerClient } from "@/lib/supabase-server";
import { updatePortfolioItem } from "@/app/actions/portfolio";
import { ItemForm } from "@/components/admin/ItemForm";
import type { PortfolioItem } from "@/lib/types/database";

const fields = [
  { name: "title", label: "Judul", required: true },
  { name: "description", label: "Deskripsi", type: "textarea" as const, rows: 3 },
  { name: "category", label: "Kategori", required: true },
  { name: "display_order", label: "Urutan" },
];

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const supabase = createServerClient();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

  const action = updatePortfolioItem.bind(null, id);
  const portfolio = item as PortfolioItem;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Edit Portfolio</h1>
      <ItemForm
        action={action}
        fields={fields}
        imageFolder="portfolio"
        backHref="/admin/portfolio"
        defaultValues={{
          title: portfolio.title,
          description: portfolio.description,
          category: portfolio.category,
          display_order: portfolio.display_order,
          image_path: portfolio.image_path,
        }}
      />
    </div>
  );
}
