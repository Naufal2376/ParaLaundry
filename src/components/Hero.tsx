// src/components/Hero.tsx
"use client";
import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import FloatingBackgroundIcons from '@/components/FloatingBackgroundIcons';
import AnimatedBubbles from '@/components/AnimatedBubbles';
import WaveText from '@/components/WaveText';
import AnimatedIcon from './AnimatedIcon';

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="beranda" className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Latar Belakang Ramai (Tetap ada) */}
      <FloatingBackgroundIcons />
      <AnimatedBubbles />
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Kolom Kiri: Teks */}
          {/* DIPERBAIKI: 'md:text-left' dihapus di sini */}
          <div className="text-center z-10" data-aos="fade-right">
            <WaveText text="Solusi Laundry" />
            
            <span className="block text-5xl md:text-7xl font-bold gradient-text mt-2 h-20">
              <TypeAnimation
                sequence={[
                  'Terpercaya', 2000,
                  'Tercepat', 2000,
                  'Terbersih', 2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span>
            
            {/* DIPERBAIKI: 'md:mx-0' dihapus agar paragraf juga center */}
            <p className="text-xl text-(--color-dark-primary) mb-8 max-w-xl mx-auto" data-aos-delay="200">
              Cucian bersih, wangi, dan rapi dengan harga terjangkau. Kami siap melayani kebutuhan laundry Anda!
            </p>
            
            {/* DIPERBAIKI: 'md:justify-start' dihapus agar tombol center */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos-delay="400">
              <button
                onClick={() => scrollToSection('lacak')}
                className="shine-button text-white bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-(--color-brand-primary)/40"
              >
                Lacak Pesanan
              </button>
              <button
                onClick={() => scrollToSection('layanan')}
                className="shine-button bg-white hover:bg-(--color-light-primary-hover) text-(--color-brand-primary) px-8 py-4 rounded-lg font-semibold transition-all duration-300 border-2 border-(--color-brand-primary)"
              >
                Lihat Layanan
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Animasi Ikon */}
          <div className="flex justify-center items-center z-10" data-aos="fade-left" data-aos-delay="200">
            <AnimatedIcon />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;