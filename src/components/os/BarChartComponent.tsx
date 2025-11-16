// src/components/os/BarChartComponent.tsx
"use client";
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// 1. Perbarui interface data untuk menerima pengeluaran
interface BarChartData {
  name: string;      // Ini akan jadi tanggal/hari
  pendapatan: number;
  pengeluaran?: number; // Pengeluaran bersifat opsional
}

// Helper untuk format Rupiah
const formatRupiah = (value: number) => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};

const BarChartComponent = ({ data }: { data: BarChartData[] }) => {
  return (
    // Beri tinggi tetap agar tidak terlalu kecil
    <div className="bg-white p-4 rounded-lg shadow h-[400px]"> 
      <h3 className="text-lg font-semibold mb-4 text-(--color-text-primary)">
        Grafik Pendapatan {data[0]?.pengeluaran !== undefined ? 'vs Pengeluaran' : ''}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          // Tambahkan margin agar label tidak terpotong
          margin={{ top: 5, right: 20, left: 10, bottom: 60 }} 
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          
          {/* 2. Penjelasan sumbu X (Tanggal) */}
          <XAxis 
            dataKey="name" 
            angle={-45} // Putar label agar muat
            textAnchor="end" // Ratakan ke kanan
            height={70} // Beri ruang lebih untuk label miring
            interval={0} // Tampilkan semua label
            tick={{ fontSize: 12, fill: 'var(--color-dark-primary)' }} 
          />
          
          {/* 3. Penjelasan sumbu Y (Nominal Rupiah) */}
          <YAxis 
            tickFormatter={formatRupiah} // Format angka sebagai Rupiah
            tick={{ fontSize: 12, fill: 'var(--color-dark-primary)' }}
          />
          
          <Tooltip formatter={(value: number) => formatRupiah(value)} />
          <Legend wrapperStyle={{ paddingTop: '40px' }} />
          
          {/* 4. Batang untuk Pendapatan & Pengeluaran */}
          <Bar dataKey="pendapatan" fill="var(--color-brand-primary)" name="Pendapatan" />
          {/* Hanya tampilkan batang pengeluaran jika datanya ada */}
          {data[0]?.pengeluaran !== undefined && (
            <Bar dataKey="pengeluaran" fill="#ef4444" name="Pengeluaran" /> // Warna merah
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;