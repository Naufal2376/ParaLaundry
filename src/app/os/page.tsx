// src/app/os/page.tsx
import React from 'react';
import StatCard from '@/components/os/StatCard';
import OrderTable, { type Order } from '@/components/os/OrderTable'; 
// Impor ikon baru
import { FilePlus, Loader, PackageCheck, CheckCircle, Wallet, TrendingUp } from 'lucide-react'; 
import { createClient } from '@/lib/supabase/server';

// Fungsi helper untuk rentang waktu (tetap sama)
function getTodayRangeWIB() {
  const now = new Date();
  // Set ke zona waktu WIB (UTC+7)
  const localNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  
  const startOfDay = new Date(localNow);
  startOfDay.setHours(0, 0, 0, 0); // Set ke 00:00 WIB

  const endOfDay = new Date(localNow);
  endOfDay.setHours(23, 59, 59, 999); // Set ke 23:59 WIB

  return {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString(),
  };
}


const DashboardPage = async () => {
  const supabase = await createClient();
  const today = getTodayRangeWIB();
  
  // --- 1. Ambil Peran Pengguna ---
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();
  const role = profile?.role || 'Pegawai';

  // --- 2. Ambil Data Transaksi Terbaru (5) ---
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

  // --- 3. Ambil Data Statistik (Masuk Antrean) ---
  const { count: masukAntreanCount, error: masukAntreanError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Masuk Antrean');

  // --- 4. Ambil Data Statistik (Sedang Dikerjakan) ---
  const { count: sedangDikerjakanCount, error: sedangDikerjakanError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Proses Dicuci');
  
  // --- 5. Ambil Data Statistik (Siap Diambil) ---
  const { count: siapDiambilCount, error: siapDiambilError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Siap Diambil');

  // --- 6. (BARU) Ambil Data Statistik (Selesai Hari Ini) ---
  const { count: selesaiHariIniCount, error: selesaiHariIniError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Selesai')
    .gte('tanggal_order', today.start)
    .lte('tanggal_order', today.end);

  // --- 7. Ambil Data Statistik (Pendapatan Hari Ini) ---
  const { data: pendapatanData, error: pendapatanError } = await supabase
    .from('orders')
    .select('total_biaya')
    .eq('status_bayar', 'Lunas')
    .gte('tanggal_order', today.start)
    .lte('tanggal_order', today.end);
    
  const totalPendapatan = pendapatanData?.reduce((acc, order) => acc + Number(order.total_biaya), 0) || 0;

  // --- 8. (BARU) Ambil Data Statistik (Pengeluaran Hari Ini) ---
  let totalPengeluaran = 0;
  if (role === 'Owner') { // Hanya Owner yang bisa lihat pengeluaran
    const { data: pengeluaranData, error: pengeluaranError } = await supabase
      .from('expenses')
      .select('jumlah')
      .gte('tanggal_pengeluaran', today.start)
      .lte('tanggal_pengeluaran', today.end);
      
    if (pengeluaranError) console.error("Error fetching expenses:", pengeluaranError.message);
    totalPengeluaran = pengeluaranData?.reduce((acc, expense) => acc + Number(expense.jumlah), 0) || 0;
  }
  
  // Tangani error (opsional)
  if (ordersError || masukAntreanError || siapDiambilError || sedangDikerjakanError || pendapatanError || selesaiHariIniError) {
    console.error("Error fetching dashboard data");
  }
  
  const recentOrders: Order[] =
    (recentOrdersData?.map((o: any) => ({
      ...o,
      customer: Array.isArray(o.customer) ? (o.customer[0] ?? null) : (o.customer ?? null),
    })) as Order[]) || [];

  return (
    <div>
      {/* Header Halaman (DIPERBARUI) */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-(--color-text-primary)">Dashboard {role}</h1>
          <p className="text-(--color-dark-primary)">Selamat datang kembali!</p>
        </div>
        {/* Tombol dinamis berdasarkan Peran */}
        {role === 'Owner' ? (
          <a
            href="/os/laporan" // Owner melihat laporan lengkap
            className="shine-button flex items-center bg-(--color-dark-primary) text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            <TrendingUp className="mr-2 text-xl" />
            Lihat Laporan Lengkap
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

      {/* Kartu Statistik (DIPERBARUI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Masuk Antrean" 
          value={`${masukAntreanCount || 0} Pesanan`}
          icon={<Loader className="text-gray-600" />} 
          colorClass="bg-gray-100"
        />
        <StatCard 
          title="Sedang Dikerjakan" 
          value={`${sedangDikerjakanCount || 0} Pesanan`}
          icon={<Loader className="text-yellow-600 animate-spin" />} 
          colorClass="bg-yellow-100"
        />
        <StatCard 
          title="Siap Diambil" 
          value={`${siapDiambilCount || 0} Pesanan`}
          icon={<PackageCheck className="text-green-600" />} 
          colorClass="bg-green-100"
        />
        <StatCard 
          title="Selesai Hari Ini" 
          value={`${selesaiHariIniCount || 0} Pesanan`}
          icon={<CheckCircle className="text-blue-600" />} 
          colorClass="bg-blue-100"
        />
      </div>
      
      {/* Kartu Statistik Keuangan (BARU) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <StatCard 
          title="Pendapatan Hari Ini (Lunas)" 
          value={`Rp ${totalPendapatan.toLocaleString('id-ID')}`}
          icon={<span className="text-green-600 font-bold text-xl">Rp</span>} 
          colorClass="bg-green-100"
        />
        {/* Hanya tampilkan Pengeluaran & Laba untuk Owner */}
        {role === 'Owner' && (
          <>
            <StatCard 
              title="Pengeluaran Hari Ini" 
              value={`Rp ${totalPengeluaran.toLocaleString('id-ID')}`}
              icon={<Wallet className="text-red-600" />} 
              colorClass="bg-red-100"
            />
            <StatCard 
              title="Laba Bersih Hari Ini" 
              value={`Rp ${(totalPendapatan - totalPengeluaran).toLocaleString('id-ID')}`}
              icon={<span className="text-indigo-600 font-bold text-xl">Rp</span>} 
              colorClass="bg-indigo-100"
            />
          </>
        )}
      </div>

      <OrderTable orders={recentOrders} />
    </div>
  );
};

export default DashboardPage;