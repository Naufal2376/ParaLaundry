import React from 'react';
import { Wallet } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExpenseManager } from '@/components/os/ExpenseManager'; 

export default async function ExpensePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Hanya Owner & Pegawai yang boleh masuk
  if (profile?.role !== 'Owner' && profile?.role !== 'Pegawai') redirect('/os');

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

      {/* Kirim role ke komponen client */}
      <ExpenseManager 
        initialExpenses={initialExpenses || []} 
        role={profile?.role || 'Pegawai'} 
      />
    </div>
  );
}