"use client"
import Link from 'next/link'
import Image from "next/image"

interface HeaderItem {
  id: number
  href: string
  title?: string
  isLogo: boolean
  logoURL?: string
  altText: string
}

interface MobileMenuProps {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  logoItem: HeaderItem | undefined
  menuItems: HeaderItem[]
}

const MobileMenu = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  logoItem, 
  menuItems 
}: MobileMenuProps) => {
  return (
    <>
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 md:hidden z-40'
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-zinc-900 transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center gap-3 p-4 border-b border-zinc-700'>
          {logoItem && (
            <Image
              src={logoItem.logoURL!}
              alt={logoItem.altText ?? 'Ratih Creative Logo'}
              width={35}
              height={35}
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          )}
          <span className='font-bold text-white text-lg uppercase italic'>
            Ratih Creative
          </span>
        </div>
        <nav className='pt-6 px-4 flex flex-col gap-4'>
          {menuItems.map?.((items) => (
            <Link
              key={items?.id}
              href={items?.href}
              onClick={() => setSidebarOpen(false)}
              className='text-zinc-400 hover:text-white py-2 px-4 rounded hover:bg-zinc-800 transition-colors'
            >
              <span className='font-bold uppercase italic'>
                {items.title}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default MobileMenu