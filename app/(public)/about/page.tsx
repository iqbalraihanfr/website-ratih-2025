import type { Metadata } from "next";

import { AboutContent } from "@/features/marketing/components/about";
import { PageHero } from "@/components/ui/PageHero";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Tentang Ratih Creative",
  description:
    "Kenali cerita, nilai, dan tim di balik Ratih Creative Media sebagai partner kreatif untuk kebutuhan visual brand dan dokumentasi.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="about mx-auto bg-zinc-950 pb-5 transition-all">
      <PageHero
        eyebrow="Sedikit Cerita Tentang"
        title="RATIH CREATIVE"
        backgroundPath="bg/bg-3.webp"
      />
      <AboutContent />
    </div>
  );
}
