import Image from "next/image";
import Link from "next/link";
import WordmarkMarquee from "./WordmarkMarquee";
import StalkRail from "./StalkRail";

const navLinks = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const labelCls = "text-[11px] font-bold italic uppercase tracking-[0.2em] text-white/50";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10">
      <WordmarkMarquee speed={120} />
      <div className="mx-auto max-w-[1280px] px-6 lg:px-20 pt-14 pb-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-12 items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logo-ratih.svg"
                alt="Ratih Creative Media"
                width={50}
                height={50}
                style={{ height: 40, width: "auto" }}
              />
              <span className="text-lg font-bold italic uppercase">Ratih Creative</span>
            </Link>
            <p className="mt-5 max-w-[280px] text-lg font-bold italic uppercase leading-[1.15]">
              Partner Kreatif
              <br />
              Project-Mu.
            </p>
          </div>

          <div>
            <p className={labelCls}>Studio</p>
            <p className="mt-3 text-[15px] leading-relaxed">
              Madiun, Jawa Timur
              <br />
              Indonesia
            </p>
          </div>

          <div>
            <p className={labelCls}>Hubungi</p>
            <div className="mt-3 flex flex-col gap-1 text-[15px]">
              <a href="mailto:ratihcreative@gmail.com" className="text-white transition-colors hover:text-yellow-500">
                ratihcreative@gmail.com
              </a>
              <a href="https://wa.me/6281234567890" className="text-white transition-colors hover:text-yellow-500">
                +62 812‑3456‑7890
              </a>
            </div>
          </div>

          <div>
            <p className={labelCls}>Navigate</p>
            <ul className="mt-3 flex list-none flex-col gap-1.5 p-0">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[15px] text-white transition-colors hover:text-yellow-500">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6">
          <p className="text-[11px] uppercase tracking-[0.1em] text-white/50">
            © {new Date().getFullYear()} Ratih Creative Media. All Rights Reserved.
          </p>
          <StalkRail />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
