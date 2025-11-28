import AboutContent from "@/components/AboutContent"
import AboutHead from "@/components/AboutHead"

const page = () => {
  return (
    <div className="about mx-auto bg-zinc-950">
        <AboutHead />
        <AboutContent />
    </div>
  )
}

export default page