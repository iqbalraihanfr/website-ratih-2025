import { z } from "zod";
import {
  displayOrderSchema,
  formString,
  imagePathSchema,
  parseWithSchema,
} from "@/features/cms/shared/validation";

export const serviceInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Judul layanan minimal 2 karakter.")
    .max(120, "Judul layanan maksimal 120 karakter."),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi layanan wajib diisi.")
    .max(2500, "Deskripsi layanan terlalu panjang."),
  image_path: imagePathSchema,
  display_order: displayOrderSchema,
});

export type ServiceInput = z.infer<typeof serviceInputSchema>;

export function parseServiceFormData(formData: FormData): ServiceInput {
  return parseWithSchema(serviceInputSchema, {
    title: formString(formData, "title"),
    description: formString(formData, "description"),
    image_path: formString(formData, "image_path"),
    display_order: formString(formData, "display_order"),
  });
}
