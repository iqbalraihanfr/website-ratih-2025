import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createService } from "@/app/actions/services";
import { ItemForm } from "@/components/admin/ItemForm";

const fields = [
  { name: "title", label: "Judul", required: true },
  { name: "description", label: "Deskripsi", type: "textarea" as const, rows: 4 },
  { name: "display_order", label: "Urutan" },
];

export default async function NewServicePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Tambah Layanan</h1>
      <ItemForm
        action={createService}
        fields={fields}
        imageFolder="services"
        backHref="/admin/services"
      />
    </div>
  );
}
