"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import ImageUpload from "@/components/ImageUpload";
import ConfirmModal from "@/components/ConfirmModal";
import RichTextEditor from "@/components/RichTextEditor";
import { useAuth } from "@/lib/context/auth-context";
import AdminPagination from "@/components/AdminPagination";
import AdminDateTimePicker from "@/components/AdminDateTimePicker";
import { AdminToastContainer, useAdminToast } from "@/components/AdminToast";

interface CrewMember {
  id: string;
  name: string;
  role: string;
}

interface PostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  img_url: string;
  alt_img: string;
  author_id: string;
  published_at: string;
  created_at: string;
  author?: {
    name: string;
    role: string;
  } | null;
}

const PAGE_SIZE = 8;

export default function PostsAdmin() {
  const { user } = useAuth();
  const { toasts, removeToast, toast } = useAdminToast();
  const [items, setItems] = useState<PostItem[]>([]);
  const [crewList, setCrewList] = useState<CrewMember[]>([]);
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
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Helper to convert date to datetime-local input value format (YYYY-MM-DDTHH:MM)
  const toLocalDatetimeInputString = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Helper to slugify text
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except spaces and hyphens
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-") // collapse multiple hyphens
      .replace(/^-+|-+$/g, ""); // trim hyphens from start/end
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  const requestAdminPostsApi = async (method: "POST" | "PATCH" | "DELETE", data: unknown) => {
    if (!user) {
      throw new Error("Sesi admin tidak ditemukan. Silakan login ulang.");
    }

    const token = await user.getIdToken();
    const response = await fetch("/api/admin/posts", {
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

  const fetchData = useCallback(async (page = currentPage) => {
    setLoading(true);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Fetch crew for selection dropdown
      const { data: crewData, error: crewError } = await supabase
        .from("crew")
        .select("id, name, role")
        .order("name", { ascending: true });
      if (crewError) throw crewError;
      setCrewList(crewData || []);

      // Fetch posts with author info
      const { data: postsData, error: postsError, count } = await supabase
        .from("posts")
        .select("*, author:crew(name, role)", { count: "exact" })
        .order("published_at", { ascending: false })
        .range(from, to);
      if (postsError) throw postsError;

      const nextTotal = count || 0;
      if ((postsData || []).length === 0 && nextTotal > 0 && page > 1) {
        setCurrentPage(page - 1);
        return;
      }

      setTotalItems(nextTotal);
      setItems(postsData || []);
    } catch (err) {
      console.error("Error fetching admin blog posts data:", err);
      toast.error("Gagal memuat data artikel blog.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(currentPage);
    }, 0);
    return () => clearTimeout(timer);
  }, [currentPage, fetchData]);

  const openAddForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setBody("");
    setImgUrl("");
    setAuthorId(crewList.length > 0 ? crewList[0].id : "");
    setPublishedAt(toLocalDatetimeInputString(new Date().toISOString()));
    setFormOpen(true);
  };

  const openEditForm = (item: PostItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setExcerpt(item.excerpt || "");
    setBody(item.body || "");
    setImgUrl(item.img_url || "");
    setAuthorId(item.author_id || (crewList.length > 0 ? crewList[0].id : ""));
    setPublishedAt(toLocalDatetimeInputString(item.published_at));
    setFormOpen(true);

    // Scroll back to the top of the layout pane
    const scrollContainer = document.querySelector(".overflow-y-auto") || window;
    scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isBodyEmpty = !body || body === "<p><br></p>";
    if (!title || !slug || isBodyEmpty) {
      toast.error("Judul, Slug, dan Konten Artikel wajib diisi!");
      return;
    }

    setSubmitting(true);
    
    // Parse datetime input to ISO timestamp string
    const publishedAtIso = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();

    const payload = {
      title,
      slug: slugify(slug), // ensure slug is clean
      excerpt,
      body,
      img_url: imgUrl || "/images/bg/bg-2.png", // fallback image
      alt_img: title,
      author_id: authorId || null,
      published_at: publishedAtIso,
    };

    try {
      if (editingId) {
        await requestAdminPostsApi("PATCH", { id: editingId, payload });
        toast.success(`Artikel "${title}" berhasil diperbarui.`);
      } else {
        await requestAdminPostsApi("POST", payload);
        toast.success(`Artikel "${title}" berhasil diterbitkan.`);
      }

      setFormOpen(false);
      setCurrentPage(1);
      fetchData(1);
    } catch (err: unknown) {
      console.error("Submit post error:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast.error(errorMsg || "Gagal menyimpan postingan blog.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Artikel",
      message: `Apakah Anda yakin ingin menghapus artikel "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await requestAdminPostsApi("DELETE", { id });
          toast.success(`Artikel "${title}" berhasil dihapus.`);
          fetchData(currentPage);
        } catch (err: unknown) {
          console.error("Delete post error:", err);
          const errorMsg = err instanceof Error ? err.message : String(err);
          toast.error(errorMsg || "Gagal menghapus postingan blog.");
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/55 uppercase tracking-widest">Manajemen Konten</p>
          <h2 className="text-xl font-bold uppercase italic mt-1 text-white">Artikel Blog</h2>
        </div>
        {!formOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <i className="ri-add-line text-sm" />
            <span>Tulis Artikel</span>
          </button>
        )}
      </div>

      {/* Form panel */}
      {formOpen ? (
        <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {editingId ? "Edit Artikel" : "Tulis Artikel Baru"}
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Behind The Lens — Festival Dongkrek"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Slug (URL unik)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="contoh: behind-the-lens-festival-dongkrek"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                    Penulis (Crew)
                  </label>
                  <select
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="w-full h-[46px] bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-yellow-500 outline-none transition-colors"
                  >
                    <option value="">Pilih Penulis...</option>
                    {crewList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                    Tanggal Publikasi
                  </label>
                  <AdminDateTimePicker
                    value={publishedAt}
                    onChange={setPublishedAt}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Berikan ringkasan artikel dalam 1-2 kalimat..."
                  rows={3}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-yellow-500 outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div>
              <ImageUpload
                value={imgUrl}
                onChange={setImgUrl}
                label="Gambar Utama Artikel"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                Isi Konten Artikel
              </label>
              <RichTextEditor
                value={body}
                onChange={setBody}
                placeholder="Tulis artikel lengkap di sini..."
              />
            </div>

            <div className="flex gap-3 pt-6 justify-end w-full border-t border-white/5">
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
          </form>
        </div>
      ) : (
      /* List */
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center font-mono">
            <svg className="animate-spin h-8 w-8 text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-white/40 text-xs animate-pulse">Memuat Artikel...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-sm">
            Belum ada postingan artikel blog di database. Klik tombol &quot;Tulis Artikel&quot; di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45 pl-6">Artikel</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45">Penulis</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-white/45">Tanggal Terbit</th>
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
                      <span className="text-[10px] font-mono text-white/40 block mt-0.5">
                        /{item.slug}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-white/70 block">
                        {item.author?.name || "Tanpa Penulis"}
                      </span>
                      <span className="text-[10px] text-white/40 block">
                        {item.author?.role || ""}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-white/60">
                        {new Date(item.published_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
