import { Mail, Phone } from "lucide-react"
import FooterLogo from "./FooterLogo"
import SocialMedia from "./SocialMedia"

const Footer = () => {
  return (
    <footer className="container mx-auto mb-5 mt-10">
      <div className="lg:mx-20 mx-10">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <FooterLogo />
          <div className="flex flex-col md:flex-row md:gap-20 gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-bold italic opacity-50 ">ALAMAT</h1>
              <p className="font-medium text-sm">Madiun, Indonesia.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-bold italic opacity-50">HUBUNGI KAMI</h1>
              <p className="flex flex-row gap-2 items-center font-medium text-sm"><Phone />+62 81234567890</p>
              <p className="flex flex-row gap-2 items-center font-medium text-sm"><Mail />Ratih@mail.com</p>
            </div>
            <SocialMedia />
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <span className="opacity-70 text-xs md:text-sm">Copyright © 2025. All right reserved.</span>
      </div>
    </footer>
  )
}

export default Footer