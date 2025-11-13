// src/app/os/layout.tsx
import DashboardWrapper from "@/components/os/DashboardWrapper";
import React from "react";
import { createClient } from "@/lib/supabase/server"; // Impor klien server
import { redirect } from 'next/navigation';

// Jadikan ini Server Component 'async'
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Ambil data pengguna yang sedang login
  const { data: { user } } = await supabase.auth.getUser();

  // (Pengaman) Jika middleware gagal, kita cek lagi di sini
  if (!user) {
    redirect('/login');
  }

  // 2. Ambil peran (role) pengguna dari tabel 'profiles'
  let userRole: string | null = null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id) // Cocokkan ID dari auth.users
    .single();

  if (profile) {
    userRole = profile.role; // Hasilnya akan "Pegawai" atau "Owner"
  } else {
    // Jika profil tidak ditemukan, ini adalah error.
    // Untuk saat ini, kita anggap sebagai 'Pegawai' agar tidak crash.
    // Di aplikasi nyata, kita bisa paksa dia melengkapi profil.
    userRole = "Pegawai"; 
  }

  return (
    <DashboardWrapper userRole={userRole}>
      {children}
    </DashboardWrapper>
  );
}