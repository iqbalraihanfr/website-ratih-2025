import AboutRatih from "./AboutRatih"
import LogoRatih from "./LogoRatih"
import RATIH from "./RATIH"
import RatihCrew from "./RatihCrew"

const AboutContent = () => {
  return (
    <div className="container mx-auto transition-all">
      <div className="flex flex-col lg:flex-row mt-20 pb-10 lg:mx-20 mx-10 items-center">
        <LogoRatih />
        <AboutRatih />
      </div>
      <RATIH />
      <RatihCrew />
    </div>
  )
}

export default AboutContent
