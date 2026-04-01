import type { TeamMember } from "@/lib/types/database";
import { createPublicServerClient } from "@/lib/supabase-public-server";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

export async function listTeamMembers() {
  const supabase = createPublicServerClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as TeamMember[]) ?? [];
}

export async function listAdminTeamMembers() {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as TeamMember[]) ?? [];
}

export async function getAdminTeamMember(id: string) {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  return (data as TeamMember | null) ?? null;
}
