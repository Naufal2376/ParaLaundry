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

  // Query dengan alias yang benar (seperti di halaman lain)
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      order_id,
      tanggal_order,
      total_biaya,
      status_bayar,
      jumlah_bayar,
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

  // Handle data yang bisa berupa object atau array (seperti di status/page.tsx)
  const customerData = (order as any).customer;
  const customer = Array.isArray(customerData) 
    ? (customerData[0] || null) 
    : (customerData || null);

  const orderDetails = ((order as any).order_details || []).map((detail: any) => {
    const serviceData = detail.service;
    const service = Array.isArray(serviceData) 
      ? (serviceData[0] || null) 
      : (serviceData || null);
    
    return {
      jumlah: detail.jumlah,
      sub_total: detail.sub_total,
      service: service,
    };
  });

  // Transform data untuk NotaCetak
  const transformedOrder = {
    order_id: order.order_id,
    tanggal_order: order.tanggal_order,
    total_biaya: order.total_biaya,
    status_bayar: order.status_bayar,
    jumlah_bayar: order.jumlah_bayar,
    customer: customer,
    order_details: orderDetails,
  };

  return (
    <div className="py-12 px-4 bg-(--color-light-primary)">
      <div className="max-w-md mx-auto">
        <NotaCetak order={transformedOrder} />
        <div className="mt-4 text-center no-print">
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