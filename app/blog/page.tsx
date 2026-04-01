import type { Metadata } from "next";

import BlogContent from "@/features/marketing/components/blog/BlogContent";
import { PageHero } from "@/components/ui/PageHero";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Blog Segera Hadir",
  description:
    "Halaman blog Ratih Creative sedang disiapkan. Untuk sementara, jelajahi portofolio dan hubungi tim kami langsung.",
  path: "/blog",
  noIndex: true,
});

const page = () => {
  return (
    <div className="mx-auto bg-zinc-950">
      <PageHero
        eyebrow="Tambah Wawasanmu Bersama"
        title="BERITA RATIH"
        backgroundPath="bg/bg-2.webp"
      />
      <BlogContent />
    </div>
  )
}

export default page
