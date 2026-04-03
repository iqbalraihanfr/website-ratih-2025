import Image from "next/image"
import { siteConfig } from "@/lib/site"

const LogoRatih = () => {
  return (
    <div className='mx-10 lg:flex lg:flex-row flex flex-col items-center'>
      <Image
        src={siteConfig.logoHorizontalPath}
        alt={'Logo Ratih'}
        width={220}
        height={62}
        quality={90}
        sizes="(max-width: 768px) 180px, 220px"
        className='h-auto w-[180px] scale-90 object-contain lg:w-[220px] lg:scale-100'
      />
    </div>
  );
}

export default LogoRatih
