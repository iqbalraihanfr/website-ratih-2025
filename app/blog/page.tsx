import BlogContent from "@/components/BlogContent"
import BlogHead from "@/components/BlogHead"

const page = () => {
  return (
    <div className="mx-auto bg-zinc-950">
      <BlogHead />
      <BlogContent />
    </div>
  )
}

export default page