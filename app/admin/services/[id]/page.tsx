import { redirect, notFound } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createServerClient } from "@/lib/supabase-server";
import { updateService } from "@/app/actions/services";
import { ItemForm } from "@/components/admin/ItemForm";
import type { Service } from "@/lib/types/database";

const fields = [
  { name: "title", label: "Judul", required: true },
  { name: "description", label: "Deskripsi", type: "textarea" as const, rows: 4 },
  { name: "display_order", label: "Urutan" },
];

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const supabase = createServerClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (!service) notFound();

  const action = updateService.bind(null, id);
  const s = service as Service;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Edit Layanan</h1>
      <ItemForm
        action={action}
        fields={fields}
        imageFolder="services"
        backHref="/admin/services"
        defaultValues={{
          title: s.title,
          description: s.description,
          display_order: s.display_order,
          image_path: s.image_path,
        }}
      />
    </div>
  );
}
