"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/context/auth-context";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";
import ConfirmModal from "@/components/ConfirmModal";
import AdminPagination from "@/components/AdminPagination";
import { AdminToastContainer, useAdminToast } from "@/components/AdminToast";

interface CrewItem {
  id: string;
  name: string;
  role: string;
  img_url: string;
  description: string;
  instagram_url?: string;
  facebook_url?: string;
  whatsapp_url?: string;
  x_url?: string;
  linkedin_url?: string;
  created_at: string;
}

const PAGE_SIZE = 8;

export default function CrewAdmin() {
  const { user } = useAuth();
  const { toasts, removeToast, toast } = useAdminToast();
  const [items, setItems] = useState<CrewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: "danger" | "warning";
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [description, setDescription] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = useCallback(async (page = currentPage) => {
    setLoading(true);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("crew")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: true })
        .range(from, to);
      if (error) throw error;

      const nextTotal = count || 0;
      if ((data || []).length === 0 && nextTotal > 0 && page > 1) {
        setCurrentPage(page - 1);
        return;
      }

      setTotalItems(nextTotal);
      setItems(data || []);
    } catch (err) {
      console.error("Error fetching crew:", err);
      toast.error("Gagal memuat data anggota tim.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems(currentPage);
    }, 0);
    return () => clearTimeout(timer);
  }, [currentPage, fetchItems]);

  const openAddForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setImgUrl("");
    setDescription("");
    setInstagramUrl("");
    setFacebookUrl("");
    setWhatsappUrl("");
    setXUrl("");
    setLinkedinUrl("");
    setFormOpen(true);
  };

  const openEditForm = (item: CrewItem) => {
    setEditingId(item.id);
    setName(item.name);
    setRole(item.role);
    setImgUrl(item.img_url);
    setDescription(item.description || "");
    setInstagramUrl(item.instagram_url || "");
    setFacebookUrl(item.facebook_url || "");
    setWhatsappUrl(item.whatsapp_url || "");
    setXUrl(item.x_url || "");
    setLinkedinUrl(item.linkedin_url || "");
    setFormOpen(true);
  };

  const requestAdminApi = async (method: "POST" | "PATCH" | "DELETE", data: unknown) => {
    if (!user) {
      throw new Error("Sesi admin tidak ditemukan. Silakan login ulang.");
    }
    const token = await user.getIdToken();
    const response = await fetch("/api/admin/db", {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      throw new Error(result?.error || "Request admin gagal.");
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !imgUrl) {
      toast.error("Nama, Peran, dan Foto wajib diisi!");
      return;
    }

    setSubmitting(true);
    const payload = {
      name,
      role,
      img_url: imgUrl,
      alt_img: name,
      description,
      instagram_url: instagramUrl || null,
      facebook_url: facebookUrl || null,
      whatsapp_url: whatsappUrl || null,
      x_url: xUrl || null,
      linkedin_url: linkedinUrl || null,
    };

    try {
      if (editingId) {
        await requestAdminApi("PATCH", { table: "crew", id: editingId, payload });
        toast.success(`Profil "${name}" berhasil diperbarui.`);
      } else {
        await requestAdminApi("POST", { table: "crew", payload });
        toast.success(`Anggota tim "${name}" berhasil ditambahkan.`);
      }

      setFormOpen(false);
      setCurrentPage(1);
      fetchItems(1);
    } catch (err: unknown) {
      console.error("Submit error:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast.error(errorMsg || "Gagal menyimpan anggota tim.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Anggota Tim",
      message: `Apakah Anda yakin ingin menghapus anggota tim "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await requestAdminApi("DELETE", { table: "crew", id });
          toast.success(`Anggota tim "${name}" berhasil dihapus.`);
          fetchItems(currentPage);
        } catch (err: unknown) {
          console.error("Delete error:", err);
          const errorMsg = err instanceof Error ? err.message : String(err);
          toast.error(errorMsg || "Gagal menghapus anggota tim.");
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest">Manajemen Konten</p>
          <h2 className="text-xl font-bold uppercase italic mt-1 text-white">Creative Team</h2>
        </div>
        {!formOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <i className="ri-user-add-line text-sm" />
            <span>Tambah Crew</span>
          </button>
        )}
      </div>

      {/* Form panel */}
      {formOpen ? (
        <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {editingId ? "Edit Profil Crew" : "Tambah Crew Baru"}
            </h3>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-white/70 hover:bg-white/[0.03] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-sm" />
              Kembali
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Afrizal Ahmad"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Peran (Role)
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Contoh: Graphic Designer"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Deskripsi / Bio Singkat
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan sedikit tentang tim kreatif ini..."
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors resize-none"
                />
              </div>

            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Tautan Sosial Media (Opsional)</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <i className="ri-instagram-line text-white/50 w-5" />
                    <input type="text" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="URL Instagram" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-facebook-fill text-white/50 w-5" />
                    <input type="text" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="URL Facebook" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-whatsapp-line text-white/50 w-5" />
                    <input type="text" value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} placeholder="URL WhatsApp" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-twitter-x-fill text-white/50 w-5" />
                    <input type="text" value={xUrl} onChange={(e) => setXUrl(e.target.value)} placeholder="URL X (Twitter)" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-linkedin-box-fill text-white/50 w-5" />
                    <input type="text" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="URL LinkedIn" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-between md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  value={imgUrl}
                  onChange={setImgUrl}
                  label="Foto Profil Crew"
                />

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                    Alt Text Foto
                  </label>
                  <div className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/50 cursor-not-allowed">
                    {name || "Sama dengan nama..."}
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">Dihasilkan otomatis dari nama lengkap.</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 justify-end md:self-end w-full">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/[0.03] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
      /* Table list */
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center font-mono">
            <svg className="animate-spin h-8 w-8 text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-white/40 text-xs animate-pulse">Memuat Anggota Tim...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-sm">
            Belum ada anggota tim di database. Klik tombol &quot;Tambah Crew&quot; di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45 pl-6">Foto</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45">Nama</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45">Role</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-4 pl-6 shrink-0">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        <Image
                          src={item.img_url}
                          alt={item.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-sm text-white group-hover:text-yellow-500 transition-colors">
                        {item.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-white/60">
                        {item.role}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(item)}
                          className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 hover:border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-500 text-white/60 flex items-center justify-center transition-all cursor-pointer"
                          title="Edit"
                        >
                          <i className="ri-pencil-line text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500 text-white/60 flex items-center justify-center transition-all cursor-pointer"
                          title="Hapus"
                        >
                          <i className="ri-delete-bin-line text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && items.length > 0 && (
          <AdminPagination
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
      />

      <AdminToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
