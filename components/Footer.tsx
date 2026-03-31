import { Mail, Phone } from "lucide-react"
import { footerData } from "@/constants"
import { siteConfig } from "@/lib/site"
import FooterLogo from "./FooterLogo"
import SocialMedia from "./SocialMedia"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="container mx-auto mb-5 mt-10">
      <div className="lg:mx-20 mx-10">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <FooterLogo />
          <div className="flex flex-col md:flex-row md:gap-20 gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-bold italic opacity-50 ">ALAMAT</h2>
              <p className="font-medium text-sm">{siteConfig.location}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-bold italic opacity-50">HUBUNGI KAMI</h2>
              <a
                href={`tel:${siteConfig.phoneLink}`}
                className="flex flex-row gap-2 items-center font-medium text-sm hover:text-yellow-500 transition-all"
              >
                <Phone className="h-4 w-4" />
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex flex-row gap-2 items-center font-medium text-sm hover:text-yellow-500 transition-all"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.email}
              </a>
              <div className="mt-2 flex flex-wrap gap-3">
                {footerData.map((menu) => (
                  <Link
                    key={menu.id}
                    href={menu.href}
                    className="text-sm font-semibold uppercase italic text-zinc-400 transition-all hover:text-white"
                  >
                    {menu.title}
                  </Link>
                ))}
              </div>
            </div>
            <SocialMedia />
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <span className="opacity-70 text-xs md:text-sm">
          Copyright © {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
        </span>
      </div>
    </footer>
  )
}

export default Footer
