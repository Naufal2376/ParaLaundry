"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface OrderItem {
  service_id: number;
  jumlah: number;
  sub_total: number;
}

export interface OrderData {
  customerName: string;
  customerPhone: string;
  totalBiaya: number;
  jumlahBayar: number;
  bayarSaatPengambilan?: boolean;
  items: OrderItem[];
}

// --- FUNGSI GENERATOR KODE ACAK ---
function generateOrderCode() {
  // Menghasilkan string acak 5 karakter
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PL-${result}`; // Contoh: PL-X7A29
}

export async function createOrder(data: OrderData) {
  const supabase = await createClient();

  // 1. Cek User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Otentikasi gagal." };
  
  // 2. Upsert Customer
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert(
      { nama: data.customerName, no_hp: data.customerPhone },
      { onConflict: 'no_hp', ignoreDuplicates: false }
    )
    .select('customer_id')
    .single();

  if (customerError || !customer) return { error: `Gagal pelanggan: ${customerError?.message}` };

  // --- 3. INSERT ORDER (DIPERBARUI UNTUK ID ACAK) ---
  
  // (BARU) Panggil fungsi generator
  const newOrderCode = generateOrderCode(); 

  const status_bayar = data.bayarSaatPengambilan 
    ? 'Belum Lunas' 
    : (data.jumlahBayar >= data.totalBiaya ? 'Lunas' : 'Belum Lunas');

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.customer_id,
      user_id: user.id,
      total_biaya: data.totalBiaya,
      jumlah_bayar: data.bayarSaatPengambilan ? 0 : data.jumlahBayar,
      status_bayar: status_bayar,
      status_cucian: 'Masuk Antrean',
      order_code: newOrderCode, // (BARU) Simpan kode acak ke database
    })
    // (BARU) Ambil 'order_code' juga
    .select('order_id, order_code') 
    .single();

  if (orderError || !order) return { error: `Gagal order: ${orderError?.message}` };

  // 4. Insert Rincian (Tetap pakai ID Angka untuk relasi internal database)
  const orderDetailsData = data.items.map(item => ({
    order_id: order.order_id, // Relasi database wajib pakai ID angka (Internal)
    service_id: item.service_id,
    jumlah: item.jumlah,
    sub_total: item.sub_total,
  }));

  const { error: detailsError } = await supabase
    .from('order_details')
    .insert(orderDetailsData);

  if (detailsError) return { error: `Gagal rincian: ${detailsError.message}` };

  // 5. Redirect (DIPERBARUI)
  revalidatePath('/os/transaksi');
  revalidatePath('/os');
  
  // (BARU) Arahkan ke URL dengan kode acak (Eksternal/Publik)
  redirect(`/os/transaksi/sukses/${order.order_code}`);
}