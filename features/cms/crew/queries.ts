import type { TeamMember } from "@/lib/types/database";
import { isCmsTestMode } from "@/lib/cms-test-mode";
import { createPublicServerClient } from "@/lib/supabase-public-server";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";
import {
  getMockRecordById,
  listMockRecords,
} from "@/features/cms/shared/mock-store";

export async function listTeamMembers() {
  if (isCmsTestMode()) {
    const members = await listMockRecords("teamMembers");
    return members.sort((a, b) => a.display_order - b.display_order);
  }

  const supabase = createPublicServerClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as TeamMember[]) ?? [];
}

export async function listAdminTeamMembers() {
  if (isCmsTestMode()) {
    const members = await listMockRecords("teamMembers");
    return members.sort((a, b) => a.display_order - b.display_order);
  }

  const supabase = await createAdminSupabaseClient("crew.manage");
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as TeamMember[]) ?? [];
}

export async function getAdminTeamMember(id: string) {
  if (isCmsTestMode()) {
    return getMockRecordById("teamMembers", id);
  }

  const supabase = await createAdminSupabaseClient("crew.manage");
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  return (data as TeamMember | null) ?? null;
}
