import type { TeamMemberInput } from "@/features/cms/crew/schemas";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

export async function createTeamMemberRecord(input: TeamMemberInput) {
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
  const supabase = await createAdminSupabaseClient("crew.manage");
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
