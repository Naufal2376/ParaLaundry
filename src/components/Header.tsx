// src/components/Header.tsx
import React from 'react';

const Header = () => {
  return (
    // EFEK: Latar belakang semi-transparan dengan efek blur (frosted glass)
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-brand-primary transition-transform hover:scale-105">
              Para Laundry ✨
            </a>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#layanan" className="text-text-primary hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Layanan</a>
              <a href="#harga" className="text-text-primary hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Harga</a>
              <a href="#kontak" className="text-text-primary hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Lokasi</a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;