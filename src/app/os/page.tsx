// src/app/os/page.tsx
import React from 'react';
import StatCard from '@/components/os/StatCard';
import OrderTable, { type Order } from '@/components/os/OrderTable'; 
import { FilePlus, Loader, PackageCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

const DashboardPage = async () => {
  const supabase = await createClient();
  
  // --- PERBAIKAN PADA KUERI SELECT ---
  const { data, error } = await supabase
    .from('orders')
    .select(`
      order_id,
      customer_id,
      status_cucian,
      total_biaya,
      status_bayar,
      customer:customers ( nama ) 
    `) // <-- Diubah menjadi 'customer:customers' (alias)
    .order('tanggal_order', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching recent orders:", error.message);
  }
  
  // Tipe data ini sekarang akan cocok dengan 'Order' di OrderTable
  const recentOrders: Order[] = data || [];

  return (
    <div>
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

      {/* Kartu StatCard Anda tetap sama */}
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

      <OrderTable orders={recentOrders} />
    </div>
  );
};

export default DashboardPage;