import type { Metadata } from "next";

export const siteConfig = {
  name: "Ratih Creative",
  fullName: "Ratih Creative Media",
  titleTemplate: "%s | Ratih Creative",
  description:
    "Ratih Creative adalah creative agency berbasis di Madiun yang menghadirkan layanan fotografi, videografi, branding, dan desain visual untuk brand, UMKM, dan project kreatif.",
  location: "Madiun, Indonesia",
  locale: "id_ID",
  email: "ratih@mail.com",
  phoneDisplay: "+62 81234567890",
  phoneLink: "6281234567890",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  keywords: [
    "Ratih Creative",
    "creative agency Madiun",
    "jasa fotografi Madiun",
    "jasa videografi Madiun",
    "branding visual",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.baseUrl).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: path,
      siteName: siteConfig.fullName,
      title,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${siteConfig.fullName} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : undefined,
  };
}
