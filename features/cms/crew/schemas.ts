import { z } from "zod";
import {
  displayOrderSchema,
  formString,
  imagePathSchema,
  parseWithSchema,
} from "@/features/cms/shared/validation";

export const teamMemberInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama anggota minimal 2 karakter.")
    .max(100, "Nama anggota maksimal 100 karakter."),
  role: z
    .string()
    .trim()
    .min(2, "Role anggota minimal 2 karakter.")
    .max(100, "Role anggota maksimal 100 karakter."),
  bio: z
    .string()
    .trim()
    .min(1, "Bio anggota wajib diisi.")
    .max(3000, "Bio anggota terlalu panjang."),
  image_path: imagePathSchema,
  display_order: displayOrderSchema,
});

export type TeamMemberInput = z.infer<typeof teamMemberInputSchema>;

export function parseTeamMemberFormData(formData: FormData): TeamMemberInput {
  return parseWithSchema(teamMemberInputSchema, {
    name: formString(formData, "name"),
    role: formString(formData, "role"),
    bio: formString(formData, "bio"),
    image_path: formString(formData, "image_path"),
    display_order: formString(formData, "display_order"),
  });
}
