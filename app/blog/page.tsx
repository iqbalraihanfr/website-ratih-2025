import BlogContent from "@/components/BlogContent"
import BlogHead from "@/components/BlogHead"
import { createServerSupabase } from "@/lib/supabase/server"

export const revalidate = 0;

const page = async () => {
  const supabase = createServerSupabase();
  const { data: dbPosts } = await supabase
    .from("posts")
    .select("*, author:crew(name, role, img_url)")
    .order("published_at", { ascending: false });

  const initialPosts = dbPosts || [];

  return (
    <div className="mx-auto bg-zinc-950">
      <BlogHead />
      <BlogContent initialPosts={initialPosts} />
    </div>
  )
}

export default page