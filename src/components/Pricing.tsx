// src/components/Pricing.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';

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
    <section id="harga" className="py-20 px-4 bg-gradient-to-b from-white to-(--color-light-primary) relative z-10">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-(--color-text-primary) mb-4" data-aos="fade-down">
          Daftar Harga
        </h2>
        <p className="text-center text-(--color-dark-primary) mb-12" data-aos="fade-down" data-aos-delay="100">
          Harga terjangkau dengan kualitas terbaik
        </p>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden" data-aos="zoom-in-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-(--color-brand-primary) to-(--color-brand-primary-active) text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Kategori Layanan</th>
                  <th className="px-6 py-4 text-left font-semibold">Harga</th>
                  <th className="px-6 py-4 text-left font-semibold">Estimasi</th>
                </tr>
              </thead>
              
              <motion.tbody
                variants={tableVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {priceList.map((item, index) => (
                  <motion.tr
                    key={index}
                    variants={rowVariants}
                    whileHover={{ scale: 1.02 }}
                    className={`border-b border-(--color-light-primary-hover) transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-(--color-light-primary)'
                    } hover:bg-(--color-light-primary-hover) hover:shadow-md`}
                  >
                    <td className="px-6 py-4 text-(--color-text-primary) font-medium">{item.kategori}</td>
                    <td className="px-6 py-4 text-(--color-brand-primary) font-bold">{item.harga}</td>
                    <td className="px-6 py-4 text-(--color-dark-primary)">{item.estimasi}</td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
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