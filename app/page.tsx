import type { Metadata } from "next";

import HomeSection from "@/features/marketing/components/home/HomeSection";
import JasaRatih from "@/features/marketing/components/home/JasaRatih";
import WhyRatih from "@/features/marketing/components/home/WhyRatih";
import HomeBg from "@/components/ui/HomeBg"
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Creative Agency di Madiun",
  description:
    "Ratih Creative Media membantu brand tampil lebih kuat lewat fotografi, videografi, branding, dan desain visual yang terarah.",
  path: "/",
});

const page = () => {
  return (
    <div className="homepage bg-zinc-950" id="about">
        <HomeBg />
        <HomeSection />
        <WhyRatih />
        <JasaRatih />
    </div>
  )
}

export default page
