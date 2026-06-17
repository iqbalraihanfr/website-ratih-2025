"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  maxSizeMB?: number;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  maxSizeMB = 2,
  label = "Foto / Gambar",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setError(null);

    // Client-side file size check
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Ukuran file terlalu besar! Maksimal ${maxSizeMB}MB. Silakan kompres gambar terlebih dahulu.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah foto.");
      }

      onChange(data.url);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Gagal mengunggah foto. Silakan coba lagi.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerSelect = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50">
        {label}
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={uploading}
      />

      {value ? (
        // Preview State
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-xl">
          <div className="relative size-16 rounded-lg overflow-hidden border border-white/10 bg-zinc-900 shrink-0">
            <Image
              src={value}
              alt="Pratinjau Unggahan"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs text-white/40 truncate font-mono">
              {value}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={triggerSelect}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-yellow-500 hover:text-yellow-400 transition-colors cursor-pointer"
              >
                <i className="ri-edit-box-line text-sm" />
                <span>Ubah Foto</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                <i className="ri-delete-bin-line text-sm" />
                <span>Hapus Foto</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Upload Action Area
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerSelect}
          className={`group border border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
            uploading
              ? "bg-white/[0.01] border-white/15 cursor-not-allowed"
              : "bg-black/40 border-white/20 hover:border-yellow-500/40 hover:bg-white/[0.02]"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="animate-spin h-7 w-7 text-yellow-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs text-white/50 uppercase tracking-widest font-mono animate-pulse">
                Mengunggah...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <i className="ri-upload-cloud-2-line text-2xl text-white/30 group-hover:text-yellow-500 transition-colors mb-2" />
              <p className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                Klik untuk unggah foto atau seret kemari
              </p>
              <p className="text-[10px] text-white/35 mt-1">
                PNG, JPG, WEBP, atau SVG. Maksimal {maxSizeMB}MB.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-xs flex items-start gap-1.5 bg-red-500/5 border border-red-500/10 p-2.5 rounded-lg">
          <i className="ri-error-warning-line text-sm shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
