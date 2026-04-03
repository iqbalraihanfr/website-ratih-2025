"use server";

import { isCmsTestMode } from "@/lib/cms-test-mode";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";
import {
  MAX_UPLOAD_SIZE,
  optimizeCmsImageBuffer,
} from "@/features/cms/shared/image-optimizer";

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
  const optimizedImage = await optimizeCmsImageBuffer(buffer);

  const filename = `${folder}/${crypto.randomUUID()}.${optimizedImage.extension}`;

  if (isCmsTestMode()) {
    return { path: filename };
  }

  const supabase = await createAdminSupabaseClient("media.upload");
  const { error } = await supabase.storage
    .from("images")
    .upload(filename, optimizedImage.buffer, {
      contentType: optimizedImage.contentType,
      upsert: false,
    });

  if (error) return { error: error.message };

  return { path: filename };
}
