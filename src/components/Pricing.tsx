// src/components/Pricing.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import FloatingBackgroundIcons from '@/components/FloatingBackgroundIcons';
import AnimatedBubbles from '@/components/AnimatedBubbles';

// Daftar harga yang sudah diperbarui
const priceList = [
  { kategori: "Cuci Setrika", harga: "Rp 6.000/kg", estimasi: "2-3 hari" },
  { kategori: "Cuci Lipat", harga: "Rp 5.000/kg", estimasi: "2-3 hari" },
  { kategori: "Cuci Kilat", harga: "Rp 10.000/kg", estimasi: "1 hari" },
  { kategori: "Sepatu", harga: "Rp 15.000/pcs", estimasi: "3 hari" },
  { kategori: "Tas", harga: "Rp 15.000/kg", estimasi: "3 hari" },
  { kategori: "Selimut", harga: "Rp 10.000/kg", estimasi: "3 hari" },
  { kategori: "Ambal", harga: "Rp 10.000/kg", estimasi: "3 hari" },
  { kategori: "Gorden", harga: "Rp 10.000/kg", estimasi: "3 hari" },
  { kategori: "Bed Cover", harga: "Rp 10.000/kg", estimasi: "3 hari" },
  { kategori: "Jas", harga: "Rp 15.000/kg", estimasi: "3 hari" },
  { kategori: "Kebaya", harga: "Rp 15.000/kg", estimasi: "3 hari" },
  { kategori: "Boneka", harga: "Sesuai Ukuran", estimasi: "2-3 hari" },
];

// Varian animasi untuk kontainer <tbody>
const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Setiap baris akan muncul dengan jeda 0.1 detik
    },
  },
};

// Varian animasi untuk setiap baris <tr> (DIPERBAIKI)
const rowVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: 'spring' as const, // <-- DIPERBAIKI: Tambahkan 'as const'
      stiffness: 100 
    }
  },
};

const Pricing = () => {
  return (
    <section id="harga" className="py-20 px-4 bg-gradient-to-b from-white to-(--color-light-primary) relative z-10 overflow-hidden">
      <FloatingBackgroundIcons />
      <AnimatedBubbles />
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-(--color-text-primary) mb-4" data-aos="fade-down">
          Daftar Kategori Layanan
        </h2>
        <p className="text-center text-(--color-dark-primary) mb-12" data-aos="fade-down" data-aos-delay="100">
          Harga terjangkau dengan kualitas terbaik
        </p>
        
        <div className="max-w-5xl mx-auto" data-aos="zoom-in-up">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {priceList.map((item, index) => (
              <motion.div
                key={index}
                variants={rowVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-(--color-light-primary-active) hover:shadow-2xl transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-(--color-text-primary)">{item.kategori}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-(--color-light-primary) text-(--color-brand-primary)">{item.estimasi}</span>
                </div>
                <p className="text-(--color-brand-primary) font-semibold text-lg">{item.harga}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        <p className="text-center text-(--color-dark-primary) mt-6 italic" data-aos="fade-up">
          *Harga dapat berubah sewaktu-waktu.
        </p>
      </div>
    </section>
  );
};

export default Pricing;