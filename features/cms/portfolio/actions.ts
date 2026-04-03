"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parsePortfolioItemFormData } from "@/features/cms/portfolio/schemas";
import {
  createPortfolioItemRecord,
  deletePortfolioItemRecord,
  updatePortfolioItemRecord,
} from "@/features/cms/portfolio/services";

export async function createPortfolioItem(formData: FormData): Promise<void> {
  const payload = parsePortfolioItemFormData(formData);
  await createPortfolioItemRecord(payload);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function updatePortfolioItem(
  id: string,
  formData: FormData
): Promise<void> {
  const payload = parsePortfolioItemFormData(formData);
  await updatePortfolioItemRecord(id, payload);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function deletePortfolioItem(id: string): Promise<void> {
  await deletePortfolioItemRecord(id);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}
