import type { Metadata } from "next";

import PortfolioContent from "@/features/marketing/components/portfolio/PortfolioContent";
import { PageHero } from "@/components/ui/PageHero";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Portofolio",
  description:
    "Lihat kumpulan karya Ratih Creative Media dalam fotografi, dokumentasi event, promosi UMKM, dan project visual lainnya.",
  path: "/portfolio",
});

const page = () => {
  return (
    <div className="portfolio mx-auto bg-zinc-950 pb-5">
      <PageHero
        eyebrow="Kumpulan Portofolio"
        title="RATIH CREATIVE"
        backgroundPath="bg/bg-4.webp"
      />
      <PortfolioContent />
    </div>
  )
}

export default page
