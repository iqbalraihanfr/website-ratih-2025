import type { ItemFormField } from "@/features/admin/components/ItemForm";

export const portfolioFields: ItemFormField[] = [
  { name: "title", label: "Judul", required: true },
  { name: "description", label: "Deskripsi", type: "textarea", rows: 3 },
  { name: "category", label: "Kategori", required: true },
  { name: "display_order", label: "Urutan" },
];

export const crewFields: ItemFormField[] = [
  { name: "name", label: "Nama", required: true },
  { name: "role", label: "Role", required: true },
  { name: "bio", label: "Bio", type: "textarea", rows: 3 },
  { name: "display_order", label: "Urutan" },
];

export const serviceFields: ItemFormField[] = [
  { name: "title", label: "Judul", required: true },
  { name: "description", label: "Deskripsi", type: "textarea", rows: 4 },
  { name: "display_order", label: "Urutan" },
];
