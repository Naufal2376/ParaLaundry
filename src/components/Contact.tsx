// src/components/Contact.tsx
"use client";
import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import FloatingBackgroundIcons from '@/components/FloatingBackgroundIcons';
import AnimatedBubbles from '@/components/AnimatedBubbles';

const Contact = () => {
  return (
    <section id="kontak" className="py-20 px-4 bg-gradient-to-b from-white to-(--color-light-primary) relative z-10 overflow-hidden">
      <FloatingBackgroundIcons />
      <AnimatedBubbles />
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center text-(--color-text-primary) mb-4" data-aos="fade-down">
          Hubungi Kami
        </h2>
        <p className="text-center text-(--color-dark-primary) mb-12" data-aos="fade-down" data-aos-delay="100">
          Kami siap melayani Anda setiap hari
        </p>
        
        {/* Gunakan 'group' untuk efek hover */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="0">
            <div className="w-16 h-16 bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-active) rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-(--color-brand-primary)/30 transition-all duration-300 group-hover:shadow-xl">
              {/* Ikon beranimasi saat hover */}
              <Phone className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            </div>
            <h3 className="font-bold text-(--color-text-primary) mb-2 text-xl">Telepon</h3>
            <p className="text-(--color-dark-primary)">0812-3456-7890</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="100">
            <div className="w-16 h-16 bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-active) rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-(--color-brand-primary)/30 transition-all duration-300 group-hover:shadow-xl">
              <MapPin className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse" />
            </div>
            <h3 className="font-bold text-(--color-text-primary) mb-2 text-xl">Alamat</h3>
            <p className="text-(--color-dark-primary)">Jl. Sudirman No. 123</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="200">
            <div className="w-16 h-16 bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-active) rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-(--color-brand-primary)/30 transition-all duration-300 group-hover:shadow-xl">
              <Clock className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            </div>
            <h3 className="font-bold text-(--color-text-primary) mb-2 text-xl">Jam Buka</h3>
            <p className="text-(--color-dark-primary)">Senin - Sabtu: 08:00 - 20:00</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;