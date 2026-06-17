"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import StalkRail from "./StalkRail";

const ContactContent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setFeedback("Nama, email, dan pesan wajib diisi.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("contact_messages").insert({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    });

    if (error) {
      console.error("Error submitting contact message:", error);
      setFeedback("Maaf, pesan belum berhasil terkirim. Coba lagi sebentar lagi ya.");
      setSubmitting(false);
      return;
    }

    setName("");
    setEmail("");
    setMessage("");
    setFeedback("Pesanmu sudah terkirim. Tim Ratih akan meninjau dari dashboard admin.");
    setSubmitting(false);
  };

  const labelCls = "text-[11px] font-bold italic uppercase tracking-[0.15em] text-white/55 mb-2";
  const inputCls =
    "bg-transparent border-0 border-b border-white/25 py-3 text-lg text-white outline-none transition-colors focus:border-yellow-500";

  return (
    <section className="bg-black px-6 lg:px-20 pt-16 pb-28">
      <div className="mx-auto grid max-w-[1280px] gap-14 lg:gap-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start">
        <div className="flex flex-col gap-10">
          <div className="inline-flex items-center gap-3 text-[11px] font-bold italic uppercase tracking-[0.25em] text-white/55">
            <span className="h-px w-7 bg-white/40" /> Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold italic uppercase leading-[0.95]">
            Ada Project?
            <br />
            <span className="text-yellow-500">Mari Ngobrol.</span>
          </h2>

          <div className="flex flex-col gap-7">
            <div>
              <p className={labelCls}>Email</p>
              <a href="mailto:ratihcreative@gmail.com" className="text-[22px] font-medium text-white transition-colors hover:text-yellow-500">
                ratihcreative@gmail.com
              </a>
            </div>
            <div>
              <p className={labelCls}>WhatsApp</p>
              <a href="https://wa.me/6281234567890" className="text-[22px] font-medium text-white transition-colors hover:text-yellow-500">
                +62 812‑3456‑7890
              </a>
            </div>
            <div>
              <p className={labelCls}>Studio</p>
              <p className="text-lg">
                Madiun, Jawa Timur
                <br />
                Wilayah kerja: SBY · MLG · MDN
              </p>
            </div>
          </div>

          <div>
            <StalkRail />
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-7">
          <div className="flex flex-col">
            <label className={labelCls}>Nama / Brand</label>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Siapa kamu?"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className={labelCls}>Email</label>
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@brand.id"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className={labelCls}>Ceritakan Project-mu</label>
            <textarea
              rows={5}
              className={`${inputCls} resize-y`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Brand, jenis project, timeline, referensi…"
              required
            />
          </div>
          {feedback && <p role="status" className="text-sm text-yellow-500">{feedback}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-5">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-3.5 bg-transparent text-lg font-bold italic uppercase tracking-wide text-white transition-colors hover:text-yellow-500 cursor-pointer"
            >
              {submitting ? "Mengirim..." : "Kirim Pesan"}
              <span className="inline-flex size-[52px] items-center justify-center rounded-full border border-current">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            <a
              href="https://wa.me/6281234567890"
              className="text-[13px] text-white/60 underline underline-offset-4 transition-colors hover:text-yellow-500"
            >
              Chat WhatsApp langsung →
            </a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactContent;
