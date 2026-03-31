"use server";

import sharp from "sharp";
import { createServerClient } from "@/lib/supabase-server";
import { getSession } from "@/app/actions/auth";

export async function uploadImage(
  formData: FormData
): Promise<{ path: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string;

  if (!file || !folder) return { error: "Missing file or folder" };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();

  const filename = `${folder}/${Date.now()}.webp`;
  const supabase = createServerClient();

  const { error } = await supabase.storage
    .from("images")
    .upload(filename, webpBuffer, { contentType: "image/webp", upsert: false });

  if (error) return { error: error.message };
  return { path: filename };
}
