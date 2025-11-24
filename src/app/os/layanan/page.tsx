// src/app/os/layanan/page.tsx
import { PieChart } from 'lucide-react';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ServiceTable } from '@/components/os/ServiceTable';
import { Service } from '@/components/os/ServiceModal'; // Impor tipe

// Ini adalah Server Component
export default async function LayananPage() {
  const supabase = await createClient();

  // 1. Ambil Peran Pengguna (dari layout, tapi kita cek lagi di sini)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role;
  
  // 2. Ambil Data Layanan
  const { data } = await supabase
    .from('services')
    .select('*')
    .order('nama_layanan', { ascending: true });
    
  const services: Service[] = data || [];

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <PieChart className="w-8 h-8 text-(--color-brand-primary)" />
          <h1 className="text-3xl font-bold text-(--color-text-primary)">
            Manajemen Layanan & Harga
          </h1>
        </div>
      </header>
      
      {/* 3. Render Komponen Klien, oper data server ke klien */}
      <ServiceTable role={role} services={services} />
    </div>
  );
}