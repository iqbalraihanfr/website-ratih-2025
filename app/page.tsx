import HomeBg from "@/components/HomeBg"
import HomeSection from "@/components/HomeSection"
import JasaRatih from "@/components/JasaRatih"
import WhyRatih from "@/components/WhyRatih"

const page = () => {
  return (
    <div className="homepage bg-zinc-950" id="about">
        <HomeBg />
        <HomeSection />
        <WhyRatih />
        <JasaRatih />
    </div>
  )
}

export default page