"use server";

import sharp from "sharp";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set(["blog", "portfolio", "crew", "services"]);
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function uploadCmsImage(formData: FormData) {
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "");

  if (!(file instanceof File)) return { error: "No file uploaded." };
  if (!ALLOWED_FOLDERS.has(folder)) return { error: "Invalid upload folder." };
  if (!ALLOWED_FILE_TYPES.has(file.type)) {
    return { error: "Format gambar harus JPG, PNG, WEBP, atau AVIF." };
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    return { error: "Ukuran gambar maksimal 5MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const webpBuffer = await sharp(buffer)
    .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const filename = `${folder}/${crypto.randomUUID()}.webp`;
  const supabase = await createAdminSupabaseClient();
  const { error } = await supabase.storage
    .from("images")
    .upload(filename, webpBuffer, {
      contentType: "image/webp",
      upsert: false,
    });

  if (error) return { error: error.message };

  return { path: filename };
}
