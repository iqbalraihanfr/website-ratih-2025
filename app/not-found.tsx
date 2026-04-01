import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-500">
        404
      </p>
      <h1 className="text-4xl font-bold italic uppercase md:text-5xl">
        Halaman Tidak Ditemukan
      </h1>
      <p className="max-w-xl text-sm text-zinc-300 md:text-base">
        Halaman yang kamu cari belum tersedia atau sudah dipindahkan. Kamu bisa
        kembali ke homepage atau langsung lihat portofolio kami.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/portfolio"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:border-yellow-500 hover:text-yellow-500"
        >
          Lihat Portofolio
        </Link>
      </div>
    </main>
  );
}
