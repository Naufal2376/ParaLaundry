// src/app/os/page.tsx
import React from 'react';
import StatCard from '@/components/os/StatCard';
import OrderTable from '@/components/os/OrderTable';
import { LuCircle, LuLoader, LuPackageCheck, LuPackageSearch } from "react-icons/lu";

const DashboardPage = () => {
  return (
    <div>
      {/* Header Halaman */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[--color-text-primary]">Dashboard</h1>
          <p className="text-[--color-dark-primary]">Selamat datang, Pegawai!</p>
        </div>
        <button className="flex items-center bg-[--color-brand-primary] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105">
          <LuCircle className="mr-2 text-xl" />
          Buat Transaksi Baru
        </button>
      </header>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<LuLoader className="text-2xl text-yellow-800" />} 
          title="Perlu Dikerjakan" 
          value="5 Pesanan"
          color="bg-yellow-100"
        />
        <StatCard 
          icon={<LuPackageCheck className="text-2xl text-green-800" />} 
          title="Siap Diambil" 
          value="2 Pesanan"
          color="bg-green-100"
        />
        <StatCard 
          icon={<LuPackageSearch className="text-2xl text-blue-800" />} 
          title="Transaksi Hari Ini" 
          value="12 Transaksi"
          color="bg-blue-100"
        />
      </div>

      {/* Tabel Pesanan */}
      <OrderTable />
    </div>
  );
};

export default DashboardPage;