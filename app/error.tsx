"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="id">
      <body className="bg-zinc-950 text-white">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-500">
            Terjadi Kendala
          </p>
          <h1 className="text-4xl font-bold italic uppercase md:text-5xl">
            Halaman Sedang Bermasalah
          </h1>
          <p className="max-w-xl text-sm text-zinc-300 md:text-base">
            Ada error yang mengganggu halaman ini. Coba muat ulang sekali lagi.
            {error.digest ? ` Referensi: ${error.digest}` : ""}
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Coba Lagi
          </button>
        </main>
      </body>
    </html>
  );
}
