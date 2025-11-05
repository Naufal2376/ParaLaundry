// src/app/os/page.tsx
import React from 'react';
import StatCard from '@/components/os/StatCard';
import OrderTable, { type Order } from '@/components/os/OrderTable'; 
import { FilePlus, Loader, PackageCheck, Wallet } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

// Fungsi helper untuk mendapatkan awal dan akhir hari (WIB)
function getTodayRangeWIB() {
  const now = new Date();
  // Set ke zona waktu WIB (UTC+7)
  now.setUTCHours(now.getUTCHours() + 7);

  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0); // Set ke 00:00 WIB

  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999); // Set ke 23:59 WIB

  return {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString(),
  };
}


const DashboardPage = async () => {
  const supabase = await createClient();
  const today = getTodayRangeWIB();
  // Ambil role user
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();
  const role = profile?.role || 'Pegawai';

  // --- 1. Ambil Data Transaksi Terbaru (5) ---
  const { data: recentOrdersData, error: ordersError } = await supabase
    .from('orders')
    .select(`
      order_id,
      customer_id,
      status_cucian,
      total_biaya,
      status_bayar,
      customer:customers ( nama ) 
    `)
    .order('tanggal_order', { ascending: false })
    .limit(5);

  // --- 2. Ambil Data Statistik (Perlu Dikerjakan) ---
  const { count: perluDikerjakanCount, error: perluDikerjakanError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true }) // 'head: true' agar lebih cepat
    .in('status_cucian', ['Masuk Antrean', 'Proses Dicuci']);

  // --- 3. Ambil Data Statistik (Siap Diambil) ---
  const { count: siapDiambilCount, error: siapDiambilError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Siap Diambil');

  // --- 3b. Ambil Data Statistik (Sedang Dikerjakan) ---
  const { count: sedangDikerjakanCount, error: sedangDikerjakanError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Proses Dicuci');

  // --- 4. Ambil Data Statistik (Pendapatan Hari Ini) ---
  const { data: pendapatanData, error: pendapatanError } = await supabase
    .from('orders')
    .select('total_biaya')
    .eq('status_bayar', 'Lunas')
    .gte('tanggal_order', today.start)
    .lte('tanggal_order', today.end);
    
  // Hitung total pendapatan
  const totalPendapatan = pendapatanData?.reduce((acc, order) => acc + Number(order.total_biaya), 0) || 0;

  // Tangani error
  if (ordersError || perluDikerjakanError || siapDiambilError || sedangDikerjakanError || pendapatanError) {
    console.error("Error fetching dashboard data");
  }
  
  const recentOrders: Order[] =
    (recentOrdersData?.map((o: any) => ({
      ...o,
      customer: Array.isArray(o.customer) ? (o.customer[0] ?? null) : (o.customer ?? null),
    })) as Order[]) || [];

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-(--color-text-primary)">Dashboard Pegawai</h1>
          <p className="text-(--color-dark-primary)">Selamat datang kembali!</p>
        </div>
        {role === 'Owner' ? (
          <a
            href="/os/pengeluaran"
            className="shine-button flex items-center bg-(--color-brand-primary) text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            <Wallet className="mr-2 text-xl" />
            Tambah Pengeluaran
          </a>
        ) : (
          <a
            href="/os/transaksi/baru"
            className="shine-button flex items-center bg-(--color-brand-primary) text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            <FilePlus className="mr-2 text-xl" />
            Buat Transaksi Baru
          </a>
        )}
      </header>

      {/* Kartu Statistik (Sudah Dinamis) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Perlu Dikerjakan" 
          value={`${perluDikerjakanCount || 0} Pesanan`}
          icon={<Loader className="text-yellow-600" />} 
          colorClass="bg-yellow-100"
        />
        <StatCard 
          title="Sedang Dikerjakan" 
          value={`${sedangDikerjakanCount || 0} Pesanan`}
          icon={<Loader className="text-blue-600" />} 
          colorClass="bg-blue-100"
        />
        <StatCard 
          title="Siap Diambil" 
          value={`${siapDiambilCount || 0} Pesanan`}
          icon={<PackageCheck className="text-green-600" />} 
          colorClass="bg-green-100"
        />
        <StatCard 
          title="Pendapatan Hari Ini (Lunas)" 
          value={`Rp ${totalPendapatan.toLocaleString('id-ID')}`}
          icon={<span className="text-blue-600 font-bold text-xl">Rp</span>} 
          colorClass="bg-blue-100"
        />
      </div>

      <OrderTable orders={recentOrders} />
    </div>
  );
};

export default DashboardPage;