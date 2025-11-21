// src/app/os/transaksi/page.tsx
import { List, Plus } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import OrderTable, { type Order } from '@/components/os/OrderTable'; 

export default async function TransaksiPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile) {
      userRole = profile.role;
    }
  }

  // --- PERBAIKAN PADA KUERI SELECT ---
  const { data, error } = await supabase
    .from('orders')
    .select(`
      order_id,
      order_code,
      customer_id,
      status_cucian,
      total_biaya,
      status_bayar,
      customer:customers ( nama ) 
    `) // <-- Diubah menjadi 'customer:customers' (alias)
    .order('tanggal_order', { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error.message);
  }

  const orders: Order[] =
    (data?.map((o: any) => ({
      ...o,
      customer: Array.isArray(o.customer) ? (o.customer[0] ?? null) : (o.customer ?? null),
    })) as Order[]) || [];

  return (
    <div>
      <header className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <List className="w-8 h-8 text-(--color-brand-primary)" />
          <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">
            Daftar Semua Transaksi
          </h1>
        </div>
        {userRole === 'Pegawai' && (
          <Link href="/os/transaksi/baru" className="flex items-center gap-2 bg-(--color-brand-primary) text-white font-semibold px-4 py-2 rounded-lg hover:bg-(--color-brand-primary-active) transition-colors">
            <Plus size={20} />
            <span>Tambah Transaksi</span>
          </Link>
        )}
      </header>
      
      <OrderTable orders={orders} userRole={userRole} />
    </div>
  );
}