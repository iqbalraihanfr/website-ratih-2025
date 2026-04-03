import Link from 'next/link'
import Image from "next/image"
import type { NavigationItem } from '@/constants'

interface DesktopMenuProps {
  headerData: NavigationItem[]
}

const DesktopMenu = ({ headerData }: DesktopMenuProps) => {
  return (
    <nav className='hidden items-center gap-8 md:flex lg:gap-15'>
      {headerData.map?.((items) => (
        <Link
          key={items?.id}
          href={items?.href}
          className="relative text-zinc-400 transition-colors hover:text-white"
          aria-label={items.isLogo ? (items.altText ?? "Logo Ratih Creative") : items.title}
        >
          {items.isLogo ? (
            <Image
              src={items.logoURL!}
              alt={items.altText ?? "Logo Ratih Creative"}
              width={164}
              height={46}
              priority
              quality={90}
              sizes="(max-width: 1024px) 140px, 164px"
              className='h-auto w-[140px] cursor-pointer object-contain transition-transform hover:scale-[1.03] lg:w-[164px]'
            />
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
