import AboutContent from "@/components/AboutContent"
import AboutHead from "@/components/AboutHead"

const page = () => {
  return (
    <div className="about mx-auto bg-zinc-950 pb-5 transition-all">
        <AboutHead />
        <AboutContent />
    </div>
  )
}

export default page