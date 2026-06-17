"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/context/auth-context";
import ImageUpload from "@/components/ImageUpload";
import ConfirmModal from "@/components/ConfirmModal";
import { AdminToastContainer, useAdminToast } from "@/components/AdminToast";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  img_url: string;
  alt_img: string;
  sort_order: number;
  created_at: string;
}

export default function ServicesAdmin() {
  const { user } = useAuth();
  const { toasts, removeToast, toast } = useAdminToast();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [altImg, setAltImg] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error("Gagal memuat data layanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 0);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImgUrl("");
    setAltImg("");
    setSortOrder(items.length > 0 ? items[items.length - 1].sort_order + 1 : 1);
    setFormOpen(true);
  };

  const openEditForm = (item: ServiceItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setImgUrl(item.img_url);
    setAltImg(item.alt_img || "");
    setSortOrder(item.sort_order);
    setFormOpen(true);
  };

  const requestAdminApi = async (method: "POST" | "PATCH" | "DELETE", data: unknown) => {
    if (!user) throw new Error("Sesi admin tidak ditemukan. Silakan login ulang.");
    const token = await user.getIdToken();
    const response = await fetch("/api/admin/db", {
      method,
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) throw new Error(result?.error || "Request admin gagal.");
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imgUrl) {
      toast.error("Judul, Deskripsi, dan Gambar Layanan wajib diisi!");
      return;
    }

    setSubmitting(true);
    const payload = {
      title,
      description,
      img_url: imgUrl,
      alt_img: altImg || `Layanan ${title}`,
      sort_order: Number(sortOrder),
    };

    try {
      if (editingId) {
        await requestAdminApi("PATCH", { table: "services", id: editingId, payload });
        toast.success(`Layanan "${title}" berhasil diperbarui.`);
      } else {
        await requestAdminApi("POST", { table: "services", payload });
        toast.success(`Layanan "${title}" berhasil ditambahkan.`);
      }

      setFormOpen(false);
      fetchItems();
    } catch (err: unknown) {
      console.error("Submit error:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast.error(errorMsg || "Gagal menyimpan layanan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string, itemTitle: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Layanan",
      message: `Apakah Anda yakin ingin menghapus layanan "${itemTitle}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await requestAdminApi("DELETE", { table: "services", id });
          toast.success(`Layanan "${itemTitle}" berhasil dihapus.`);
          fetchItems();
        } catch (err: unknown) {
          console.error("Delete error:", err);
          const errorMsg = err instanceof Error ? err.message : String(err);
          toast.error(errorMsg || "Gagal menghapus layanan.");
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest">Manajemen Konten</p>
          <h2 className="text-xl font-bold uppercase italic mt-1 text-white">Layanan &amp; Jasa</h2>
        </div>
        {!formOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <i className="ri-add-line text-sm" />
            <span>Tambah Layanan</span>
          </button>
        )}
      </div>

      {/* Form panel */}
      {formOpen ? (
        <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {editingId ? "Edit Layanan" : "Tambah Layanan Baru"}
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
                  Nama Layanan / Jasa
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Fotografi"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Nomor Urut (Sort Order)
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  placeholder="Contoh: 1"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Deskripsi Layanan
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan secara detail tentang layanan jasa ini..."
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <ImageUpload
                  value={imgUrl}
                  onChange={setImgUrl}
                  label="Gambar Layanan"
                />

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                    Alt Text Gambar
                  </label>
                  <input
                    type="text"
                    value={altImg}
                    onChange={(e) => setAltImg(e.target.value)}
                    placeholder="Contoh: Layanan Fotografi"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors"
                  />
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
              <span className="text-white/40 text-xs animate-pulse">Memuat Layanan...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-sm">
              Belum ada data layanan di database. Klik tombol &quot;Tambah Layanan&quot; di atas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45 pl-6">Layanan</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45">Deskripsi</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45 text-center">Urutan</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45 text-right pr-6">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="p-4 pl-6">
                        <span className="font-semibold text-sm text-white group-hover:text-yellow-500 transition-colors block">
                          {item.title}
                        </span>
                      </td>
                      <td className="p-4 max-w-[450px]">
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono text-sm text-white/60">
                          {item.sort_order}
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
                            onClick={() => handleDelete(item.id, item.title)}
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
