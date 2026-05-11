const stats = [
  { k: "04+", v: "Years In Business" },
  { k: "07", v: "Crew Members" },
  { k: "3", v: "Cities Covered" },
];

const WhyRatih = () => (
  <section className="bg-black border-t border-white/10 px-6 lg:px-20 pt-20 pb-28">
    <div className="mx-auto grid max-w-[1280px] gap-12 lg:gap-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-start">
      <div className="lg:sticky lg:top-24">
        <div className="mb-3 inline-flex items-center gap-3 text-[11px] font-bold italic uppercase tracking-[0.25em] text-white/55">
          <span className="h-px w-7 bg-white/40" /> Why Ratih
        </div>
        <h2 className="text-3xl md:text-5xl font-bold italic uppercase leading-[1.02] tracking-tight">
          Kenapa Harus Ratih?
        </h2>
      </div>
      <div className="flex flex-col gap-5">
        <p className="text-lg leading-relaxed text-white/85">
          RATIH hadir sebagai creative partner yang bantu brand ningkatin identitas visualnya lewat karya yang{" "}
          <span className="text-yellow-500">kuat, terkonsep, dan relevan</span> sama kebutuhan zaman.
        </p>
        <p className="text-[15px] leading-relaxed text-white/65">
          Kami fokus di fotografi, videografi, serta branding perusahaan, mulai dari pembuatan logo sampai brand guideline yang rapi dan profesional. RATIH juga bergerak di produksi short movie dengan storytelling yang berkarakter dan kualitas visual yang cinematic.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.k} className="border-t border-white/20 py-5">
              <p className="text-3xl font-bold italic">{s.k}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-white/55">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyRatih;
