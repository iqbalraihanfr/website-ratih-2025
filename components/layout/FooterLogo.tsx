import Image from "next/image"
import { storageUrl } from "@/lib/storage"

const FooterLogo = () => {
  return (
    <div className="flex flex-row gap-4 items-center mb-10">
      <Image
        src={storageUrl("logo-ratih.svg")}
        alt={"Logo Ratih"}
        width={50}
        height={50}
        style={{
          maxWidth: "100%",
          height: "auto"
        }} />
      <span className="text-lg font-bold italic">
      RATIH CREATIVE MEDIA
      <p className="text-xs font-normal not-italic">Partner Kreatif Projectmu!</p>
      </span>
    </div>
  );
}

export default FooterLogo