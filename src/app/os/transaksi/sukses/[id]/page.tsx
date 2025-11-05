// src/app/os/transaksi/sukses/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import NotaCetak from '@/components/os/NotaCetak';
import React from 'react';
import { FilePlus } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function SuccessPage(props: any) {
  const { id } = (await props.params) || {};
  if (!id) redirect('/os');

  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      order_id,
      tanggal_order,
      total_biaya,
      status_bayar,
      customer:customers ( nama, no_hp ),
      order_details (
        jumlah,
        sub_total,
        service:services ( nama_layanan )
      )
    `)
    .eq('order_id', id)
    .single();

  if (error || !order) {
    console.error('Error fetching order for receipt:', error?.message);
    redirect('/os');
  }

  const typedOrder: {
    order_id: number;
    tanggal_order: string;
    total_biaya: number;
    status_bayar: string;
    customer: { nama: string; no_hp: string } | null;
    order_details: {
      jumlah: number;
      sub_total: number;
      service: { nama_layanan: string } | null;
    }[];
  } = {
    ...order,
    customer: Array.isArray(order.customer)
      ? order.customer[0] ?? null
      : order.customer ?? null,
    order_details: (order.order_details || []).map((d: any) => ({
      ...d,
      service: Array.isArray(d.service)
        ? d.service[0] ?? null
        : d.service ?? null,
    })),
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-md mx-auto">
        <NotaCetak order={typedOrder} />
        <div className="mt-4 text-center">
          <a
            href="/os/transaksi/baru"
            className="shine-button flex items-center justify-center w-full bg-white text-(--color-brand-primary) font-semibold px-6 py-3 rounded-lg shadow-lg border border-(--color-light-primary-active) hover:bg-(--color-light-primary-hover)"
          >
            <FilePlus className="mr-2" size={20} />
            Buat Transaksi Baru Lagi
          </a>
        </div>
      </div>
    </div>
  );
}
