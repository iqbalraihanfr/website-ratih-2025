import Link from "next/link";

const BlogContent = () => {
  return (
    <section className="mx-auto flex min-h-[40vh] max-w-3xl flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <h2 className="text-2xl font-bold italic uppercase md:text-4xl">
        Blog Sedang Disiapkan
      </h2>
      <p className="text-sm text-zinc-300 md:text-base">
        Kami sedang menyiapkan ruang untuk cerita project, insight visual, dan
        update terbaru dari Ratih Creative. Sementara itu, kamu bisa lihat karya
        kami atau langsung hubungi tim kami.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/portfolio"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Lihat Portofolio
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:border-yellow-500 hover:text-yellow-500"
        >
          Hubungi Kami
        </Link>
      </div>
    </section>
  )
}

export default BlogContent
