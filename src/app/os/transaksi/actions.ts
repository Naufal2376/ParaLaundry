// src/app/os/transaksi/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Tipe data yang valid untuk status
type StatusCucian = "Masuk Antrean" | "Proses Dicuci" | "Siap Diambil" | "Selesai";
type StatusBayar = "Lunas" | "Belum Lunas";

/**
 * Memperbarui status cucian untuk order_id tertentu.
 */
export async function updateOrderStatus(orderId: number, newStatus: StatusCucian) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('orders')
    .update({ status_cucian: newStatus })
    .eq('order_id', orderId);

  if (error) {
    return { error: `Gagal memperbarui status cucian: ${error.message}` };
  }

  // Penting: Refresh data di halaman transaksi agar tabel diperbarui
  revalidatePath('/os/transaksi');
  revalidatePath('/os'); // Refresh dashboard juga
  return { success: true };
}

/**
 * Memperbarui status pembayaran untuk order_id tertentu.
 */
export async function updatePaymentStatus(orderId: number, newStatus: StatusBayar) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('orders')
    .update({ status_bayar: newStatus })
    .eq('order_id', orderId);

  if (error) {
    return { error: `Gagal memperbarui status pembayaran: ${error.message}` };
  }

  revalidatePath('/os/transaksi');
  revalidatePath('/os');
  return { success: true };
}