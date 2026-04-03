import type { PortfolioItem } from "@/lib/types/database";
import { createPublicServerClient } from "@/lib/supabase-public-server";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

export async function listPortfolioItems() {
  const supabase = createPublicServerClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as PortfolioItem[]) ?? [];
}

export async function listAdminPortfolioItems() {
  const supabase = await createAdminSupabaseClient("portfolio.manage");
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as PortfolioItem[]) ?? [];
}

export async function getAdminPortfolioItem(id: string) {
  const supabase = await createAdminSupabaseClient("portfolio.manage");
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("id", id)
    .single();

  return (data as PortfolioItem | null) ?? null;
}
