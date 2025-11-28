"use client"
import Link from 'next/link'
import Image from 'next/image'
import { headerData } from '@/constants'
import { useState, useEffect } from 'react'
import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'
import { X, Menu } from 'lucide-react'

const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const logoItem = headerData?.find((item) => item.isLogo);
    const menuItems = headerData?.filter((item) => !item.isLogo);
    
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 10) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:justify-center md:gap-15 py-5 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur' 
          : 'bg-transparent'
      }`}>
        <button
          className='md:hidden z-50'
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white cursor-pointer" />
          )}
        </button>

        <DesktopMenu headerData={headerData} />

        {logoItem && (
          <Link
            href={logoItem?.href}
            className='md:hidden'
          >
            <Image
              src={logoItem.logoURL!}
              alt={logoItem.altText ?? 'Ratih Creative Logo'}
              width={40}
              height={40}
            />
          </Link>
        )}
      </header>

      <MobileMenu 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logoItem={logoItem}
        menuItems={menuItems}
      />
    </>
  )
}

export default Header