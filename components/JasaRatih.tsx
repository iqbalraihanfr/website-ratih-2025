"use client";
import { useState } from "react";
import { services } from "@/constants";

const tagsFor = (title: string): string[] => {
  const t = title.toLowerCase();
  if (t.includes("foto")) return ["Product", "Campaign", "Event"];
  if (t.includes("video")) return ["Brand Film", "Profile", "Clip"];
  if (t.includes("branding")) return ["Logo", "Identity", "Guide"];
  if (t.includes("graphic")) return ["Poster", "Feed", "Campaign"];
  return ["Cinematic", "Story"];
};

const JasaRatih = () => {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section className="bg-black px-6 py-24 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-14 flex flex-col gap-4">
          <div className="inline-flex items-center gap-3 text-[11px] font-bold italic uppercase tracking-[0.25em] text-white/55">
            <span className="h-px w-7 bg-white/40" /> What We Do
          </div>
          <h2 className="text-3xl md:text-5xl font-bold italic uppercase leading-[1.02] tracking-tight">
            Apa Yang Kami Lakukan?
          </h2>
        </div>

        <div className="flex flex-col">
          {services.map((s, i) => {
            const active = hover === i;
            return (
              <div
                key={s.id}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={`grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr_auto] items-center gap-4 md:gap-8 border-t border-white/10 py-8 cursor-pointer transition-all ${
                  i === services.length - 1 ? "border-b" : ""
                }`}
              >
                <p
                  className={`font-mono text-sm font-bold italic transition-colors ${
                    active ? "text-yellow-500" : "text-white/35"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} ─
                </p>
                <div className="flex flex-col gap-1.5">
                  <h3
                    className={`text-2xl md:text-4xl font-bold italic uppercase leading-none transition-colors ${
                      active ? "text-yellow-500" : "text-white"
                    }`}
                  >
                    {s.serviceTitle}
                  </h3>
                  <p
                    className="text-sm text-white/55 leading-relaxed max-w-[540px] overflow-hidden transition-all"
                    style={{ maxHeight: active ? 220 : 0, paddingTop: active ? 8 : 0 }}
                  >
                    {s.serviceDesc}
                  </p>
                </div>
                <div className="hidden md:flex flex-wrap gap-1.5">
                  {tagsFor(s.serviceTitle).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JasaRatih;
