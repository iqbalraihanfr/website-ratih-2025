import { requirePermission } from "@/features/auth/server";
import {
  adminDashboardCards,
  getAdminDashboardCounts,
} from "@/features/cms/shared/dashboard";

export default async function AdminDashboard() {
  await requirePermission("dashboard.view");
  const counts = await getAdminDashboardCounts();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {adminDashboardCards.map(({ label, icon }, i) => (
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
