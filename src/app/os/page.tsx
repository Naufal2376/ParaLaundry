// src/app/os/page.tsx
"use client"
import React from 'react';
import StatCard from '@/components/os/StatCard';
import OrderTable from '@/components/os/OrderTable';
import { FilePlus, Loader, PackageCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  return (
    // Gunakan motion.div untuk animasi fade-in sederhana saat halaman dimuat
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Halaman */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-(--color-text-primary)">Dashboard Pegawai</h1>
          <p className="text-(--color-dark-primary)">Selamat datang kembali!</p>
        </div>
        <a
          href="/os/transaksi/baru"
          className="shine-button flex items-center bg-(--color-brand-primary) text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
        >
          <FilePlus className="mr-2 text-xl" />
          Buat Transaksi Baru
        </a>
      </header>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Perlu Dikerjakan" 
          value="2 Pesanan"
          icon={<Loader className="text-yellow-600" />} 
          colorClass="bg-yellow-100"
        />
        <StatCard 
          title="Siap Diambil" 
          value="1 Pesanan"
          icon={<PackageCheck className="text-green-600" />} 
          colorClass="bg-green-100"
        />
        <StatCard 
          title="Total Pendapatan Hari Ini" 
          value="Rp 56.000"
          icon={<span className="text-blue-600 font-bold text-xl">Rp</span>} 
          colorClass="bg-blue-100"
        />
      </div>

      {/* Tabel Pesanan */}
      <OrderTable />
    </motion.div>
  );
};

export default DashboardPage;