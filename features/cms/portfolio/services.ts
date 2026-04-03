import type { PortfolioItemInput } from "@/features/cms/portfolio/schemas";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";

export async function createPortfolioItemRecord(input: PortfolioItemInput) {
  const supabase = await createAdminSupabaseClient("portfolio.manage");
  const { error } = await supabase.from("portfolio_items").insert(input);

  if (error) throw new Error(error.message);
}

export async function updatePortfolioItemRecord(
  id: string,
  input: PortfolioItemInput
) {
  const supabase = await createAdminSupabaseClient("portfolio.manage");
  const { error } = await supabase
    .from("portfolio_items")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deletePortfolioItemRecord(id: string) {
  const supabase = await createAdminSupabaseClient("portfolio.manage");
  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
