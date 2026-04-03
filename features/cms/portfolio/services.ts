import type { PortfolioItemInput } from "@/features/cms/portfolio/schemas";
import { isCmsTestMode } from "@/lib/cms-test-mode";
import { createAdminSupabaseClient } from "@/features/cms/shared/admin";
import {
  createMockRecord,
  deleteMockRecord,
  updateMockRecord,
} from "@/features/cms/shared/mock-store";

export async function createPortfolioItemRecord(input: PortfolioItemInput) {
  if (isCmsTestMode()) {
    const createdAt = new Date().toISOString();
    await createMockRecord("portfolioItems", {
      id: crypto.randomUUID(),
      ...input,
      created_at: createdAt,
      updated_at: createdAt,
    });
    return;
  }

  const supabase = await createAdminSupabaseClient("portfolio.manage");
  const { error } = await supabase.from("portfolio_items").insert(input);

  if (error) throw new Error(error.message);
}

export async function updatePortfolioItemRecord(
  id: string,
  input: PortfolioItemInput
) {
  if (isCmsTestMode()) {
    await updateMockRecord("portfolioItems", id, (item) => ({
      ...item,
      ...input,
      updated_at: new Date().toISOString(),
    }));
    return;
  }

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
  if (isCmsTestMode()) {
    await deleteMockRecord("portfolioItems", id);
    return;
  }

  const supabase = await createAdminSupabaseClient("portfolio.manage");
  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
