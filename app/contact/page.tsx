import type { Metadata } from "next";

import ContactContent from "@/features/marketing/components/contact/ContactContent";
import { PageHero } from "@/components/ui/PageHero";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Hubungi Ratih Creative",
  description:
    "Diskusikan kebutuhan fotografi, videografi, branding, dan project visualmu bersama tim Ratih Creative Media.",
  path: "/contact",
});

const page = () => {
  return (
    <div className='mx-auto bg-zinc-950'>
      <PageHero
        eyebrow="Mari Terhubung Bersama"
        title="RATIH CREATIVE"
      />
      <ContactContent />
    </div>
  )
}

export default page
