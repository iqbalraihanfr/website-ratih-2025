"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseTeamMemberFormData } from "@/features/cms/crew/schemas";
import {
  createTeamMemberRecord,
  deleteTeamMemberRecord,
  updateTeamMemberRecord,
} from "@/features/cms/crew/services";

export async function createTeamMember(formData: FormData): Promise<void> {
  const payload = parseTeamMemberFormData(formData);
  await createTeamMemberRecord(payload);

  revalidatePath("/admin/crew");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/crew");
}

export async function updateTeamMember(
  id: string,
  formData: FormData
): Promise<void> {
  const payload = parseTeamMemberFormData(formData);
  await updateTeamMemberRecord(id, payload);

  revalidatePath("/admin/crew");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/crew");
}

export async function deleteTeamMember(id: string): Promise<void> {
  await deleteTeamMemberRecord(id);

  revalidatePath("/admin/crew");
  revalidatePath("/");
  revalidatePath("/about");
}
