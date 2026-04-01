import Image from "next/image"
import Link from "next/link"
import { storageUrl } from "@/lib/storage"

const HomeSection = () => {
  return (
    <div className='pt-60 flex flex-col items-center relative min-h-screen'>
      <Link href={"/about"}>
        <Image
          src={storageUrl("logo-ratih-2.svg")}
          alt={"Logo Ratih"}
          width={80}
          height={0}
          className="mb-5 scale-85 md:scale-100 transition-all"
          style={{
            maxWidth: "100%",
            height: "auto"
          }}>
        </Image>
      </Link>
      <h1 className="text-center md:text-6xl font-bold italic text-3xl transition-all">
        RATIH CREATIVE MEDIA
      </h1>
      <span className="md:text-base text-xs mt-3 font-semibold transition-all">
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
