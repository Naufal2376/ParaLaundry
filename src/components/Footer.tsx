// src/components/Footer.tsx
"use client"
import React from 'react';
// Tambahkan ikon sosial media
import { Sparkles, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

const Footer = () => {
  const navItems = ['Beranda', 'Layanan', 'Lacak', 'Harga', 'Keunggulan', 'Kontak'];
  const socialIcons = [
    { icon: <Instagram size={20} />, href: '#' },
    { icon: <Facebook size={20} />, href: '#' },
    { icon: <Twitter size={20} />, href: '#' },
    { icon: <MessageCircle size={20} />, href: '#' }, // Untuk WhatsApp
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // SINTAKS BENAR: Menggunakan from-(--color-...)
    <footer className="bg-gradient-to-r from-(--color-text-primary) to-(--color-dark-active) text-white py-12 px-4 relative z-10">
      <div className="container mx-auto text-center">
        
        {/* 1. Logo dengan Ikon Beranimasi */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          {/* SINTAKS BENAR: Menggunakan bg-(--color-...) */}
          <div className="w-8 h-8 bg-(--color-brand-primary) rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 animate-pulse text-white" />
          </div>
          <span className="text-xl font-bold">Para Laundry</span>
        </div>

        {/* 2. Tautan Navigasi Cepat (BARU) */}
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 my-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              // SINTAKS BENAR: Menggunakan text-(--color-...)
              className="text-(--color-light-primary-active) hover:text-(--color-brand-primary) transition-colors duration-300 bg-transparent border-none"
            >
              {item}
            </button>
          ))}
        </div>

        {/* 3. Ikon Sosial Media (BARU) */}
        <div className="flex justify-center space-x-6 mb-8">
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              // SINTAKS BENAR: Menggunakan text-(--color-...)
              className="text-(--color-light-primary-active) hover:text-white hover:scale-125 transition-all duration-300"
            >
              {social.icon}
            </a>
          ))}
        </div>
        
        {/* Copyright */}
        {/* SINTAKS BENAR: Menggunakan text-(--color-...)/80 */}
        <p className="text-(--color-light-primary-active)/80 text-sm">
          © {new Date().getFullYear()} Para Laundry. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;