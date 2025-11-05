// src/app/os/layanan/actions.ts
"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper untuk Cek Otorisasi Owner
async function authorizeOwner() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Otentikasi gagal.");

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'Owner') {
    throw new Error("Akses ditolak. Hanya Owner yang dapat melakukan aksi ini.");
  }
}

// Tipe data untuk form
export type ServiceFormState = {
  message: string;
  error: boolean;
} | null;

// --- Aksi CREATE ---
export async function createService(
  prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  try {
    await authorizeOwner(); // Keamanan: Cek apakah ini Owner
    const supabase = await createClient();

    const data = {
      nama_layanan: formData.get('nama_layanan') as string,
      harga: Number(formData.get('harga')),
      satuan: formData.get('satuan') as string,
    };

    const { error } = await supabase.from('services').insert(data);
    if (error) throw new Error(error.message);

    revalidatePath('/os/layanan');
    return { message: "Layanan baru berhasil ditambahkan.", error: false };
  } catch (e: any) {
    return { message: e.message, error: true };
  }
}

// --- Aksi UPDATE ---
export async function updateService(
  serviceId: number,
  prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  try {
    await authorizeOwner(); // Keamanan
    const supabase = await createClient();

    const data = {
      nama_layanan: formData.get('nama_layanan') as string,
      harga: Number(formData.get('harga')),
      satuan: formData.get('satuan') as string,
    };

    const { error } = await supabase
      .from('services')
      .update(data)
      .eq('service_id', serviceId);
      
    if (error) throw new Error(error.message);

    revalidatePath('/os/layanan');
    return { message: "Layanan berhasil diperbarui.", error: false };
  } catch (e: any) {
    return { message: e.message, error: true };
  }
}

// --- Aksi DELETE ---
// (Ini tidak menggunakan form, jadi formatnya sedikit berbeda)
export async function deleteService(serviceId: number) {
  try {
    await authorizeOwner(); // Keamanan
    const supabase = await createClient();

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('service_id', serviceId);
      
    if (error) throw new Error(error.message);

    revalidatePath('/os/layanan');
    return { message: "Layanan berhasil dihapus.", error: false };
  } catch (e: any) {
    return { message: e.message, error: true };
  }
}