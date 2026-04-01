import { footerData } from "@/constants"
import Link from "next/link"

const FooterMenu = () => {
  return (
    <div className="footermenu flex flex-wrap gap-3">
        {footerData.map((menu) => (
            <Link 
            key={menu.id}
            href={menu.href}
            >
            <span className="text-sm font-semibold uppercase italic text-zinc-400 transition-all hover:text-white">{menu.title}</span>
            </Link>
        ))}
    </div>
  )
}

export default FooterMenu
