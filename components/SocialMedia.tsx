import { createServerSupabase } from "@/lib/supabase/server"
import Link from "next/link"

const SocialMedia = async () => {
  const supabase = createServerSupabase();
  const { data: dbSocial, error } = await supabase
    .from("social_media")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching social media in SocialMedia component:", error);
  }

  const socialMedia = dbSocial || [];

  return (
    <div className="flex flex-row gap-2">
        {socialMedia.map((media) => (
          <Link 
            key={media.id} 
            href={media.href}
            className="text-xl hover:text-yellow-500 transition-all"
          >
            <i className={media.logo} />
          </Link>
      ))}
    </div>
  )
}

export default SocialMedia