"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageUploader } from "@/features/admin/components/ImageUploader";

export interface ItemFormField {
  name: string;
  label: string;
  type?: "text" | "textarea";
  required?: boolean;
  rows?: number;
}

interface Props {
  action: (formData: FormData) => Promise<void>;
  fields: ItemFormField[];
  imageFolder: string;
  backHref: string;
  defaultValues?: Record<string, string | number>;
}

export function ItemForm({
  action,
  fields,
  imageFolder,
  backHref,
  defaultValues = {},
}: Props) {
  const [imagePath, setImagePath] = useState(
    String(defaultValues.image_path ?? "")
  );

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <input type="hidden" name="image_path" value={imagePath} />

      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm text-zinc-400 mb-1"
          >
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              defaultValue={String(defaultValues[field.name] ?? "")}
              required={field.required}
              rows={field.rows ?? 4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 resize-none"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              defaultValue={String(defaultValues[field.name] ?? "")}
              required={field.required}
              type={field.name === "display_order" ? "number" : "text"}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
            />
          )}
        </div>
      ))}

      <div>
        <label className="block text-sm text-zinc-400 mb-2" htmlFor="image">
          Gambar
        </label>
        <ImageUploader
          folder={imageFolder}
          currentPath={imagePath || undefined}
          onUploaded={setImagePath}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-white text-zinc-950 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
        >
          Simpan
        </button>
        <Link
          href={backHref}
          className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
