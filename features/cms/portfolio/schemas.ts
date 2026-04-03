import { z } from "zod";
import {
  displayOrderSchema,
  formString,
  imagePathSchema,
  parseWithSchema,
} from "@/features/cms/shared/validation";

export const portfolioItemInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Judul portfolio minimal 2 karakter.")
    .max(120, "Judul portfolio maksimal 120 karakter."),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi portfolio wajib diisi.")
    .max(2000, "Deskripsi portfolio terlalu panjang."),
  category: z
    .string()
    .trim()
    .min(2, "Kategori minimal 2 karakter.")
    .max(80, "Kategori maksimal 80 karakter."),
  image_path: imagePathSchema,
  display_order: displayOrderSchema,
});

export type PortfolioItemInput = z.infer<typeof portfolioItemInputSchema>;

export function parsePortfolioItemFormData(
  formData: FormData
): PortfolioItemInput {
  return parseWithSchema(portfolioItemInputSchema, {
    title: formString(formData, "title"),
    description: formString(formData, "description"),
    category: formString(formData, "category"),
    image_path: formString(formData, "image_path"),
    display_order: formString(formData, "display_order"),
  });
}
