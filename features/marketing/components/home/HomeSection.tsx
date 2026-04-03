import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/lib/site"

const HomeSection = () => {
  return (
    <div className='relative flex min-h-screen flex-col items-center px-4 pt-52 sm:px-6 sm:pt-56 md:pt-60'>
      <Link href={"/about"} aria-label="Lihat profil Ratih Creative">
        <Image
          src={siteConfig.logoHorizontalPath}
          alt={"Logo Ratih"}
          width={280}
          height={79}
          priority
          quality={90}
          sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 280px"
          className="mb-5 h-auto w-[180px] object-contain transition-all sm:w-[220px] md:w-[280px]"
        />
      </Link>
      <h1 className="text-center text-3xl font-bold italic transition-all md:text-6xl">
        RATIH CREATIVE MEDIA
      </h1>
      <span className="mt-3 max-w-xs text-center text-xs font-semibold transition-all sm:max-w-md md:text-base">
        A Digital Creative Agency Based On Madiun.
      </span>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/portfolio"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-zinc-200"
        >
          Lihat Portofolio
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:border-yellow-500 hover:text-yellow-500"
        >
          Hubungi Kami
        </Link>
      </div>
    </div>
  );
}

export default HomeSection
