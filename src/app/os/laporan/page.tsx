// src/app/os/laporan/page.tsx
import { TrendingUp } from 'lucide-react';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import PeriodSelector from '../../../components/os/PeriodSelector'; // Pastikan komponen ini ada

type Period = 'hari' | 'minggu' | 'bulan' | 'tahun';

// --- PERBAIKAN 1: Definisikan tipe props yang benar untuk Server Component ---
interface LaporanPageProps {
  searchParams?: { // 'searchParams' bisa jadi undefined
    period?: Period; // 'period' di dalamnya juga bisa undefined
  }
}
// -----------------------------------------------------------------

// Fungsi 'getPeriodRangeWIB' Anda sudah terlihat benar
function getPeriodRangeWIB(period: Period) {
  const now = new Date();
  const localNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const start = new Date(localNow);
  
  if (period === 'hari') {
    start.setHours(0, 0, 0, 0);
  } else if (period === 'minggu') {
    const day = (localNow.getDay() + 6) % 7;
    start.setDate(localNow.getDate() - day);
    start.setHours(0, 0, 0, 0);
  } else if (period === 'bulan') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else { // tahun
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  }
  
  const end = new Date(localNow);
  end.setHours(23, 59, 59, 999);
  
  return { start: start.toISOString(), end: end.toISOString() };
}

// --- PERBAIKAN 2: Terapkan tipe props yang baru ---
const LaporanPage = async ({
    searchParams,
  }: {
    searchParams?: { [key: string]: string | string[] | undefined };
  }) => {
  // Pastikan 'period' selalu punya nilai default 'bulan'
  const period = (searchParams?.period as Period) || 'bulan';
  const range = getPeriodRangeWIB(period);
  const supabase = await createClient();

  // Pendapatan (orders Lunas)
  const { data: incomeRows, error: incomeError } = await supabase
    .from('orders')
    .select('total_biaya, tanggal_order')
    .eq('status_bayar', 'Lunas')
    .gte('tanggal_order', range.start)
    .lte('tanggal_order', range.end);

  const income = (incomeRows || []).reduce((acc, r) => acc + Number(r.total_biaya || 0), 0);
  if(incomeError) console.error("Error Pendapatan:", incomeError.message);

  // Pengeluaran (PERBAIKAN NAMA KOLOM)
  const { data: expenseRows, error: expenseError } = await supabase
    .from('expenses')
    .select('jumlah, tanggal_pengeluaran') // Sesuai ERD: 'jumlah' dan 'tanggal_pengeluaran'
    .gte('tanggal_pengeluaran', range.start)
    .lte('tanggal_pengeluaran', range.end);
    
  const expense = (expenseRows || []).reduce((acc, r) => acc + Number(r.jumlah || 0), 0);
  if(expenseError) console.error("Error Pengeluaran:", expenseError.message);

  const profit = income - expense;

  // Data untuk grafik ringkas
  function bucketKey(d: string) {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  }
  
  const incomeBuckets: Record<string, number> = {};
  (incomeRows || []).forEach((r) => {
    const k = bucketKey(r.tanggal_order);
    incomeBuckets[k] = (incomeBuckets[k] || 0) + Number(r.total_biaya || 0);
  });
  
  const expenseBuckets: Record<string, number> = {};
  (expenseRows || []).forEach((r) => {
    const k = bucketKey(r.tanggal_pengeluaran); // PERBAIKAN NAMA KOLOM
    expenseBuckets[k] = (expenseBuckets[k] || 0) + Number(r.jumlah || 0);
  });
  
  const allKeys = Array.from(new Set([...Object.keys(incomeBuckets), ...Object.keys(expenseBuckets)])).sort();
  // PERBAIKAN: ...allKeys.map(k => (expenseBuckets[k] || 0)) terpisah dari Math.max
  const maxIncome = Math.max(1, ...allKeys.map(k => (incomeBuckets[k] || 0)));
  const maxExpense = Math.max(1, ...allKeys.map(k => (expenseBuckets[k] || 0)));
  const maxVal = Math.max(maxIncome, maxExpense);

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <TrendingUp className="w-8 h-8 text-(--color-brand-primary)" />
        <h1 className="text-3xl font-bold text-(--color-text-primary)">
          Laporan Keuangan
        </h1>
      </header>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="mb-6">
          <PeriodSelector period={period} />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="p-6 rounded-xl border border-(--color-light-primary-active)">
            <div className="text-sm text-(--color-dark-primary)">Pendapatan (Lunas)</div>
            <div className="text-2xl font-bold text-(--color-text-primary)">Rp {income.toLocaleString('id-ID')}</div>
          </div>
          <div className="p-6 rounded-xl border border-(--color-light-primary-active)">
            <div className="text-sm text-(--color-dark-primary)">Pengeluaran</div>
            <div className="text-2xl font-bold text-(--color-text-primary)">Rp {expense.toLocaleString('id-ID')}</div>
          </div>
          <div className="p-6 rounded-xl border border-(--color-light-primary-active)">
            <div className="text-sm text-(--color-dark-primary)">Laba Bersih</div>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>Rp {profit.toLocaleString('id-ID')}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-(--color-text-primary) mb-3">Ringkasan Pendapatan</h3>
            <div className="rounded-xl border border-(--color-light-primary-active) p-4 text-(--color-dark-primary)">
              Total transaksi lunas: {(incomeRows || []).length}
            </div>
            {/* Grafik mini pendapatan */}
            <div className="mt-4">
              <div className="flex items-end gap-1 h-24">
                {allKeys.map(k => (
                  <div key={`i-${k}`} title={`${k} • Rp ${(incomeBuckets[k]||0).toLocaleString('id-ID')}`}
                    className="w-2 bg-(--color-brand-primary)"
                    style={{ height: `${((incomeBuckets[k] || 0) / maxVal) * 100}%` }} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-(--color-text-primary) mb-3">Ringkasan Pengeluaran</h3>
            <div className="rounded-xl border border-(--color-light-primary-active) p-4 text-(--color-dark-primary)">
              Total catatan pengeluaran: {(expenseRows || []).length}
            </div>
            {/* Grafik mini pengeluaran */}
            <div className="mt-4">
              <div className="flex items-end gap-1 h-24">
                {allKeys.map(k => (
                  <div key={`e-${k}`} title={`${k} • Rp ${(expenseBuckets[k]||0).toLocaleString('id-ID')}`}
                    className="w-2 bg-red-400"
                    style={{ height: `${((expenseBuckets[k] || 0) / maxVal) * 100}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaporanPage;