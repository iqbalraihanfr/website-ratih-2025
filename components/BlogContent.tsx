import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase-server";
import { storageUrl } from "@/lib/storage";
import type { BlogPost } from "@/lib/types/database";

const BlogContent = async () => {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const posts = (data as BlogPost[]) ?? [];

  if (!posts.length) {
    return (
      <section className="mx-auto flex min-h-[40vh] max-w-3xl flex-col items-center justify-center gap-5 px-6 py-16 text-center">
        <h2 className="text-2xl font-bold italic uppercase md:text-4xl">
          Blog Sedang Disiapkan
        </h2>
        <p className="text-sm text-zinc-300 md:text-base">
          Kami sedang menyiapkan ruang untuk cerita project, insight visual, dan
          update terbaru dari Ratih Creative. Sementara itu, kamu bisa lihat karya
          kami atau langsung hubungi tim kami.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/portfolio"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Lihat Portofolio
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:border-yellow-500 hover:text-yellow-500"
          >
            Hubungi Kami
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 py-10 lg:px-20">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            {post.cover_image_path && (
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={storageUrl(post.cover_image_path)}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 p-5">
              <h2 className="text-lg font-bold italic uppercase hover:text-yellow-500 transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-zinc-400 line-clamp-3">{post.excerpt}</p>
              )}
              <p className="text-xs text-zinc-500 mt-1">{post.author}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BlogContent;
