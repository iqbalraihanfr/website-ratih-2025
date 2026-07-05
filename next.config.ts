import type { NextConfig } from "next";

const getHostname = (url?: string) => {
  if (!url) return null;

  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

const supabaseImageHosts = Array.from(
  new Set(
    [
      getHostname(process.env.NEXT_PUBLIC_SUPABASE_URL),
      "jkvqbevodjdocejcuagi.supabase.co",
    ].filter((hostname): hostname is string => Boolean(hostname))
  )
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      ...supabaseImageHosts.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
    ],
  },
};

export default nextConfig;
