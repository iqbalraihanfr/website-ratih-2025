import type { TeamMemberInput } from "@/features/cms/crew/schemas";
import { isCmsTestMode } from "@/lib/cms-test-mode";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";
import {
  createMockRecord,
  deleteMockRecord,
  updateMockRecord,
} from "@/features/cms/shared/mock-store";

export async function createTeamMemberRecord(input: TeamMemberInput) {
  if (isCmsTestMode()) {
    const createdAt = new Date().toISOString();
    await createMockRecord("teamMembers", {
      id: crypto.randomUUID(),
      ...input,
      social_links: [],
      created_at: createdAt,
      updated_at: createdAt,
    });
    return;
  }

  const supabase = await createAdminSupabaseClient("crew.manage");
  const { error } = await supabase.from("team_members").insert({
    ...input,
    social_links: [],
  });

  if (error) throw new Error(error.message);
}

export async function updateTeamMemberRecord(
  id: string,
  input: TeamMemberInput
) {
  if (isCmsTestMode()) {
    await updateMockRecord("teamMembers", id, (member) => ({
      ...member,
      ...input,
      updated_at: new Date().toISOString(),
    }));
    return;
  }

  const supabase = await createAdminSupabaseClient("crew.manage");
  const { error } = await supabase
    .from("team_members")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteTeamMemberRecord(id: string) {
  if (isCmsTestMode()) {
    await deleteMockRecord("teamMembers", id);
    return;
  }

  const supabase = await createAdminSupabaseClient("crew.manage");
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
