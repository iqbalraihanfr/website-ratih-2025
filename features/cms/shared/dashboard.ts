import { createServerClient } from "@/lib/supabase-server";
import { isCmsTestMode } from "@/lib/cms-test-mode";
import { countMockRecords } from "@/features/cms/shared/mock-store";

export const adminDashboardCards = [
  { label: "Blog Posts", key: "blogPosts", table: "blog_posts", icon: "ri-article-line" },
  { label: "Portfolio", key: "portfolioItems", table: "portfolio_items", icon: "ri-image-line" },
  { label: "Tim", key: "teamMembers", table: "team_members", icon: "ri-group-line" },
  { label: "Layanan", key: "services", table: "services", icon: "ri-briefcase-line" },
] as const;

export async function getAdminDashboardCounts() {
  if (isCmsTestMode()) {
    return Promise.all(
      adminDashboardCards.map(({ key }) => countMockRecords(key))
    );
  }

  const supabase = createServerClient();

  return Promise.all(
    adminDashboardCards.map(async ({ table }) => {
      const { count } = await supabase
        .from(table)
        .select("id", { count: "exact", head: true });
      return count ?? 0;
    })
  );
}
