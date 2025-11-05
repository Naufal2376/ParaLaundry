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
    <footer className="bg-gradient-to-r from-(--color-text-primary) to-(--color-dark-active) text-white py-16 px-4 relative z-10">
      <div className="container mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-(--color-brand-primary) rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 animate-pulse text-white" />
          </div>
          <span className="text-xl font-bold">Para Laundry</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Navigasi */}
          <div>
            <h4 className="font-semibold mb-3">Navigasi</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-(--color-light-primary-active) hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold mb-3">Kontak</h4>
            <ul className="space-y-2 text-(--color-light-primary-active)">
              <li>Jl. Contoh Alamat No. 123, Kota</li>
              <li>Telp: 0812-3456-7890</li>
              <li>WhatsApp: 0812-3456-7890</li>
              <li>Email: halo@paralaundry.id</li>
            </ul>
          </div>

          {/* Sosial Media */}
          <div>
            <h4 className="font-semibold mb-3">Ikuti Kami</h4>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--color-light-primary-active) hover:text-white hover:scale-110 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="text-(--color-light-primary-active)/80 text-sm mt-10">
          © {new Date().getFullYear()} Para Laundry. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;