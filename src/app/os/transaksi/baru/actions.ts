// src/app/os/transaksi/baru/actions.ts
"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 1. Definisikan tipe data untuk item yang dikirim dari form
// Ini harus cocok dengan apa yang dikirim oleh 'page.tsx'
interface OrderItem {
  service_id: number;
  jumlah: number;
  sub_total: number;
}

// 2. Definisikan tipe data untuk seluruh payload form
export interface OrderData {
  customerName: string;
  customerPhone: string;
  totalBiaya: number;
  jumlahBayar: number;
  items: OrderItem[];
}

/**
 * Server Action untuk membuat transaksi baru.
 * Ini akan menangani 3 operasi database:
 * 1. Upsert (Find or Create) Pelanggan
 * 2. Insert Order (Transaksi Utama)
 * 3. Insert Order Details (Rincian Item)
 */
export async function createOrder(data: OrderData) {
  const supabase = await createClient();

  // --- Langkah 1: Dapatkan ID Pegawai (User) yang Sedang Login ---
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Otentikasi gagal. Silakan login ulang." };
  }
  const pegawaiUserId = user.id;

  // --- Langkah 2: Cari atau Buat Pelanggan (Upsert) ---
  // 'upsert' akan mencari berdasarkan 'no_hp' (karena itu UNIQUE)
  // Jika tidak ada, ia akan membuat. Jika ada, ia akan update namanya.
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert(
      { 
        nama: data.customerName, 
        no_hp: data.customerPhone 
      },
      { onConflict: 'no_hp', ignoreDuplicates: false }
    )
    .select('customer_id') // Kita butuh ID-nya untuk langkah berikutnya
    .single();

  if (customerError || !customer) {
    console.error('Error Upsert Customer:', customerError);
    return { error: `Gagal memproses data pelanggan: ${customerError?.message}` };
  }
  const customerId = customer.customer_id;

  // --- Langkah 3: Buat Transaksi (Order) Utama ---
  // Sesuai ERD Anda: order_id, customer_id, user_id, total_biaya, status_bayar, status_cucian
  const status_bayar = data.jumlahBayar >= data.totalBiaya ? 'Lunas' : 'Belum Lunas';
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      user_id: pegawaiUserId,
      total_biaya: data.totalBiaya,
      jumlah_bayar: data.jumlahBayar, // <-- Simpan jumlah bayar
      status_bayar: status_bayar,
      status_cucian: 'Masuk Antrean', // Sesuai flowchart, ini adalah status default
    })
    .select('order_id') // Kita butuh ID order baru untuk nota
    .single();

  if (orderError || !order) {
    console.error('Error Insert Order:', orderError);
    return { error: `Gagal membuat pesanan utama: ${orderError?.message}` };
  }
  const orderId = order.order_id;

  // --- Langkah 4: Siapkan dan Masukkan Rincian Pesanan (Order Details) ---
  // Sesuai ERD: order_id, service_id, jumlah, sub_total
  
  // 'map' array item dari form agar cocok dengan struktur tabel
  const orderDetailsData = data.items.map(item => ({
    order_id: orderId,
    service_id: item.service_id,
    jumlah: item.jumlah,
    sub_total: item.sub_total,
  }));

  const { error: detailsError } = await supabase
    .from('order_details')
    .insert(orderDetailsData);

  if (detailsError) {
    console.error('Error Insert Details:', detailsError);
    // Di aplikasi produksi, kita seharusnya menghapus 'order' yang sudah dibuat (rollback)
    return { error: `Gagal menyimpan rincian pesanan: ${detailsError.message}` };
  }

  // --- Langkah 5: Berhasil -> Bersihkan Cache & Arahkan ke Halaman Nota ---
  
  // Bersihkan cache (revalidate) agar halaman 'Daftar Transaksi' menampilkan data baru
  revalidatePath('/os/transaksi');
  revalidatePath('/os');

  // Arahkan (redirect) pegawai ke halaman cetak nota
  redirect(`/os/transaksi/sukses/${orderId}`);
}