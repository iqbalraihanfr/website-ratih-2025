"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseServiceFormData } from "@/features/cms/services/schemas";
import {
  createServiceRecord,
  deleteServiceRecord,
  updateServiceRecord,
} from "@/features/cms/services/services";

export async function createService(formData: FormData): Promise<void> {
  const payload = parseServiceFormData(formData);
  await createServiceRecord(payload);

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateService(
  id: string,
  formData: FormData
): Promise<void> {
  const payload = parseServiceFormData(formData);
  await updateServiceRecord(id, payload);

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteService(id: string): Promise<void> {
  await deleteServiceRecord(id);

  revalidatePath("/admin/services");
  revalidatePath("/");
}
