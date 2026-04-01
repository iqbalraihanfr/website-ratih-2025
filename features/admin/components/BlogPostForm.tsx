"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageUploader } from "@/features/admin/components/ImageUploader";
import type { BlogPost } from "@/lib/types/database";

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: BlogPost;
}

export function BlogPostForm({ action, defaultValues }: Props) {
  const [coverImagePath, setCoverImagePath] = useState(
    defaultValues?.cover_image_path ?? ""
  );

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <input type="hidden" name="cover_image_path" value={coverImagePath} />

      <div>
        <label htmlFor="title" className="block text-sm text-zinc-400 mb-1">
          Judul
        </label>
        <input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm text-zinc-400 mb-1">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={defaultValues?.excerpt}
          rows={2}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 resize-none"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm text-zinc-400 mb-1">
          Konten
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={defaultValues?.content}
          rows={10}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 resize-y"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm text-zinc-400 mb-1">
          Author
        </label>
        <input
          id="author"
          name="author"
          defaultValue={defaultValues?.author}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-2" htmlFor="image">
          Cover Image
        </label>
        <ImageUploader
          folder="blog"
          currentPath={coverImagePath || undefined}
          onUploaded={setCoverImagePath}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_published"
          value="true"
          id="is_published"
          defaultChecked={defaultValues?.is_published}
          className="w-4 h-4 accent-white"
        />
        <label htmlFor="is_published" className="text-sm text-zinc-400">
          Publish sekarang
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-white text-zinc-950 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
        >
          Simpan
        </button>
        <Link
          href="/admin/blog"
          className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
