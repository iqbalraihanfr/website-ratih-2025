"use client"
import Link from 'next/link'
import Image from "next/image"
import type { NavigationItem } from '@/constants'

interface MobileMenuProps {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  logoItem: NavigationItem | undefined
  menuItems: NavigationItem[]
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
          className='fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        id="mobile-navigation"
        className={`fixed top-0 left-0 z-50 flex h-dvh w-[min(82vw,20rem)] flex-col overflow-y-auto bg-zinc-900 shadow-2xl transition-transform duration-300 ease-out overscroll-contain md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center gap-3 border-b border-zinc-700 px-4 py-4'>
          {logoItem && (
            <Image
              src={logoItem.compactLogoURL ?? logoItem.logoURL!}
              alt={logoItem.altText ?? 'Ratih Creative Logo'}
              width={35}
              height={35}
              priority
              quality={90}
              sizes="35px"
              className="h-[35px] w-[35px] object-contain"
            />
          )}
          <span className='font-bold text-white text-lg uppercase italic'>
            Ratih Creative
          </span>
        </div>
        <nav className='flex flex-col gap-2 px-4 py-6'>
          {menuItems.map?.((items) => (
            <Link
              key={items?.id}
              href={items?.href}
              onClick={() => setSidebarOpen(false)}
              className='rounded-xl px-4 py-3 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white'
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
