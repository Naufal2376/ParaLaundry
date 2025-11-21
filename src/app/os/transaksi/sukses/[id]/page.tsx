// src/app/os/transaksi/sukses/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import NotaCetak from '@/components/os/NotaCetak';
import React from 'react';
import { FilePlus } from 'lucide-react';
import { redirect } from 'next/navigation';

// Definisikan tipe untuk detail order mentah dari Supabase
interface RawOrderDetail {
  jumlah: number;
  sub_total: number;
  service: { nama_layanan: string } | { nama_layanan: string }[] | null;
}

// Definisikan tipe untuk detail order yang sudah ditransformasi
interface TransformedOrderDetail {
  jumlah: number;
  sub_total: number;
  service: {
    nama_layanan: string;
  } | null;
}

export default async function SuccessPage(props: any) {
  // 'id' di sini adalah kode acak (misal: PL-X7K9) dari URL
  const { id } = (await props.params) || {};
  if (!id) redirect('/os');

  const supabase = await createClient();

  // 2. Query menggunakan 'order_code' bukan 'order_id'
  const { data: order, error } = await supabase
    .from('orders')
    .select(
      `
      order_id,
      order_code,
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
    `
    )
    .eq('order_code', id) // <-- Cari berdasarkan kode acak
    .single();

  if (error || !order) {
    console.error('Error fetching order for receipt:', error?.message);
    redirect('/os');
  }

  // 3. Logika Pemetaan Data yang Aman (Array/Object Handling)
  const customerData = (order as any).customer;
  const customer = Array.isArray(customerData)
    ? customerData[0] || null
    : customerData || null;

  const orderDetails = ((order as any).order_details || []).map(
    (detail: RawOrderDetail) => {
      const serviceData = detail.service;
      const service = Array.isArray(serviceData)
        ? serviceData[0] || null
        : serviceData || null;

      return {
        jumlah: detail.jumlah,
        sub_total: detail.sub_total,
        service: service,
      };
    }
  );

  // Bentuk objek akhir yang sesuai dengan tipe di NotaCetak & DigitalReceiptButton
  const transformedOrder = {
    order_id: order.order_id,
    order_code: order.order_code, // Sertakan kode acak
    tanggal_order: order.tanggal_order,
    total_biaya: order.total_biaya,
    status_bayar: order.status_bayar,
    jumlah_bayar: order.jumlah_bayar,
    customer: customer,
    order_details: orderDetails,
  };

  // --- (BARU) Transformasi data agar sesuai dengan props NotaCetak ---
  const notaData = {
    order_code: transformedOrder.order_code,
    date: transformedOrder.tanggal_order,
    customer: {
      name: transformedOrder.customer?.nama || 'N/A',
      phone: transformedOrder.customer?.no_hp || '',
    },
    payment: {
      total: transformedOrder.total_biaya,
      paid: transformedOrder.jumlah_bayar,
      method: transformedOrder.status_bayar, // Ini bisa disesuaikan jika ada metode pembayaran lain
    },
    items: transformedOrder.order_details.map(
      (detail: TransformedOrderDetail) => ({
        service_name: detail.service?.nama_layanan || 'N/A',
        qty: detail.jumlah,
        price: detail.sub_total / detail.jumlah, // Asumsi harga per item
        subtotal: detail.sub_total,
      })
    ),
  };

  return (
    <div className="py-12 px-4 bg-(--color-light-primary)">
      <div className="max-w-md mx-auto">
        {/* Render Nota */}
        <NotaCetak data={notaData} />

        <div className="mt-4 text-center flex flex-col gap-4 no-print">
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