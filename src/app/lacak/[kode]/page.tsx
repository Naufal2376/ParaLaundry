// src/app/lacak/[kode]/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion'; // <-- 1. Impor motion

// --- DATABASE SIMULASI (Tetap sama) ---
const FAKE_DATABASE: { [key: string]: { customer: string; status: string; items: string } } = {
  "PL-123": {
    customer: "Budi Santoso",
    status: "Proses Dicuci",
    items: "Cuci Setrika (5kg), Bed Cover (1pcs)",
  },
  "PL-456": {
    customer: "Citra Lestari",
    status: "Siap Diambil",
    items: "Cuci Kilat (3kg)",
  },
  "PL-789": {
    customer: "Agus Wijaya",
    status: "Selesai",
    items: "Sepatu (2 pasang)",
  },
};
// -------------------------

export default function LacakPage() {
  const params = useParams();
  const kode = Array.isArray(params.kode) ? params.kode[0] : params.kode;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<{ customer: string; status: string; items: string } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!kode) return;
    setLoading(true);
    setError(false);
    
    setTimeout(() => {
      const foundOrder = FAKE_DATABASE[kode.toUpperCase()];
      if (foundOrder) setOrder(foundOrder);
      else setError(true);
      setLoading(false);
    }, 1000); 

  }, [kode]);

  // Varian animasi untuk 'fade up'
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <Loader className="animate-spin text-[--color-brand-primary]" size={48} />
          <p className="mt-4 text-lg text-[--color-dark-primary]">Mencari pesanan Anda...</p>
        </div>
      );
    }

    if (error || !order) {
      return (
        <motion.div 
          className="text-center p-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-red-600 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-[--color-dark-primary]">
            Kode pesanan <span className="font-bold">{kode.toUpperCase()}</span> tidak valid.
          </p>
        </motion.div>
      );
    }

    return (
      // 2. Bungkus "Detail Pesanan" dan "Tracker" dengan motion.div
      // Ini akan membuat mereka muncul berurutan (stagger)
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.2 }} // Beri jeda antar elemen
      >
        {/* Rincian Pesanan (DIPERBAIKI) */}
        <motion.div 
          className="mb-8 p-6 bg-white rounded-xl shadow-lg" 
          variants={fadeUp} // Gunakan animasi fadeUp
        >
          <h3 className="text-lg font-semibold text-[--color-dark-primary]">
            Pelanggan: 
            <span className="text-xl font-bold text-[--color-text-primary]"> {order.customer}</span>
          </h3>
          <p className="text-lg font-semibold text-[--color-dark-primary]">
            Kode: 
            <span className="text-xl font-bold text-[--color-text-primary]"> {kode.toUpperCase()}</span>
          </p>
          <p className="mt-2 text-[--color-dark-primary]">{order.items}</p>
        </motion.div>

        {/* Tracker Status (Sudah menggunakan Framer Motion) */}
        <OrderStatusTracker currentStatus={order.status} />
      </motion.div>
    );
  };

  return (
    <>
      <Header />
      <main className="py-20 px-4 bg-gradient-to-b from-white to-[--color-light-primary] relative z-10 min-h-screen">
        <div className="container mx-auto max-w-2xl">
          {/* 3. Animasikan Judul dengan Framer Motion, HAPUS data-aos */}
          <motion.h1 
            className="text-4xl font-bold text-center text-[--color-text-primary] mb-12" 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Status Pelacakan
          </motion.h1>
          
          <div className="bg-[--color-light-primary]/50 rounded-2xl shadow-xl p-6 md:p-10">
            {renderContent()}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}