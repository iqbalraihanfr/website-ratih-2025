import type { Metadata } from "next";

import { HomeSection, JasaRatih, WhyRatih } from "@/features/marketing/components/home";
import HomeBg from "@/components/ui/HomeBg";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Creative Agency di Madiun",
  description:
    "Ratih Creative Media membantu brand tampil lebih kuat lewat fotografi, videografi, branding, dan desain visual yang terarah.",
  path: "/",
});

export default function HomePage() {
  return (
    <div className="homepage bg-zinc-950" id="about">
      <HomeBg />
      <HomeSection />
      <WhyRatih />
      <JasaRatih />
    </div>
  );
}
