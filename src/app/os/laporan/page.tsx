// src/app/os/laporan/page.tsx
import { TrendingUp } from 'lucide-react';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import PeriodSelector from '../../../components/os/PeriodSelector';

type Period = 'hari' | 'minggu' | 'bulan' | 'tahun';

function getPeriodRangeWIB(period: Period) {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 7);
  const start = new Date(now);
  if (period === 'hari') {
    start.setUTCHours(0,0,0,0);
  } else if (period === 'minggu') {
    const day = (now.getUTCDay() + 6) % 7; // Senin sebagai awal
    start.setUTCDate(now.getUTCDate() - day);
    start.setUTCHours(0,0,0,0);
  } else if (period === 'bulan') {
    start.setUTCDate(1);
    start.setUTCHours(0,0,0,0);
  } else {
    start.setUTCMonth(0,1);
    start.setUTCHours(0,0,0,0);
  }
  const end = new Date(now);
  end.setUTCHours(23,59,59,999);
  return { start: start.toISOString(), end: end.toISOString() };
}

const LaporanPage = async ({ searchParams }: { searchParams?: { period?: Period } }) => {
  const period: Period = (searchParams?.period || 'bulan') as Period;
  const range = getPeriodRangeWIB(period);
  const supabase = await createClient();

  // Pendapatan (orders Lunas)
  const { data: incomeRows } = await supabase
    .from('orders')
    .select('total_biaya, status_bayar, tanggal_order')
    .eq('status_bayar', 'Lunas')
    .gte('tanggal_order', range.start)
    .lte('tanggal_order', range.end);

  const income = (incomeRows || []).reduce((acc, r: any) => acc + Number(r.total_biaya || 0), 0);

  // Pengeluaran
  const { data: expenseRows } = await supabase
    .from('expenses')
    .select('amount, tanggal')
    .gte('tanggal', range.start)
    .lte('tanggal', range.end);

  const expense = (expenseRows || []).reduce((acc, r: any) => acc + Number(r.amount || 0), 0);
  const profit = income - expense;

  // Data untuk grafik ringkas (bar mini) per hari/bucket
  function bucketKey(d: string) {
    const dt = new Date(d);
    return `${dt.getUTCFullYear()}-${dt.getUTCMonth()+1}-${dt.getUTCDate()}`;
  }
  const incomeBuckets: Record<string, number> = {};
  (incomeRows || []).forEach((r: any) => {
    const k = bucketKey(r.tanggal_order);
    incomeBuckets[k] = (incomeBuckets[k] || 0) + Number(r.total_biaya || 0);
  });
  const expenseBuckets: Record<string, number> = {};
  (expenseRows || []).forEach((r: any) => {
    const k = bucketKey(r.tanggal);
    expenseBuckets[k] = (expenseBuckets[k] || 0) + Number(r.amount || 0);
  });
  const allKeys = Array.from(new Set([...Object.keys(incomeBuckets), ...Object.keys(expenseBuckets)])).sort();
  const maxVal = Math.max(1, ...allKeys.map(k => (incomeBuckets[k] || 0), ...allKeys.map(k => (expenseBuckets[k] || 0))));

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
            <div className="text-sm text-(--color-dark-primary)">Pendapatan</div>
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