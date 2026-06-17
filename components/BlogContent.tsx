"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthorInfo {
  name: string;
  role: string;
  img_url?: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  img_url: string;
  alt_img: string;
  published_at: string;
  author?: AuthorInfo | null;
}

interface BlogContentProps {
  initialPosts: Post[];
}

const BlogContent = ({ initialPosts = [] }: BlogContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Baru-baru ini";
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredPosts = initialPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="bg-black px-6 lg:px-20 pt-10 pb-28 min-h-[50vh]">
      <div className="mx-auto max-w-[1280px]">
        {/* Search Bar */}
        <div className="mb-14 max-w-md mx-auto">
          <div className="relative">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berita atau artikel ratih..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-12 pr-10 py-3 text-sm text-white placeholder-white/30 focus:border-yellow-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                title="Bersihkan pencarian"
              >
                <i className="ri-close-line text-lg" />
              </button>
            )}
          </div>
        </div>

        {/* Blog Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl">
            <i className="ri-article-line text-5xl text-white/20 mb-4 block" />
            <p className="text-white/60 text-lg font-medium">Artikel tidak ditemukan</p>
            <p className="text-white/40 text-sm mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 px-5 py-2 rounded-full border border-white/10 hover:border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-500 text-xs font-semibold uppercase tracking-wider text-white/70 transition-all cursor-pointer"
              >
                Reset Pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 gap-y-14">
            {filteredPosts.map((p, i) => {
              // The newest post in the entire unfiltered list acts as the featured post
              const isFirst = i === 0 && !searchQuery;

              return isFirst ? (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group col-span-full grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-center pb-14 border-b border-white/10 cursor-pointer"
                >
                  <div className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 aspect-[3/2] relative">
                    <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-[1.02]">
                      <Image
                        src={p.img_url}
                        alt={p.alt_img || p.title}
                        fill
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="inline-flex items-center gap-3 text-[11px] font-bold italic uppercase tracking-[0.25em] text-yellow-500">
                      <span className="h-px w-7 bg-yellow-500/50" /> Featured Post · {formatDate(p.published_at)}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold italic uppercase leading-[1.05] transition-colors group-hover:text-yellow-500">
                      {p.title}
                    </h2>
                    <p className="text-[15px] leading-relaxed text-white/70 font-light">
                      {p.excerpt || p.body.substring(0, 160) + "..."}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      {p.author?.img_url ? (
                        <Image
                          src={p.author.img_url}
                          alt={p.author.name}
                          width={32}
                          height={32}
                          className="rounded-full border border-white/10"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold text-xs uppercase">
                          {p.author?.name.charAt(0) || "R"}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-white">{p.author?.name || "Ratih Admin"}</p>
                        <p className="text-[10px] text-white/45">{p.author?.role || "Team Ratih"}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col gap-4 cursor-pointer pb-6"
                >
                  <div className="overflow-hidden rounded-xl border border-white/5 bg-zinc-900 aspect-[3/2] relative">
                    <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-[1.02]">
                      <Image
                        src={p.img_url}
                        alt={p.alt_img || p.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">{formatDate(p.published_at)}</p>
                    <h2 className="text-xl font-bold italic uppercase leading-tight transition-colors group-hover:text-yellow-500">
                      {p.title}
                    </h2>
                    <p className="line-clamp-2 text-[13px] leading-relaxed text-white/60 font-light">
                      {p.excerpt || p.body.substring(0, 100) + "..."}
                    </p>
                    <div className="mt-3 flex items-center gap-2.5">
                      {p.author?.img_url ? (
                        <Image
                          src={p.author.img_url}
                          alt={p.author.name}
                          width={24}
                          height={24}
                          className="rounded-full border border-white/10"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold text-[10px] uppercase">
                          {p.author?.name.charAt(0) || "R"}
                        </div>
                      )}
                      <p className="text-[11px] font-medium text-white/70">
                        {p.author?.name || "Ratih Admin"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogContent;
