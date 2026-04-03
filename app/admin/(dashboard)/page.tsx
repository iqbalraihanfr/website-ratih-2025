import { createServerClient } from "@/lib/supabase-server";
import { requirePermission } from "@/features/auth/server";

const statCards = [
  { label: "Blog Posts", table: "blog_posts", icon: "ri-article-line" },
  { label: "Portfolio", table: "portfolio_items", icon: "ri-image-line" },
  { label: "Tim", table: "team_members", icon: "ri-group-line" },
  { label: "Layanan", table: "services", icon: "ri-briefcase-line" },
] as const;

export default async function AdminDashboard() {
  await requirePermission("dashboard.view");
  const supabase = createServerClient();

  const counts = await Promise.all(
    statCards.map(async ({ table }) => {
      const { count } = await supabase
        .from(table)
        .select("id", { count: "exact", head: true });
      return count ?? 0;
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {statCards.map(({ label, icon }, i) => (
          <div
            key={label}
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <i className={`${icon} text-2xl text-zinc-400`} />
              <span className="text-zinc-400 text-sm">{label}</span>
            </div>
            <p className="text-4xl font-bold text-white">{counts[i]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
