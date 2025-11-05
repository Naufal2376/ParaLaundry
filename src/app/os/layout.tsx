// src/app/os/layout.tsx
import Sidebar from "@/components/os/Sidebar";
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
    <div className="flex min-h-screen bg-(--color-light-primary)">
      {/* 3. Oper 'userRole' sebagai prop ke Sidebar */}
      <Sidebar userRole={userRole} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}