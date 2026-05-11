import HomeBg from "@/components/HomeBg"
import HomeSection from "@/components/HomeSection"
import JasaRatih from "@/components/JasaRatih"
import WhyRatih from "@/components/WhyRatih"
import WordmarkMarquee from "@/components/WordmarkMarquee"

const page = () => {
  return (
    <div className="homepage bg-black" id="about">
        <div className="relative min-h-screen">
          <HomeBg />
          <HomeSection />
        </div>
        <WordmarkMarquee />
        <JasaRatih />
        <WhyRatih />
    </div>
  )
}

export default page