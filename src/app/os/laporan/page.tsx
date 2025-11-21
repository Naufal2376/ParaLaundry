// src/app/os/laporan/page.tsx
import { TrendingUp, Wallet } from 'lucide-react';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import PeriodSelector from '../../../components/os/PeriodSelector';
import BarChartComponent from '@/components/os/BarChartComponent';
import StatCard from '@/components/os/StatCard';
import { redirect } from 'next/navigation';

// Type untuk search params pada Next.js 15:
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type Period = 'hari' | 'minggu' | 'bulan' | 'tahun';

interface LaporanPageProps {
  searchParams: SearchParams;
}

function getPeriodRange(period: Period) {
  const now = new Date();
  const start = new Date(now);

  if (period === 'hari') {
    start.setDate(start.getDate() - 6);
  } else if (period === 'minggu') {
    start.setDate(start.getDate() - (4 * 7 - 1)); // 4 weeks
  } else if (period === 'bulan') {
    start.setMonth(start.getMonth() - 11);
    start.setDate(1);
  } else { // tahun
    start.setFullYear(start.getFullYear() - 4);
    start.setMonth(0, 1);
  }
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export default async function LaporanPage({ searchParams }: LaporanPageProps) {
  const resolvedParams = await searchParams;
  const period: Period = (resolvedParams?.period as Period) || "bulan";
  const fromDate = resolvedParams?.from as string;
  const toDate = resolvedParams?.to as string;

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

  let start: Date, end: Date;
  let activePeriod: Period | 'custom';
  let titlePeriod: string = period.charAt(0).toUpperCase() + period.slice(1);

  if (fromDate && toDate) {
    start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);
    end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    activePeriod = 'custom';
    const fromFormatted = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const toFormatted = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    titlePeriod = `${fromFormatted} - ${toFormatted}`;
  } else {
    const range = getPeriodRange(period);
    start = range.start;
    end = range.end;
    activePeriod = period;
  }
  
  const startISO = start.toISOString();
  const endISO = end.toISOString();

  // Pendapatan (orders Lunas)
  const { data: incomeRows, error: incomeError } = await supabase
    .from('orders')
    .select('total_biaya, tanggal_order')
    .eq('status_bayar', 'Lunas')
    .gte('tanggal_order', startISO)
    .lte('tanggal_order', endISO);

  const income = (incomeRows || []).reduce((acc, r) => acc + Number(r.total_biaya || 0), 0);
  if (incomeError) console.error("Error Pendapatan:", incomeError.message);

  // Pengeluaran
  const { data: expenseRows, error: expenseError } = await supabase
    .from('expenses')
    .select('jumlah, tanggal_pengeluaran')
    .gte('tanggal_pengeluaran', startISO)
    .lte('tanggal_pengeluaran', endISO);

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
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  function bucketKey(d: string, p: Period | 'day-in-custom') {
    const dt = new Date(d);
    if (p === 'hari' || p === 'day-in-custom') {
      return dt.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    } else if (p === 'minggu') {
      const weekStart = getWeekStartDate(dt);
      return `W${weekStart.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}`;
    } else if (p === 'bulan') {
      return dt.toLocaleDateString('id-ID', { year: '2-digit', month: 'short' });
    } else { // tahun
      return dt.getFullYear().toString();
    }
  }

  const incomeBuckets: Record<string, number> = {};
  const expenseBuckets: Record<string, number> = {};
  const allKeys = new Set<string>();

  // Determine bucketing strategy for charts
  let chartBucketStrategy: Period | 'day-in-custom' = activePeriod as Period;
  if (activePeriod === 'custom') {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    chartBucketStrategy = diffDays > 31 ? 'bulan' : 'day-in-custom';
  }

  // Initialize buckets based on the range and strategy
  let current = new Date(start);
  while (current <= end) {
    const key = bucketKey(current.toISOString(), chartBucketStrategy);
    allKeys.add(key);
    incomeBuckets[key] = 0;
    expenseBuckets[key] = 0;

    if (chartBucketStrategy === 'day-in-custom') {
      current.setDate(current.getDate() + 1);
    } else if (chartBucketStrategy === 'bulan') {
      current.setMonth(current.getMonth() + 1);
    } else {
       current.setDate(current.getDate() + 1);
    }
  }

  (incomeRows || []).forEach((r) => {
    const k = bucketKey(r.tanggal_order, chartBucketStrategy);
    if (k in incomeBuckets) {
      incomeBuckets[k] = (incomeBuckets[k] || 0) + Number(r.total_biaya || 0);
    }
  });

  (expenseRows || []).forEach((r) => {
    const k = bucketKey(r.tanggal_pengeluaran, chartBucketStrategy);
    if (k in expenseBuckets) {
      expenseBuckets[k] = (expenseBuckets[k] || 0) + Number(r.jumlah || 0);
    }
  });
  
  const sortedKeys = Array.from(allKeys).sort((a, b) => {
    // This is a simplified sort; for production, a more robust date-conversion sort would be better
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const barChartData = sortedKeys.map(k => ({
    name: k,
    pendapatan: incomeBuckets[k] || 0,
    pengeluaran: expenseBuckets[k] || 0,
  }));

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <TrendingUp className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Laporan Keuangan
        </h1>
      </header>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Filter Laporan</h2>
          <PeriodSelector />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title={`Pendapatan (${titlePeriod})`} 
            value={`Rp ${income.toLocaleString('id-ID')}`}
            icon={<span className="text-green-600 font-bold text-xl">Rp</span>} 
            colorClass="bg-green-100"
          />
          <StatCard 
            title={`Pengeluaran (${titlePeriod})`} 
            value={`Rp ${expense.toLocaleString('id-ID')}`}
            icon={<Wallet className="text-red-600" />} 
            colorClass="bg-red-100"
          />
          <StatCard 
            title={`Laba Bersih (${titlePeriod})`} 
            value={`Rp ${profit.toLocaleString('id-ID')}`}
            icon={<span className={`font-bold text-xl ${profit >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>Rp</span>} 
            colorClass={profit >= 0 ? "bg-indigo-100" : "bg-red-100"}
          />
        </div>

        <div className="grid gap-8">
          <div className="bg-gray-50 p-6 sm:p-7 rounded-lg">
            <BarChartComponent data={barChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
