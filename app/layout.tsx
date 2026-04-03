import type { Metadata } from "next";
import localFont from "next/font/local";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "remixicon/fonts/remixicon.css";
import "./globals.css";

const Montserrat = localFont({
  src: "font/Montserrat.woff2",
  variable: "--font-montserrat",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: siteConfig.fullName,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  icons: {
    icon: [
      { url: siteConfig.faviconPath, sizes: "any" },
      { url: siteConfig.iconPath, type: "image/png" },
    ],
    apple: [{ url: siteConfig.appleIconPath, type: "image/png" }],
    shortcut: [siteConfig.faviconPath],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.fullName,
    title: siteConfig.fullName,
    description: siteConfig.description,
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
    title: siteConfig.fullName,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.fullName,
    url: absoluteUrl("/"),
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madiun",
      addressCountry: "ID",
    },
  };

  return (
    <html lang="id">
      <body
        className={`${Montserrat.variable} antialiased text-white -pt-20 transition-all`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
