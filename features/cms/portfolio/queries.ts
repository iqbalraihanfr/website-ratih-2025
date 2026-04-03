import type { PortfolioItem } from "@/lib/types/database";
import { isCmsTestMode } from "@/lib/cms-test-mode";
import { createPublicServerClient } from "@/lib/supabase-public-server";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";
import {
  getMockRecordById,
  listMockRecords,
} from "@/features/cms/shared/mock-store";

export async function listPortfolioItems() {
  if (isCmsTestMode()) {
    const items = await listMockRecords("portfolioItems");
    return items.sort((a, b) => a.display_order - b.display_order);
  }

  const supabase = createPublicServerClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as PortfolioItem[]) ?? [];
}

export async function listAdminPortfolioItems() {
  if (isCmsTestMode()) {
    const items = await listMockRecords("portfolioItems");
    return items.sort((a, b) => a.display_order - b.display_order);
  }

  const supabase = await createAdminSupabaseClient("portfolio.manage");
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as PortfolioItem[]) ?? [];
}

export async function getAdminPortfolioItem(id: string) {
  if (isCmsTestMode()) {
    return getMockRecordById("portfolioItems", id);
  }

  const supabase = await createAdminSupabaseClient("portfolio.manage");
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("id", id)
    .single();

  return (data as PortfolioItem | null) ?? null;
}
