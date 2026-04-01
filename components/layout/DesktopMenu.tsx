import Link from 'next/link'
import Image from "next/image"
import type { NavigationItem } from '@/constants'
import { storageUrl } from '@/lib/storage'

interface DesktopMenuProps {
  headerData: NavigationItem[]
}

const DesktopMenu = ({ headerData }: DesktopMenuProps) => {
  return (
    <nav className='hidden md:flex items-center gap-15'>
      {headerData.map?.((items) => (
        <Link
          key={items?.id}
          href={items?.href}
          className={`text-zinc-400 hover:text-white relative group`}
        >
          {items.isLogo ? (
            <Image
              src={storageUrl(items.logoURL!)}
              alt={items.altText ?? "Logo Ratih Creative"}
              width={50}
              height={50}
              className='hover:scale-105 transition-all cursor-pointer'
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          ) : (
            <span className='font-bold uppercase italic transition-all'>
              {items.title}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

export default DesktopMenu
