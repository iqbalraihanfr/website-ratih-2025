import FooterLogo from "./FooterLogo"
import FooterMenu from "./FooterMenu"
import SocialMedia from "./SocialMedia"

const Footer = () => {
  return (
    <footer className="container mx-auto mb-5">
      <div className="mx-20 mt-10">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <FooterLogo />
          <p className="mt-3 lg:w-1/2">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam architecto facere quos quas similique ea, repellat cumque maiores eos eius.</p>
        </div>
        <SocialMedia />
      </div>
      <div className="mt-8 text-center ">
        <span className="opacity-70">Copyright © 2025. All right reserved.</span>
      </div>
    </footer>
  )
}

export default Footer