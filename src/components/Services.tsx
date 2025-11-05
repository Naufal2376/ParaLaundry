// src/components/Services.tsx
"use client"; // <-- BARU: Wajib untuk Framer Motion
import React from 'react';
import { motion } from 'framer-motion'; // <-- BARU: Impor motion
import { Shirt, Sparkles, Zap, BedDouble, ShoppingBag, Footprints } from 'lucide-react';
import FloatingBackgroundIcons from '@/components/FloatingBackgroundIcons';
import AnimatedBubbles from '@/components/AnimatedBubbles';

// Daftar layanan (tetap sama)
const services = [
  { 
    icon: <Shirt className="w-12 h-12" />, 
    title: "Cuci Setrika", 
    desc: "Layanan cuci, kering, dan setrika rapi untuk pakaian harian Anda.", 
    price: "Rp 6.000/kg" 
  },
  { 
    icon: <Sparkles className="w-12 h-12" />, 
    title: "Cuci Kilat", 
    desc: "Pakaian Anda bersih dan wangi dalam hitungan jam.", 
    price: "Rp 10.000/kg" 
  },
  { 
    icon: <BedDouble className="w-12 h-12" />, 
    title: "Bed Cover", 
    desc: "Perawatan khusus untuk bed cover agar bersih dan higienis.", 
    price: "Rp 10.000/kg" 
  },
  { 
    icon: <Footprints className="w-12 h-12" />, 
    title: "Sepatu", 
    desc: "Membersihkan sepatu Anda agar terlihat seperti baru kembali.", 
    price: "Rp 15.000/pcs" 
  },
  { 
    icon: <ShoppingBag className="w-12 h-12" />, 
    title: "Tas", 
    desc: "Perlakukan tas kesayangan Anda dengan pembersihan profesional.", 
    price: "Rp 15.000/kg" 
  },
  { 
    icon: <Zap className="w-12 h-12" />, 
    title: "Layanan Lain", 
    desc: "Kami juga melayani Jas, Kebaya, Boneka, Gorden, dan lainnya.", 
    price: "Hubungi Kami" 
  }
];

const Services = () => {
  return (
    <section id="layanan" className="py-20 px-4 bg-white relative z-10 overflow-hidden">
      <FloatingBackgroundIcons />
      <AnimatedBubbles />
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-(--color-text-primary) mb-4" data-aos="fade-down">
          Layanan Kami
        </h2>
        <p className="text-center text-(--color-dark-primary) mb-12 max-w-2xl mx-auto" data-aos="fade-down" data-aos-delay="100">
          Pilih layanan yang sesuai dengan kebutuhan Anda
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
              className="service-card group" 
            >
              {/* Dekorasi Sudut */}
              <span className="corner-deco top-0 left-0 border-t-2 border-l-2 rounded-tl-xl" />
              <span className="corner-deco top-0 right-0 border-t-2 border-r-2 rounded-tr-xl" />
              <span className="corner-deco bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl" />
              <span className="corner-deco bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl" />

              {/* Konten Kartu */}
              <div className="relative z-20">
                
                {/* --- PERUBAHAN DI SINI --- */}
                {/* Ikon dibungkus dengan motion.div untuk animasi hover */}
                <motion.div
                  className="text-(--color-brand-primary) mb-4"
                  // Saat di-hover oleh 'group' (kartu), ikon akan beranimasi
                  whileHover={{ 
                    scale: 1.25, 
                    rotate: [0, 10, -10, 10, 0], // Efek bergoyang/jiggle
                  }}
                  transition={{ 
                    duration: 0.5, 
                    ease: "easeInOut" 
                  }}
                >
                  {service.icon}
                </motion.div>
                {/* --- AKHIR PERUBAHAN --- */}
                
                <h3 className="text-2xl font-bold text-(--color-text-primary) mb-3">
                  {service.title}
                </h3>
                <p className="text-(--color-dark-primary) mb-4">
                  {service.desc}
                </p>
                {service.title === "Layanan Lain" ? (
                  <a
                    href="#harga"
                    className="inline-block mt-2 px-4 py-2 rounded-lg border-2 border-(--color-brand-primary) text-(--color-brand-primary) font-semibold hover:bg-(--color-light-primary-hover) transition-colors"
                  >
                    Lihat Daftar Harga
                  </a>
                ) : (
                  <p className="text-(--color-brand-primary) font-semibold text-lg">
                    {service.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;