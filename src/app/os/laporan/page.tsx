// src/app/os/laporan/page.tsx
import { TrendingUp } from 'lucide-react';
import React from 'react';

const LaporanPage = () => {
  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <TrendingUp className="w-8 h-8 text-(--color-brand-primary)" />
        <h1 className="text-3xl font-bold text-(--color-text-primary)">
          Laporan Keuangan
        </h1>
      </header>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <p className="text-(--color-dark-primary)">
          Di sini akan ada dashboard analitik, laporan pendapatan, dan pengeluaran.
          Fitur ini hanya dapat diakses oleh Owner.
        </p>
      </div>
    </div>
  );
}

export default LaporanPage;