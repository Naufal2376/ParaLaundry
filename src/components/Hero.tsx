// src/components/Hero.tsx
"use client";
import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import AnimatedIcon from './AnimatedIcon';

const Hero = () => {
  return (
    <section id="hero" className="bg-gradient-to-br from-[--color-light-primary] to-[--color-light-primary-hover] min-h-[90vh] flex items-center py-20 lg:py-0 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Kolom Teks */}
          <div className="text-center md:text-left" data-aos="fade-right">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[--color-text-primary] leading-tight">
              Pakaian Bersih, Hidup Lebih Ringan.
            </h1>
            <div className="mt-4 text-lg sm:text-xl md:text-2xl text-[--color-dark-primary] font-semibold h-8" data-aos-delay="200">
              <TypeAnimation
                sequence={[
                  'Layanan Laundry Kiloan.', 2000,
                  'Layanan Laundry Satuan.', 2000,
                  'Layanan Ekspres 6 Jam.', 2000,
                ]}
                wrapper="span" speed={50} repeat={Infinity}
              />
            </div>
            <p className="mt-6 max-w-xl mx-auto md:mx-0 text-base text-[--color-dark-primary]" data-aos-delay="400">
              Percayakan cucian Anda pada ahlinya. Kami hadir untuk memberikan solusi laundry yang cepat, bersih, dan wangi.
            </p>
            <div className="mt-8" data-aos-delay="600">
              {/* PERBAIKAN: Menambahkan warna teks putih pada tombol */}
              <a href="#harga" className="inline-block bg-[--color-brand-primary] text-[--color-white] font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-[--color-brand-primary-hover] active:bg-[--color-brand-primary-active] transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                Lihat Daftar Harga
              </a>
            </div>
          </div>
          
          {/* Kolom Animasi Ikon */}
          <div className="flex justify-center items-center h-full" data-aos="fade-left" data-aos-delay="300">
            <AnimatedIcon /> 
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;