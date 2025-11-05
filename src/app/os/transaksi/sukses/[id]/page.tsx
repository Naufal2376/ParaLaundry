// src/app/os/transaksi/sukses/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import NotaCetak from '@/components/os/NotaCetak';
import React from 'react';
import { FilePlus } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function SuccessPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Kueri diperbarui untuk menggunakan alias 'customer' dan 'service'
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      order_id,
      tanggal_order,
      total_biaya,
      status_bayar,
      customers ( nama, no_hp ),
      order_details (
        jumlah,
        sub_total,
        services ( nama_layanan )
      )
    `)
    .eq('order_id', params.id)
    .single();

  if (error || !order) {
    console.error("Error fetching order for receipt:", error?.message);
    redirect('/os');
  }

  // Tipe data diperbarui untuk mengharapkan OBJEK (bukan array)
  const typedOrder = order as {
    order_id: number;
    tanggal_order: string;
    total_biaya: number;
    status_bayar: string;
    customers: { nama: string, no_hp: string }[]; // Diubah menjadi array
    order_details: {
      jumlah: number;
      sub_total: number;
      services: { nama_layanan: string }[]; // Diubah menjadi array
    }[];
  };
  // -----------------------------

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