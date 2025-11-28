import { footerData } from "@/constants"
import Link from "next/link"

const FooterMenu = () => {
  return (
    <div className="footermenu flex flex-row gap-10">
        {footerData.map((menu) => (
            <Link 
            key={menu.id}
            href={menu.href}
            >
            <span className="font-bold uppercase italic text-zinc-400 hover:text-white transition-all">{menu.title}</span>
            </Link>
        ))}
    </div>
  )
}

export default FooterMenu