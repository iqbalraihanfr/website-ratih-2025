import { z } from "zod";

function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseWithSchema<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Input tidak valid.");
  }

  return result.data;
}

export const displayOrderSchema = z.coerce
  .number()
  .int("Urutan harus berupa angka bulat.")
  .min(0, "Urutan minimal 0.")
  .max(999, "Urutan maksimal 999.");

export const imagePathSchema = z
  .string()
  .trim()
  .max(255, "Path gambar terlalu panjang.")
  .refine(
    (value) => value === "" || /^[a-z0-9/_-]+\.[a-z0-9]+$/i.test(value),
    "Path gambar tidak valid."
  );

export function formString(formData: FormData, key: string) {
  return normalizeString(formData.get(key));
}

export function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}
