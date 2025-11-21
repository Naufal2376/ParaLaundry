// src/app/os/page.tsx
import React from 'react';
import StatCard from '@/components/os/StatCard';
import OrderTable, { type Order } from '@/components/os/OrderTable';
import PieChartComponent from '@/components/os/PieChartComponent';
import BarChartComponent from '@/components/os/BarChartComponent';
import { FilePlus, Loader, PackageCheck, CheckCircle, Wallet, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

function getDailyRangeWIB(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const dateString = formatter.format(date); // YYYY-MM-DD in Jakarta time

  const startOfDayInJakarta = new Date(`${dateString}T00:00:00+07:00`);
  const endOfDayInJakarta = new Date(`${dateString}T23:59:59.999+07:00`);

  return {
    start: startOfDayInJakarta.toISOString(),
    end: endOfDayInJakarta.toISOString(),
    name: startOfDayInJakarta.toLocaleDateString('id-ID', { weekday: 'short', timeZone: 'Asia/Jakarta' }),
  };
}

const DashboardPage = async () => {
  const supabase = await createClient();
  const today = getDailyRangeWIB(new Date());
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();
  const role = profile?.role || 'Pegawai';

  const { data: recentOrdersData, error: ordersError } = await supabase
    .from('orders')
    .select(`
      order_id,
      order_code,
      customer_id,
      status_cucian,
      total_biaya,
      status_bayar,
      customer:customers ( nama ) 
    `)
    .order('tanggal_order', { ascending: false })
    .limit(5);

  const { count: masukAntreanCount, error: masukAntreanError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Masuk Antrean');

  const { count: sedangDikerjakanCount, error: sedangDikerjakanError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Proses Dicuci');
  
  const { count: siapDiambilCount, error: siapDiambilError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Siap Diambil');

  const { count: selesaiHariIniCount, error: selesaiHariIniError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Selesai')
    .gte('tanggal_order', today.start)
    .lte('tanggal_order', today.end);

  const { data: pendapatanData, error: pendapatanError } = await supabase
    .from('orders')
    .select('total_biaya')
    .eq('status_bayar', 'Lunas')
    .gte('tanggal_order', today.start)
    .lte('tanggal_order', today.end);
    
  const totalPendapatan = pendapatanData?.reduce((acc, order) => acc + Number(order.total_biaya), 0) || 0;

  let totalPengeluaran = 0;
  if (role === 'Owner') {
    const { data: pengeluaranData, error: pengeluaranError } = await supabase
      .from('expenses')
      .select('jumlah')
      .gte('tanggal_pengeluaran', today.start)
      .lte('tanggal_pengeluaran', today.end);
      
    if (pengeluaranError) console.error("Error fetching expenses:", pengeluaranError.message);
    totalPengeluaran = pengeluaranData?.reduce((acc, expense) => acc + Number(expense.jumlah), 0) || 0;
  }
  
  if (ordersError || masukAntreanError || siapDiambilError || sedangDikerjakanError || pendapatanError || selesaiHariIniError) {
    console.error("Error fetching dashboard data");
  }
  
  const recentOrders: Order[] =
    (recentOrdersData?.map((o: any) => ({
      ...o,
      customer: Array.isArray(o.customer) ? (o.customer[0] ?? null) : (o.customer ?? null),
    })) as Order[]) || [];

  const last7DaysData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayRange = getDailyRangeWIB(d);

    const { data: dailyData, error } = await supabase
      .from('orders')
      .select('total_biaya')
      .eq('status_bayar', 'Lunas')
      .gte('tanggal_order', dayRange.start)
      .lte('tanggal_order', dayRange.end);

    if (error) console.error(`Error fetching data for ${dayRange.start.split('T')[0]}:`, error.message);

    const dailyTotal = dailyData?.reduce((acc, order) => acc + Number(order.total_biaya), 0) || 0;
    last7DaysData.push({
      name: dayRange.name,
      pendapatan: dailyTotal,
    });
  }

  const pieChartData = [
    { name: 'Masuk Antrean', value: masukAntreanCount || 0 },
    { name: 'Dikerjakan', value: sedangDikerjakanCount || 0 },
    { name: 'Siap Diambil', value: siapDiambilCount || 0 },
    { name: 'Selesai Hari Ini', value: selesaiHariIniCount || 0 },
  ];

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">Dashboard {role}</h1>
          <p className="text-(--color-dark-primary)">Selamat datang kembali!</p>
        </div>
        {role === 'Owner' ? (
          <a
            href="/os/laporan"
            className="shine-button flex items-center bg-(--color-dark-primary) text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            <TrendingUp className="mr-2 text-xl" />
            <span className="hidden md:inline">Lihat Laporan Lengkap</span>
            <span className="md:hidden">Laporan</span>
          </a>
        ) : (
          <a
            href="/os/transaksi/baru"
            className="shine-button flex items-center bg-(--color-brand-primary) text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            <FilePlus className="mr-2 text-xl" />
            <span className="hidden md:inline">Buat Transaksi Baru</span>
            <span className="md:hidden">Baru</span>
          </a>
        )}
      </header>

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <StatCard 
          title="Pendapatan Hari Ini (Lunas)" 
          value={`Rp ${totalPendapatan.toLocaleString('id-ID')}`}
          icon={<span className="text-green-600 font-bold text-xl">Rp</span>} 
          colorClass="bg-green-100"
        />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <PieChartComponent data={pieChartData} />
        <BarChartComponent data={last7DaysData} />
      </div>

      <OrderTable orders={recentOrders} userRole={role} />
    </div>
  );
};

export default DashboardPage;