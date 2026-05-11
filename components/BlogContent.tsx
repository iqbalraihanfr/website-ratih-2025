import Image from "next/image";

type Post = {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  img: string;
  featured?: boolean;
};

const posts: Post[] = [
  {
    title: "Behind The Lens — Kirab Budaya",
    excerpt:
      "Catatan kecil dari proses syuting pawai budaya Mejayan, dari subuh sampai larut malam. Tentang bagaimana kru kami berputar di tengah keramaian dan tetap menjaga komposisi.",
    author: "Andra Ariloka",
    date: "Apr 2026",
    img: "/images/portfolio/kirab-budaya-mejayan.png",
    featured: true,
  },
  {
    title: "Cara Brief Yang Bikin Foto Produk Naik Kelas",
    excerpt: "Tiga hal sederhana yang bisa kamu siapkan sebelum sesi foto produk supaya hasilnya rapi dan konsisten.",
    author: "Favian Rifqi",
    date: "Mar 2026",
    img: "/images/portfolio/promosi-umkm.png",
  },
  {
    title: "Membaca Mood Lewat Color Grading",
    excerpt: "Color grading bukan cuma soal estetika — ini cara kami menentukan mood sebuah brand film.",
    author: "Valentinus Nathanael",
    date: "Mar 2026",
    img: "/images/portfolio/pahlawan-cfn.png",
  },
  {
    title: "Logo Bukan Identitas. Tapi Awal Dari Identitas.",
    excerpt: "Brand identity dimulai jauh sebelum sketsa logo pertama. Begini cara kami memetakan brand dari nol.",
    author: "Afrizal Ahmad",
    date: "Feb 2026",
    img: "/images/portfolio/festival-dongkrek.png",
  },
];

const BlogContent = () => (
  <section className="bg-black px-6 lg:px-20 pt-16 pb-28">
    <div className="mx-auto grid max-w-[1280px] grid-cols-1 lg:grid-cols-3 gap-10 gap-y-14">
      {posts.map((p, i) =>
        p.featured ? (
          <article
            key={i}
            className="group col-span-full grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-center pb-14 border-b border-white/10 cursor-pointer"
          >
            <div className="overflow-hidden">
              <div className="relative aspect-[3/2] transition-transform duration-500 group-hover:scale-[1.02]">
                <Image src={p.img} alt={p.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </div>
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="inline-flex items-center gap-3 text-[11px] font-bold italic uppercase tracking-[0.25em] text-white/55">
                <span className="h-px w-7 bg-white/40" /> Featured · {p.date}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold italic uppercase leading-[1.02] transition-colors group-hover:text-yellow-500">
                {p.title}
              </h2>
              <p className="text-[15px] leading-relaxed text-white/70">{p.excerpt}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-white/45">By {p.author}</p>
            </div>
          </article>
        ) : (
          <article key={i} className="group flex flex-col gap-3.5 cursor-pointer pb-6">
            <div className="overflow-hidden">
              <div className="relative aspect-[3/2] transition-transform duration-500 group-hover:scale-[1.02]">
                <Image src={p.img} alt={p.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">{p.date}</p>
            <h2 className="text-xl font-bold italic uppercase leading-tight transition-colors group-hover:text-yellow-500">
              {p.title}
            </h2>
            <p className="line-clamp-2 text-[13px] leading-relaxed text-white/60">{p.excerpt}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-white/40">By {p.author}</p>
          </article>
        )
      )}
    </div>
  </section>
);

export default BlogContent;
