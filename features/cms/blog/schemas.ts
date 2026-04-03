import { z } from "zod";
import {
  formBoolean,
  formString,
  imagePathSchema,
  parseWithSchema,
} from "@/features/cms/shared/validation";

export const blogPostInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul blog minimal 3 karakter.")
    .max(120, "Judul blog maksimal 120 karakter."),
  content: z
    .string()
    .trim()
    .min(1, "Konten blog wajib diisi.")
    .max(20000, "Konten blog terlalu panjang."),
  excerpt: z
    .string()
    .trim()
    .max(320, "Excerpt maksimal 320 karakter."),
  author: z
    .string()
    .trim()
    .min(2, "Nama author minimal 2 karakter.")
    .max(80, "Nama author maksimal 80 karakter."),
  cover_image_path: imagePathSchema,
  is_published: z.boolean(),
});

export type BlogPostInput = z.infer<typeof blogPostInputSchema>;

export function parseBlogPostFormData(formData: FormData): BlogPostInput {
  return parseWithSchema(blogPostInputSchema, {
    title: formString(formData, "title"),
    content: formString(formData, "content"),
    excerpt: formString(formData, "excerpt"),
    author: formString(formData, "author"),
    cover_image_path: formString(formData, "cover_image_path"),
    is_published: formBoolean(formData, "is_published"),
  });
}
