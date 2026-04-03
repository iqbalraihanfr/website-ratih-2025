import AllAboutRatih from "@/features/marketing/components/about/AllAboutRatih";
import RATIH from "@/features/marketing/components/about/RatihValues";
import RatihCrew from "@/features/marketing/components/about/RatihCrew";

const AboutContent = () => {
  return (
    <div className="container mx-auto transition-all">
      <AllAboutRatih />
      <RATIH />
      <RatihCrew />
    </div>
  )
}

export default AboutContent
