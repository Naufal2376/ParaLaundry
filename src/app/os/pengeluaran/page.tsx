// src/app/os/pengeluaran/page.tsx
import React from 'react';
import { Wallet } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExpenseManager } from '@/components/os/ExpenseManager'; // <-- Impor Komponen Klien

// Ini adalah Server Component (async)
export default async function ExpensePage() {
  const supabase = await createClient();

  // --- 1. Keamanan (Guard) ---
  // Kita cek peran di Server Component, ini lebih aman
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Hanya Owner yang boleh melihat halaman ini
  if (profile?.role !== 'Owner') redirect('/os');

  // --- 2. Ambil Data Awal ---
  // Ambil data di server agar halaman cepat dimuat
  const { data: initialExpenses } = await supabase
    .from('expenses')
    .select('expense_id, tanggal_pengeluaran, keterangan, jumlah')
    .order('tanggal_pengeluaran', { ascending: false });

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <Wallet className="w-8 h-8 text-(--color-brand-primary)" />
        <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">
          Catat Pengeluaran
        </h1>
      </header>

      {/* 3. Render Komponen Klien dan oper data awal */}
      <ExpenseManager initialExpenses={initialExpenses || []} />
    </div>
  );
}