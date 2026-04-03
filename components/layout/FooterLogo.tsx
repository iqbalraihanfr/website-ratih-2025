import Image from "next/image"
import { siteConfig } from "@/lib/site"

const FooterLogo = () => {
  return (
    <div className="mb-10 flex max-w-xs flex-col items-start gap-4">
      <Image
        src={siteConfig.logoHorizontalPath}
        alt={"Logo Ratih"}
        width={188}
        height={53}
        quality={90}
        sizes="(max-width: 768px) 160px, 188px"
        className="h-auto w-[160px] object-contain md:w-[188px]"
      />
      <div>
        <p className="text-lg font-bold italic">RATIH CREATIVE MEDIA</p>
        <p className="text-xs font-normal not-italic">Partner Kreatif Projectmu!</p>
      </div>
    </div>
  );
}

export default FooterLogo
