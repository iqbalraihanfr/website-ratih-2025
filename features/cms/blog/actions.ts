"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseBlogPostFormData } from "@/features/cms/blog/schemas";
import {
  createBlogPostRecord,
  deleteBlogPostRecord,
  updateBlogPostRecord,
} from "@/features/cms/blog/services";

export async function createBlogPost(formData: FormData): Promise<void> {
  const payload = parseBlogPostFormData(formData);
  await createBlogPostRecord(payload);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(
  id: string,
  formData: FormData
): Promise<void> {
  const payload = parseBlogPostFormData(formData);
  await updateBlogPostRecord(id, payload);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string): Promise<void> {
  await deleteBlogPostRecord(id);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
