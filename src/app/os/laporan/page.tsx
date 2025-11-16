// src/app/os/laporan/page.tsx
import { TrendingUp, Wallet } from 'lucide-react';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import PeriodSelector from '../../../components/os/PeriodSelector';
import BarChartComponent from '@/components/os/BarChartComponent';
import PieChartComponent from '@/components/os/PieChartComponent';
import StatCard from '@/components/os/StatCard';
import { redirect } from 'next/navigation';

// Type untuk search params pada Next.js 15:
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type Period = 'hari' | 'minggu' | 'bulan' | 'tahun';

interface LaporanPageProps {
  searchParams: SearchParams;
}

function getPeriodRangeWIB(period: Period) {
  const now = new Date();
  const localNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const start = new Date(localNow);

  if (period === 'hari') {
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else if (period === 'minggu') {
    start.setDate(start.getDate() - 27);
    start.setHours(0, 0, 0, 0);
  } else if (period === 'bulan') {
    start.setMonth(start.getMonth() - 11);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else { // tahun
    start.setFullYear(start.getFullYear() - 4);
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  }

  const end = new Date(localNow);
  end.setHours(23, 59, 59, 999);

  return { start: start.toISOString(), end: end.toISOString() };
}

export default async function LaporanPage({ searchParams }: LaporanPageProps) {
  const resolvedParams = await searchParams;
  const period: Period = (resolvedParams?.period as Period) || "bulan";

  const supabase = await createClient();
  
  // Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'Owner') redirect('/os');

  const { start, end } = getPeriodRangeWIB(period);

  // Pendapatan (orders Lunas)
  const { data: incomeRows, error: incomeError } = await supabase
    .from('orders')
    .select('total_biaya, tanggal_order')
    .eq('status_bayar', 'Lunas')
    .gte('tanggal_order', start)
    .lte('tanggal_order', end);

  const income = (incomeRows || []).reduce((acc, r) => acc + Number(r.total_biaya || 0), 0);
  if (incomeError) console.error("Error Pendapatan:", incomeError.message);

  // Pengeluaran
  const { data: expenseRows, error: expenseError } = await supabase
    .from('expenses')
    .select('jumlah, tanggal_pengeluaran')
    .gte('tanggal_pengeluaran', start)
    .lte('tanggal_pengeluaran', end);

  const expense = (expenseRows || []).reduce((acc, r) => acc + Number(r.jumlah || 0), 0);
  if (expenseError) console.error("Error Pengeluaran:", expenseError.message);

  const profit = income - expense;

  // Status Operasional Count
  const { count: masukAntreanCount } = await supabase
    .from('orders').select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Masuk Antrean');

  const { count: prosesDicuciCount } = await supabase
    .from('orders').select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Proses Dicuci');

  const { count: siapDiambilCount } = await supabase
    .from('orders').select('*', { count: 'exact', head: true })
    .eq('status_cucian', 'Siap Diambil');

  function getWeekStartDate(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }

  function bucketKey(d: string, p: Period) {
    const dt = new Date(d);
    if (p === 'hari') {
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    } else if (p === 'minggu') {
      const weekStart = getWeekStartDate(dt);
      return `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
    } else if (p === 'bulan') {
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    } else { // tahun
      return `${dt.getFullYear()}`;
    }
  }

  const incomeBuckets: Record<string, number> = {};
  const expenseBuckets: Record<string, number> = {};
  const allKeys = new Set<string>();

  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));

  if (period === 'hari') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = bucketKey(d.toISOString(), 'hari');
      allKeys.add(key);
      incomeBuckets[key] = 0;
      expenseBuckets[key] = 0;
    }
  } else if (period === 'minggu') {
    for (let i = 3; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i * 7);
      const key = bucketKey(d.toISOString(), 'minggu');
      allKeys.add(key);
      incomeBuckets[key] = 0;
      expenseBuckets[key] = 0;
    }
  } else if (period === 'bulan') {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = bucketKey(d.toISOString(), 'bulan');
      allKeys.add(key);
      incomeBuckets[key] = 0;
      expenseBuckets[key] = 0;
    }
  } else if (period === 'tahun') {
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today.getFullYear() - i, 0, 1);
      const key = bucketKey(d.toISOString(), 'tahun');
      allKeys.add(key);
      incomeBuckets[key] = 0;
      expenseBuckets[key] = 0;
    }
  }

  (incomeRows || []).forEach((r) => {
    const k = bucketKey(r.tanggal_order, period);
    if (k in incomeBuckets) {
      incomeBuckets[k] = (incomeBuckets[k] || 0) + Number(r.total_biaya || 0);
    }
  });

  (expenseRows || []).forEach((r) => {
    const k = bucketKey(r.tanggal_pengeluaran, period);
    if (k in expenseBuckets) {
      expenseBuckets[k] = (expenseBuckets[k] || 0) + Number(r.jumlah || 0);
    }
  });
  
  const sortedKeys = Array.from(allKeys).sort();

  const barChartData = sortedKeys.map(k => ({
    name: k,
    pendapatan: incomeBuckets[k] || 0,
    pengeluaran: expenseBuckets[k] || 0,
  }));

  const pieChartData = [
    { name: 'Masuk Antrean', value: masukAntreanCount || 0 },
    { name: 'Dikerjakan', value: prosesDicuciCount || 0 },
    { name: 'Siap Diambil', value: siapDiambilCount || 0 },
  ];

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <TrendingUp className="w-8 h-8 text-[--color-brand-primary]" />
        <h1 className="text-2xl md:text-3xl font-bold text-[--color-text-primary]">
          Laporan Keuangan
        </h1>
      </header>

      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="mb-6 max-w-md">
          <PeriodSelector period={period} />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title={`Pendapatan (${period})`} 
            value={`Rp ${income.toLocaleString('id-ID')}`}
            icon={<span className="text-green-600 font-bold text-xl">Rp</span>} 
            colorClass="bg-green-100"
          />
          <StatCard 
            title={`Pengeluaran (${period})`} 
            value={`Rp ${expense.toLocaleString('id-ID')}`}
            icon={<Wallet className="text-red-600" />} 
            colorClass="bg-red-100"
          />
          <StatCard 
            title={`Laba Bersih (${period})`} 
            value={`Rp ${profit.toLocaleString('id-ID')}`}
            icon={<span className={`font-bold text-xl ${profit >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>Rp</span>} 
            colorClass={profit >= 0 ? "bg-indigo-100" : "bg-red-100"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BarChartComponent data={barChartData} />
          </div>
          <div>
            <PieChartComponent data={pieChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
