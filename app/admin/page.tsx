"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/context/auth-context";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    portfolioCount: 0,
    crewCount: 0,
    servicesCount: 0,
    messagesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const token = await user.getIdToken();
        const [portfolioRes, crewRes, servicesRes, messagesRes] = await Promise.all([
          supabase.from("portfolio").select("id", { count: "exact", head: true }),
          supabase.from("crew").select("id", { count: "exact", head: true }),
          supabase.from("services").select("id", { count: "exact", head: true }),
          fetch("/api/admin/messages", {
            headers: { Authorization: `Bearer ${token}` },
          }).then((response) => response.json() as Promise<{ count?: number }>),
        ]);

        setStats({
          portfolioCount: portfolioRes.count || 0,
          crewCount: crewRes.count || 0,
          servicesCount: servicesRes.count || 0,
          messagesCount: messagesRes.count || 0,
        });
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const cards = [
    {
      title: "Portfolio Items",
      count: stats.portfolioCount,
      icon: "ri-gallery-line",
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-400",
      description: "Galeri karya/proyek kreatif",
    },
    {
      title: "Creative Crew",
      count: stats.crewCount,
      icon: "ri-group-line",
      color: "from-green-500/10 to-green-500/5",
      iconColor: "text-green-400",
      description: "Tim kreatif dibalik layar",
    },
    {
      title: "Services Offered",
      count: stats.servicesCount,
      icon: "ri-customer-service-2-line",
      color: "from-yellow-500/10 to-yellow-500/5",
      iconColor: "text-yellow-400",
      description: "Layanan jasa yang disediakan",
    },
    {
      title: "Inbox Messages",
      count: stats.messagesCount,
      icon: "ri-mail-line",
      color: "from-red-500/10 to-red-500/5",
      iconColor: "text-red-400",
      description: "Pesan kontak dari pengunjung",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-xl md:text-2xl font-bold italic uppercase tracking-wide">
          Halo, {user?.displayName || "Admin Ratih"}! 👋
        </h2>
        <p className="text-sm text-white/55 mt-2 max-w-xl leading-relaxed">
          Selamat datang di Control Panel Ratih Creative Studio. Melalui dashboard ini, Anda dapat memperbarui portofolio, mengedit tim, merubah layanan, dan memantau pesan masuk secara langsung.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.color} border border-white/5 p-6 rounded-2xl flex flex-col relative group hover:border-white/10 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-white/45 font-semibold">
                {card.title}
              </span>
              <div className={`w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center ${card.iconColor}`}>
                <i className={`${card.icon} text-lg`} />
              </div>
            </div>
            
            {loading ? (
              <div className="h-9 w-16 bg-white/5 rounded animate-pulse mb-2" />
            ) : (
              <span className="text-3xl font-bold font-mono tracking-tight text-white mb-1">
                {card.count}
              </span>
            )}
            
            <span className="text-[11px] text-white/40">
              {card.description}
            </span>
          </div>
        ))}
      </div>

      {/* Quick shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Pintasan Cepat</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/portfolio" className="bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all">
              <i className="ri-add-circle-line text-2xl text-yellow-500 mb-1" />
              <span className="text-xs font-semibold text-white/80">Tambah Portofolio</span>
            </a>
            <a href="/admin/crew" className="bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all">
              <i className="ri-user-add-line text-2xl text-yellow-500 mb-1" />
              <span className="text-xs font-semibold text-white/80">Kelola Tim</span>
            </a>
            <a href="/admin/messages" className="bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all">
              <i className="ri-mail-open-line text-2xl text-yellow-500 mb-1" />
              <span className="text-xs font-semibold text-white/80">Review Pesan</span>
            </a>
          </div>
        </div>

        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">Keamanan Kontrol</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Semua operasi tulis (Create, Update, Delete) diamankan dengan Row Level Security di Supabase dan memerlukan autentikasi Google Admin yang sah.
            </p>
          </div>
          <div className="text-[11px] text-yellow-500/70 bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl flex items-center gap-2 mt-4">
            <i className="ri-shield-check-line text-sm shrink-0" />
            <span>Database RLS & Firebase Auth Aktif dan Terlindungi.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
