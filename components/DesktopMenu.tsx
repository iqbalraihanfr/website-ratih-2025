import Link from 'next/link'
import Image from 'next/image'

interface HeaderItem {
  id: number
  href: string
  title?: string
  isLogo: boolean
  logoURL?: string
  altText: string
}

interface DesktopMenuProps {
  headerData: HeaderItem[]
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
              src={items.logoURL!}
              alt={items.altText}
              width={50}
              height={50}
            />
          ) : (
            <span className='font-bold uppercase italic transition-all'>
              {items.title}
            </span>
          )}
        </Link>
      ))}
    </nav>
  )
}

export default DesktopMenu