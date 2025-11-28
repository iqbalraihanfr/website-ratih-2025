import HomeSection from "@/components/HomeSection"
import WhyRatih from "@/components/WhyRatih"

const page = () => {
  return (
    <div className="homepage" id="about">
      <section className="relative min-h-screen">  
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.0),rgba(0,0,0,0.9)),url('/images/bg.png')] bg-no-repeat bg-cover bg-center"/>
        <div className="relative z-10">
          <HomeSection />
        </div>
      </section>
      <section className="h-screen bg-zinc-900">
        <WhyRatih />
      </section>

      {/* Section 3 */}
      <section className="h-screen bg-zinc-800">
        {/* Content section 3 */}
      </section>
    </div>
  )
}

export default page