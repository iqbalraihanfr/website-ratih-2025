import { siteConfig } from "@/lib/site";

export type NavigationItem = {
  id: string;
  title?: string;
  href: string;
  isLogo?: boolean;
  logoURL?: string;
  altText?: string;
};

export type SocialLink = {
  id: string;
  label: string;
  logo: string;
  href: string;
};

export const headerData: NavigationItem[] = [
  { id: "about", title: "About", href: "/about" },
  { id: "portfolio", title: "Portfolio", href: "/portfolio" },
  {
    id: "logo",
    title: "Logo",
    href: "/",
    isLogo: true,
    logoURL: "logo-ratih.svg",
    altText: "Logo Ratih Creative",
  },
  { id: "contact", title: "Contact", href: "/contact" },
  { id: "blog", title: "Blog", href: "/blog" },
];

export const footerData: NavigationItem[] = [
  { id: "about", title: "About", href: "/about" },
  { id: "portfolio", title: "Portfolio", href: "/portfolio" },
  { id: "contact", title: "Contact", href: "/contact" },
  { id: "blog", title: "Blog", href: "/blog" },
];

export const socialMedia: SocialLink[] = [
  {
    id: "email",
    label: "Kirim email ke Ratih Creative",
    logo: "ri-mail-line",
    href: `mailto:${siteConfig.email}`,
  },
  {
    id: "whatsapp",
    label: "Chat Ratih Creative via WhatsApp",
    logo: "ri-whatsapp-line",
    href: `https://wa.me/${siteConfig.phoneLink}`,
  },
];

export const ratihCrew = [
  {
    id: "1",
    name: "Afrizal Ahmad",
    role: "Graphic Designer",
    imgURL: "crew/rijal-bg.webp",
    altIMG: "Potret Afrizal Ahmad",
    desc: "Menerjemahkan kebutuhan brand menjadi visual yang rapi, kuat, dan tetap punya karakter yang mudah diingat.",
  },
  {
    id: "2",
    name: "Andra Ariloka",
    role: "Content Writer",
    imgURL: "crew/ndar-bg.webp",
    altIMG: "Potret Andra Ariloka",
    desc: "Membantu menyusun narasi dan copy yang relevan agar pesan brand terasa jelas dan dekat dengan audiens.",
  },
  {
    id: "4",
    name: "Favian Rifqi",
    role: "Photographer",
    imgURL: "crew/yan-bg.webp",
    altIMG: "Potret Favian Rifqi",
    desc: "Fokus pada detail visual dan momen penting untuk menghasilkan foto yang kuat secara teknis dan emosional.",
  },
  {
    id: "6",
    name: "Valentinus Nathanael",
    role: "Videographer",
    imgURL: "crew/nathann-bg.webp",
    altIMG: "Potret Valentinus Nathanael",
    desc: "Mengembangkan visual bergerak yang cinematic dan tetap efektif menyampaikan identitas sebuah brand.",
  },
  {
    id: "3",
    name: "Jiersa Hilal",
    role: "Video Editor",
    imgURL: "crew/sastra-bg.webp",
    altIMG: "Potret Jiersa Hilal",
    desc: "Mengolah footage menjadi cerita yang rapi, ritmis, dan enak ditonton di berbagai format distribusi.",
  },
  {
    id: "5",
    name: "Afif Satrio",
    role: "Web Developer",
    imgURL: "crew/pipp-bg.webp",
    altIMG: "Potret Afif Satrio",
    desc: "Menjembatani kebutuhan visual dan kebutuhan digital agar presentasi brand tetap konsisten di web.",
  },
  {
    id: "7",
    name: "Iqbal Raihan",
    role: "Web Developer",
    imgURL: "crew/raihaan-bg.webp",
    altIMG: "Potret Iqbal Raihan",
    desc: "Membangun pengalaman web yang cepat, rapi, dan mudah dipelihara untuk mendukung kebutuhan presentasi brand.",
  },
];

export const portfolio = [
  {
    id: "1",
    title: "Gebyar Festival Dongkrek",
    imgURL: "portfolio/festival-dongkrek.webp",
    category: "photography",
  },
  {
    id: "2",
    title: "Kirab Budaya Mejayan",
    imgURL: "portfolio/kirab-budaya-mejayan.webp",
    category: "photography",
  },
  {
    id: "3",
    title: "Pahlawan Car Free Night",
    imgURL: "portfolio/pahlawan-cfn.webp",
    category: "photography",
  },
  {
    id: "4",
    title: "Promosi UMKM",
    imgURL: "portfolio/promosi-umkm.webp",
    category: "photography",
  },
];

export const services = [
  {
    id: "1st",
    serviceTitle: "Fotografi",
    serviceDesc:
      "Layanan fotografi yang fokus pada visual yang kuat, detail yang rapi, dan mood yang sesuai karakter brand. Cocok untuk kebutuhan produk, campaign, company profile, hingga dokumentasi event dan momen penting lainnya.",
    serviceIMG: "portfolio/kirab-budaya-mejayan.webp",
    altIMG: "Dokumentasi fotografi Ratih Creative",
  },
  {
    id: "2nd",
    serviceTitle: "Videografi",
    serviceDesc:
      "Produksi video dengan pendekatan visual yang cinematic dan storytelling yang relevan, mulai dari video branding, company profile, hingga short creative clip untuk kebutuhan kampanye digital.",
    serviceIMG: "portfolio/festival-dongkrek.webp",
    altIMG: "Produksi videografi Ratih Creative",
  },
  {
    id: "3rd",
    serviceTitle: "Branding & Visual Identity",
    serviceDesc:
      "Membangun identitas brand dari dasar lewat logo, warna, tipografi, dan brand guideline yang terstruktur agar brand tampil lebih jelas, profesional, dan mudah diingat.",
    serviceIMG: "portfolio/promosi-umkm.webp",
    altIMG: "Proses branding dan visual identity",
  },
  {
    id: "4th",
    serviceTitle: "Graphic Design",
    serviceDesc:
      "Desain visual untuk kebutuhan promosi seperti poster, banner, feed, dan materi campaign lain dengan komposisi yang modern, bersih, dan komunikatif.",
    serviceIMG: "portfolio/pahlawan-cfn.webp",
    altIMG: "Karya graphic design Ratih Creative",
  },
  {
    id: "5th",
    serviceTitle: "Short Movie Production",
    serviceDesc:
      "Produksi short movie dengan visual cinematic dan konsep cerita yang matang untuk campaign, karya kreatif, atau konten yang membutuhkan storytelling emosional.",
    serviceIMG: "portfolio/festival-dongkrek.webp",
    altIMG: "Produksi short movie Ratih Creative",
  },
];
