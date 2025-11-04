// src/components/Header.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // DIPERBAIKI: Array navItems ditambahkan di sini
  const navItems = ['Beranda', 'Layanan', 'Lacak', 'Harga', 'Keunggulan', 'Kontak'];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 shadow-lg backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[--color-brand-primary] to-[--color-brand-primary-active] rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-[--color-text-primary]">Para Laundry</span>
          </div>

          {/* Desktop Menu (Sekarang berfungsi) */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => ( // Gunakan array navItems
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-[--color-text-primary] hover:text-[--color-brand-primary] transition-colors duration-300 font-medium hover:cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[--color-text-primary]"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu (Sekarang berfungsi) */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-[--animation-fadeIn]">
            {navItems.map((item) => ( // Gunakan array navItems
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="block w-full text-left px-4 py-2 text-[--color-text-primary] hover:bg-[--color-light-primary-hover] rounded-lg transition-colors"
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