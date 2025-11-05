// src/components/Footer.tsx
"use client";
import React from 'react';
// Ikon untuk Logo, Kontak, dan Sosial Media
import { Sparkles, Facebook, Instagram, Twitter, MessageCircle, MapPin, Phone, Clock } from 'lucide-react';

const Footer = () => {
  const navItems = ['Beranda', 'Layanan', 'Lacak', 'Harga', 'Keunggulan'];
  const socialIcons = [
    { icon: <Instagram size={20} />, href: '#' },
    { icon: <Facebook size={20} />, href: '#' },
    { icon: <Twitter size={20} />, href: '#' },
    { icon: <MessageCircle size={20} />, href: '#' }, // Untuk WhatsApp
  ];

  // Fungsi untuk scroll ke section (navigasi bisa dipencet)
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // DIPERBAIKI: Padding dikurangi (py-12) agar tidak terlalu tinggi
    <footer className="bg-gradient-to-r from-(--color-text-primary) to-(--color-dark-active) text-white py-12 px-4 relative z-10">
      <div className="container mx-auto">
        
        {/* BARU: Layout 3 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Kolom 1: Navigasi */}
          <div>
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-(--color-brand-primary) rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse text-white" />
              </div>
              <span className="text-xl font-bold">Para Laundry</span>
            </div>
            
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-(--color-light-primary-active) hover:text-white hover:cursor-pointer transition-colors duration-300"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 2: Hubungi Kami (Digabung) */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-(--color-light-primary-active)">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Jl. Indralaya-Prabumulih Indralaya, Ogan Ilir, Sumatera Selatan <br />
                (Pertokoan Amanah Depan UNSRI)</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-1 flex-shrink-0" />
                <span>0813-7777-1420</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-1 flex-shrink-0" />
                <span>Senin - Minggu: 08:00 - 20:00</span>
              </li>
            </ul>
            {/* Ikon Sosial Media */}
            <div className="flex space-x-4 mt-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--color-light-primary-active) hover:text-white hover:scale-125 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Kolom 3: Lokasi & Sosial Media */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Lokasi Kami</h4>
            {/* Ganti 'q=' dengan alamat Anda untuk pin yang akurat */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.561161404419!2d104.64730337372316!3d-3.209271340749092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3bbdc16ddbddd9%3A0x30316d636eaf6ccd!2sPARA%20LAUNDRY!5e0!3m2!1sid!2sid!4v1762359866146!5m2!1sid!2sid"
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg opacity-90"
            ></iframe>
            
            
          </div>

        </div>

        {/* Garis Pemisah & Copyright */}
        <hr className="my-8 border-white/20" />
        <p className="text-(--color-light-primary-active)/80 text-sm text-center">
          © {new Date().getFullYear()} Para Laundry. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;