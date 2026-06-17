"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import ConfirmModal from "@/components/ConfirmModal";
import { AdminToastContainer, useAdminToast } from "@/components/AdminToast";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function MessagesAdmin() {
  const { user } = useAuth();
  const { toasts, removeToast, toast } = useAdminToast();
  const [items, setItems] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
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

  const fetchItems = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = (await response.json().catch(() => null)) as {
        messages?: MessageItem[];
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.error || "Gagal memuat pesan masuk.");
      }

      setItems(result?.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast.error("Gagal memuat pesan masuk.");
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchItems]);

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

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Pesan",
      message: `Apakah Anda yakin ingin menghapus pesan dari "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await requestAdminApi("DELETE", { table: "contact_messages", id });
          toast.success(`Pesan dari "${name}" berhasil dihapus.`);
          
          if (selectedMessage?.id === id) {
            setSelectedMessage(null);
          }
          
          fetchItems();
        } catch (err: unknown) {
          console.error("Delete error:", err);
          const errorMsg = err instanceof Error ? err.message : String(err);
          toast.error(errorMsg || "Gagal menghapus pesan.");
        }
      },
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-white/50 uppercase tracking-widest">Kotak Masuk</p>
        <h2 className="text-xl font-bold uppercase italic mt-1 text-white">Pesan Kontak</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Messages List */}
        <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center font-mono">
              <svg className="animate-spin h-8 w-8 text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-white/40 text-xs animate-pulse">Memuat Pesan...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-sm">
              Belum ada pesan masuk di database.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMessage(item)}
                  className={`p-5 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.02] ${
                    selectedMessage?.id === item.id ? "bg-white/[0.03] border-l-2 border-yellow-500" : ""
                  }`}
                >
                  <div className="space-y-1.5 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{item.name}</span>
                      <span className="text-[10px] text-white/35 font-mono">{formatDate(item.created_at)}</span>
                    </div>
                    <p className="text-xs text-white/50 truncate max-w-[350px] md:max-w-[450px]">
                      {item.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <span className="text-[11px] text-white/45 font-mono bg-white/5 px-2.5 py-1 rounded-lg">
                      {item.email}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id, item.name);
                      }}
                      className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500 text-white/60 flex items-center justify-center transition-all cursor-pointer"
                      title="Hapus"
                    >
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Details Sidebar */}
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl min-h-[350px]">
          {selectedMessage ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-white/45 font-semibold mb-1">Pengirim</h3>
                <p className="text-base font-bold text-white leading-tight">{selectedMessage.name}</p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-xs text-yellow-500 hover:underline inline-block mt-1 font-mono"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest text-white/45 font-semibold mb-1">Waktu Masuk</h3>
                <p className="text-xs text-white/70 font-mono">{formatDate(selectedMessage.created_at)}</p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h3 className="text-xs uppercase tracking-widest text-white/45 font-semibold mb-2">Isi Pesan</h3>
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-white/80 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Balasan Ratih Creative Studio&body=Halo ${selectedMessage.name},%0D%0A%0D%0A`}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <i className="ri-reply-line text-sm" />
                  <span>Balas Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-white/35 font-mono text-xs">
              <i className="ri-mail-open-line text-3xl mb-3 text-white/20 animate-bounce" />
              <span>Pilih pesan di sebelah kiri untuk melihat detail isi pesan kontak.</span>
            </div>
          )}
        </div>
      </div>

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
