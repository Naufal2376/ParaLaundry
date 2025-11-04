"use client";
import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import FloatingBackgroundIcons from '@/components/FloatingBackgroundIcons';
import AnimatedBubbles from '@/components/AnimatedBubbles';
import WaveText from '@/components/WaveText';

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="beranda" className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center relative">
      {/* Latar Belakang Ramai: Ikon Melayang & Gelembung */}
      <FloatingBackgroundIcons />
      <AnimatedBubbles />
      
      {/* Efek Denyut di Belakang */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-[--color-brand-primary] rounded-full opacity-10 blur-3xl animate-[--animation-pulse-hero] -z-10" />
      
      <div className="container mx-auto text-center">
        {/* Judul dengan Animasi Ombak */}
        <WaveText text="Solusi Laundry" />
        
        {/* Sub-Judul dengan Gradien Bergerak & Animasi Ketik */}
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
        
        <p className="text-xl text-[--color-dark-primary] mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Cucian bersih, wangi, dan rapi dengan harga terjangkau. Kami siap melayani kebutuhan laundry Anda!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
          <button
            onClick={() => scrollToSection('layanan')}
            className="shine-button bg-[--color-brand-primary] hover:bg-[--color-brand-primary-hover] px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[--color-brand-primary]/40 hover:cursor-pointer"
          >
            Lihat Layanan
          </button>
          <button
            onClick={() => scrollToSection('kontak')}
            className="shine-button bg-white hover:bg-[--color-light-primary-hover] text-[--color-brand-primary] px-8 py-4 rounded-lg font-semibold transition-all duration-300 border-2 border-[--color-brand-primary] hover:cursor-pointer"
          >
            Hubungi Kami
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;