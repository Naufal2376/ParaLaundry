// src/app/os/transaksi/page.tsx
import { List } from 'lucide-react';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import OrderTable, { type Order } from '@/components/os/OrderTable'; 

export default async function TransaksiPage() {
  const supabase = await createClient();
  
  // --- PERBAIKAN PADA KUERI SELECT ---
  const { data, error } = await supabase
    .from('orders')
    .select(`
      order_id,
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
      <header className="flex items-center gap-4 mb-8">
        <List className="w-8 h-8 text-(--color-brand-primary)" />
        <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">
          Daftar Semua Transaksi
        </h1>
      </header>
      
      <OrderTable orders={orders} />
    </div>
  );
}