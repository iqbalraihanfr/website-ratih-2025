import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ShareButtons from "@/components/ShareButtons";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0;

// Fetch a single post by slug
async function getPost(slug: string) {
  const supabase = createServerSupabase();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*, author:crew(name, role, img_url)")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    return null;
  }
  return post;
}

// Generate dynamic SEO metadata for social sharing previews (WhatsApp, Facebook, X, etc.)
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Artikel Tidak Ditemukan | Ratih Creative Media",
    };
  }

  const title = `${post.title} | Ratih Creative Media`;
  const description = post.excerpt || "Baca artikel lengkap dari tim kreatif Ratih Creative Media.";
  const imageUrl = post.img_url ? post.img_url : "/images/bg/bg-2.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if body content contains HTML tags (e.g. from the rich text editor)
  const isHtml = post.body && (
    post.body.includes("<p>") || 
    post.body.includes("<h1>") || 
    post.body.includes("<h2>") || 
    post.body.includes("<ul>") || 
    post.body.includes("<strong>") || 
    post.body.includes("<blockquote>")
  );

  // Split content by newline to render as paragraph elements (fallback for plain text articles)
  const paragraphs: string[] = (!isHtml && post.body) ? post.body.split(/\n+/) : [];

  return (
    <article className="min-h-screen bg-zinc-950 text-white pt-28 pb-32">
      <div className="mx-auto max-w-[780px] px-6">
        
        {/* Back Button Navigation */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-yellow-500 transition-colors mb-10 group"
        >
          <i className="ri-arrow-left-line text-sm transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Kembali ke Berita</span>
        </Link>

        {/* Post Metadata Header */}
        <header className="flex flex-col gap-5">
          <div className="inline-flex items-center gap-3 text-[11px] font-bold italic uppercase tracking-[0.25em] text-yellow-500">
            <span className="h-px w-7 bg-yellow-500/50" />
            <span>Artikel · {formatDate(post.published_at)}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold italic uppercase tracking-tight leading-[1.08] text-white">
            {post.title}
          </h1>

          {/* Author Details Card */}
          <div className="flex items-center gap-3.5 mt-2">
            {post.author?.img_url ? (
              <div className="relative size-11 overflow-hidden rounded-full border border-white/10">
                <Image
                  src={post.author.img_url}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-11 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold text-sm uppercase border border-yellow-500/20">
                {post.author?.name?.charAt(0) || "R"}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-white leading-tight">
                {post.author?.name || "Ratih Admin"}
              </p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">
                {post.author?.role || "Team Ratih"}
              </p>
            </div>
          </div>
        </header>

        {/* Featured Banner Image */}
        <div className="relative aspect-[16/9] w-full my-10 overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 shadow-2xl">
          <Image
            src={post.img_url || "/images/bg/bg-2.png"}
            alt={post.alt_img || post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>

        {/* Excerpt Block */}
        {post.excerpt && (
          <div className="border-l-2 border-yellow-500 pl-6 my-8">
            <p className="text-lg/relaxed md:text-xl/relaxed italic font-light text-white/80">
              {post.excerpt}
            </p>
          </div>
        )}

        {/* Content Paragraphs / Rich Text */}
        <div className="mt-8 text-white/80 text-[16px] md:text-[18px] leading-relaxed font-light font-sans tracking-wide">
          {isHtml ? (
            <div 
              className="rich-content"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <div className="flex flex-col gap-6">
              {paragraphs.map((para: string, idx: number) => {
                const cleanPara = para.trim();
                if (!cleanPara) return null;
                return (
                  <p key={idx} className="whitespace-pre-wrap">
                    {cleanPara}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* Share Action Buttons */}
        <ShareButtons title={post.title} />

      </div>
    </article>
  );
}
