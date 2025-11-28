import AboutRatih from "./AboutRatih"
import LogoRatih from "./LogoRatih"
import RATIH from "./RATIH"
import RatihCrew from "./RatihCrew"

const AboutContent = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex lg:flex-row mt-20 pb-10 mx-20 items-center">
        <LogoRatih />
        <AboutRatih />
      </div>
      <RATIH />
      <RatihCrew />
    </div>
  )
}

export default AboutContent