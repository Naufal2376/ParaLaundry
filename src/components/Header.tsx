// src/components/Header.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image'; // <-- 1. Impor Next/Image

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    if (pathname === '/') {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
  };

  const navItems = ['Beranda', 'Layanan', 'Lacak', 'Harga', 'Keunggulan', 'Kontak'];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 shadow-lg backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2" onClick={() => handleNavClick('beranda')} style={{ cursor: 'pointer' }}>
            {/* 2. Ganti <img> dengan <Image /> */}
            <Image 
              src="/ParaLaundry.png" 
              alt="Para Laundry Logo" 
              width={32} 
              height={32}
              className="rounded-md"
            />
            <span className="text-2xl font-bold text-(--color-text-primary)">Para Laundry</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item.toLowerCase())}
                // 3. Hapus hover:cursor-pointer (sudah default)
                className="text-(--color-text-primary) hover:text-(--color-brand-primary) transition-colors duration-300 font-medium"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-(--color-text-primary)"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-[--animation-fadeIn]">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item.toLowerCase())}
                className="block w-full text-left px-4 py-2 text-(--color-text-primary) hover:bg-(--color-light-primary-hover) rounded-lg transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;