// src/app/os/transaksi/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Tipe data yang valid untuk status
type StatusCucian = "Masuk Antrean" | "Proses Dicuci" | "Siap Diambil" | "Selesai";
type StatusBayar = "Lunas" | "Belum Lunas";

/**
 * Memperbarui status cucian untuk order_id tertentu.
 * Jika status diubah menjadi "Selesai", maka tanggal_selesai akan diisi dengan timestamp saat ini.
 */
export async function updateOrderStatus(orderId: number, newStatus: StatusCucian) {
  const supabase = await createClient();
  
  // Siapkan data update
  const updateData: { status_cucian: StatusCucian; tanggal_selesai?: string } = {
    status_cucian: newStatus,
  };

  // Jika status diubah menjadi "Selesai", set tanggal_selesai dengan timestamp saat ini
  if (newStatus === 'Selesai') {
    updateData.tanggal_selesai = new Date().toISOString();
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('order_id', orderId);

  if (error) {
    return { error: `Gagal memperbarui status cucian: ${error.message}` };
  }

  // Penting: Refresh data di halaman transaksi agar tabel diperbarui
  revalidatePath('/os/transaksi');
  revalidatePath('/os'); // Refresh dashboard juga
  revalidatePath('/lacak'); // Refresh halaman lacak juga
  return { success: true };
}

/**
 * Memperbarui status pembayaran untuk order_id tertentu.
 * Jika status diubah menjadi "Lunas" dari "Belum Lunas" dengan jumlah_bayar = 0,
 * maka jumlah_bayar akan diupdate menjadi total_biaya (bayar saat pengambilan).
 */
export async function updatePaymentStatus(orderId: number, newStatus: StatusBayar) {
  const supabase = await createClient();
  
  // Ambil data order saat ini untuk cek apakah perlu update jumlah_bayar
  const { data: currentOrder, error: fetchError } = await supabase
    .from('orders')
    .select('status_bayar, jumlah_bayar, total_biaya')
    .eq('order_id', orderId)
    .single();

  if (fetchError || !currentOrder) {
    return { error: `Gagal mengambil data pesanan: ${fetchError?.message}` };
  }

  // Jika status diubah menjadi "Lunas" dari "Belum Lunas" dan jumlah_bayar = 0
  // (artinya bayar saat pengambilan), update jumlah_bayar menjadi total_biaya
  const isBayarSaatPengambilan = 
    currentOrder.status_bayar === 'Belum Lunas' && 
    currentOrder.jumlah_bayar === 0 && 
    newStatus === 'Lunas';

  const updateData: { status_bayar: StatusBayar; jumlah_bayar?: number } = {
    status_bayar: newStatus,
  };

  if (isBayarSaatPengambilan) {
    updateData.jumlah_bayar = currentOrder.total_biaya;
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('order_id', orderId);

  if (error) {
    return { error: `Gagal memperbarui status pembayaran: ${error.message}` };
  }

  // Refresh cache untuk update pendapatan di dashboard dan laporan
  revalidatePath('/os/transaksi');
  revalidatePath('/os');
  revalidatePath('/os/laporan');
  return { success: true };
}