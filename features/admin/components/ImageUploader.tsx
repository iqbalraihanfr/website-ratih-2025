"use client";

import { useRef, useState } from "react";
import { uploadCmsImage } from "@/features/cms/shared/upload";
import { storageUrl } from "@/lib/storage";

interface Props {
  folder: string;
  onUploaded: (path: string) => void;
  currentPath?: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export function ImageUploader({ folder, onUploaded, currentPath }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUrl = currentPath ? storageUrl(currentPath) : null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError("Format gambar harus JPG, PNG, WEBP, atau AVIF.");
      setSuccessMessage(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Ukuran gambar maksimal 5MB.");
      setSuccessMessage(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setError(null);
    setSuccessMessage(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    const result = await uploadCmsImage(formData);

    setUploading(false);

    if ("error" in result) {
      setError(result.error ?? "Upload gambar gagal.");
      setSuccessMessage(null);
    } else {
      setPreview(null);
      setSuccessMessage("Gambar berhasil diupload dan dioptimalkan.");
      if (inputRef.current) inputRef.current.value = "";
      onUploaded(result.path);
    }
  }

  const displayImage = preview ?? currentUrl;

  return (
    <div className="space-y-3">
      {displayImage && (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-500 transition-colors bg-zinc-800/50">
        <i className="ri-upload-cloud-2-line text-2xl text-zinc-400 mb-1" />
        <span className="text-zinc-400 text-sm">Klik untuk pilih gambar</span>
        <input
          id="image"
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          aria-label="Pilih gambar untuk upload"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {successMessage && (
        <p className="text-emerald-400 text-sm">{successMessage}</p>
      )}
      <p className="text-xs text-zinc-500">
        Format yang didukung: JPG, PNG, WEBP, AVIF. Maksimal 5MB. Gambar akan
        dioptimalkan otomatis ke WEBP agar tetap tajam dengan ukuran yang lebih
        hemat.
      </p>

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || !preview}
        className="px-4 py-2 bg-white text-zinc-950 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 transition-colors"
      >
        {uploading ? "Uploading..." : "Upload Gambar"}
      </button>
    </div>
  );
}
