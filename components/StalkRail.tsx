"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface SocialMediaItem {
  id: string;
  href: string;
  logo: string;
  sort_order: number;
}

const StalkRail = ({ label = "Temui Kami" }: { label?: string }) => {
  const [socialMedia, setSocialMedia] = useState<SocialMediaItem[]>([]);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const { data, error } = await supabase
          .from("social_media")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) {
          throw error;
        }
        setSocialMedia(data || []);
      } catch (error) {
        console.error("Error fetching social media from Supabase:", error);
      }
    };

    fetchSocialMedia();
  }, []);

  return (
    <div className="inline-flex items-center gap-3">
      <span className="text-[11px] font-bold italic uppercase tracking-[0.15em] text-white/65">
        {label}
      </span>
      <span className="h-px w-6 bg-white/40" />
      {socialMedia.map((m) => (
        <a
          key={m.id}
          href={m.href}
          aria-label={m.logo}
          className="inline-flex size-7 items-center justify-center text-white hover:text-yellow-500 transition-colors"
        >
          <i className={`${m.logo} text-[18px]`} />
        </a>
      ))}
    </div>
  );
};

export default StalkRail;


