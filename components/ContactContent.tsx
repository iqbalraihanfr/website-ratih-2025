"use client"

import { useState } from "react";

import SocialMedia from "./SocialMedia"
import { siteConfig } from "@/lib/site";

const ContactContent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `Inquiry Website Ratih Creative dari ${name}`;
    const body = [
      "Halo Ratih Creative,",
      "",
      `Nama: ${name}`,
      `Email: ${email}`,
      "",
      "Pesan:",
      message,
      "",
      "Dikirim dari website Ratih Creative.",
    ].join("\n");

    const params = new URLSearchParams({
      subject,
      body,
    });

    setFeedback("Aplikasi emailmu akan terbuka dengan draft pesan yang sudah terisi.");
    window.location.href = `mailto:${siteConfig.email}?${params.toString()}`;
  }

  return (
    <div className="container mx-auto pb-10 mt-20 transition-all">
      <div className="flex flex-col lg:flex-row gap-4 lg:mx-20 mx-10">

        {/* Hubungi Kami */}
        <div className="md:w-1/3 w-full mb-10">
          <h2 className="font-bold uppercase text-2xl italic">Hubungi Kami</h2>
          <div className="mt-10 flex flex-col gap-10 mb-10">  
            <span className="font-bold uppercase italic text-lg">
              Email
              <a
                href={`mailto:${siteConfig.email}`}
                className="block font-light text-lg normal-case not-italic hover:text-yellow-500 transition-all"
              >
                {siteConfig.email}
              </a>
            </span>
            <span className="font-bold uppercase italic text-lg">
              WhatsApp
              <a
                href={`https://wa.me/${siteConfig.phoneLink}`}
                target="_blank"
                rel="noreferrer"
                className="block font-light text-lg normal-case not-italic hover:text-yellow-500 transition-all"
              >
                {siteConfig.phoneDisplay}
              </a>
            </span>
          </div>
          <h3 className="font-bold uppercase text-xl italic">Channel Kami</h3>
          <SocialMedia />
        </div>

        {/* Form */}
        <form className="flex flex-col w-full gap-3 transition-all" onSubmit={handleSubmit}>
          <p className="text-sm text-zinc-400">
            Isi form ini untuk membuka draft email otomatis ke tim Ratih Creative.
          </p>
          <label htmlFor="name" className="font-semibold italic opacity-70">Nama Anda</label>
            <input
              id="name"
              name="name"
              type="text"
              className="bg-zinc-800 p-4 rounded-md"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          <label htmlFor="email" className="font-semibold italic opacity-70">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="bg-zinc-800 p-4 rounded-md"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          <label htmlFor="message" className="font-semibold italic opacity-70" >Pesan</label>
          <textarea 
            id="message"
            name="message"
            cols={30}
            rows={5}
            className="bg-zinc-800 p-4 rounded-md"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
          {feedback ? (
            <p role="status" className="text-sm text-yellow-500">
              {feedback}
            </p>
          ) : null}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="w-fit bg-zinc-800 px-6 py-2.5 rounded-md hover:bg-zinc-600 transition-all cursor-pointer hover:scale-95">
            <span className="text-sm font-semibold">Kirim Pesan</span>
          </button>
          <a
            href={`https://wa.me/${siteConfig.phoneLink}`}
            target="_blank"
            rel="noreferrer"
            className="w-fit rounded-md border border-white/20 px-6 py-2.5 text-sm font-semibold transition-all hover:border-yellow-500 hover:text-yellow-500"
          >
            Chat via WhatsApp
          </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactContent
