// src/app/lacak/[kode]/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient as createBrowserSupabase } from '@/lib/supabase/client';

// Data akan diambil dari Supabase pada saat runtime

export default function LacakPage() {
  const params = useParams();
  const kode = Array.isArray(params.kode) ? params.kode[0] : params.kode;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<{ customer: string; status: string; itemsText?: string; details?: { nama_layanan: string; jumlah: number; sub_total: number }[] } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!kode) return;
      console.log("Raw kode from URL:", kode);
      setLoading(true);
      setError(false);
      try {
        const supabase = createBrowserSupabase();
        const code = String(kode).toUpperCase();
        const numericId = parseInt(code.replace(/[^0-9]/g, ''), 10);
        console.log("Parsed numericId:", numericId);

        const { data, error } = await supabase
          .from('orders')
          .select(`
            order_id,
            status_cucian,
            customer:customers ( nama ),
            order_details(
              jumlah,
              sub_total,
              service:services(nama_layanan)
            )
          `)
          .eq('order_id', numericId)
          .maybeSingle();

        if (error || !data) {
          setOrder(null);
          setError(true);
        } else {
          const customerRel = (data as any).customer;
          const details = ((data as any).order_details || []).map((d: any) => ({
            nama_layanan: Array.isArray(d.service) ? (d.service[0]?.nama_layanan ?? '') : (d.service?.nama_layanan ?? ''),
            jumlah: Number(d.jumlah ?? 0),
            sub_total: Number(d.sub_total ?? 0),
          }));
          const itemsText = details.map((d: any) => `${d.nama_layanan} (${d.jumlah})`).join(', ');
          setOrder({
            customer: Array.isArray(customerRel) ? (customerRel[0]?.nama ?? 'Tanpa Nama') : (customerRel?.nama ?? 'Tanpa Nama'),
            status: (data as any).status_cucian ?? 'Tidak diketahui',
            itemsText,
            details,
          });
        }
      } catch (_e) {
        setOrder(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [kode]);

  // Varian animasi untuk 'fade up'
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring' as const,
        stiffness: 100 
      } 
    }
  };

  const renderContent = () => {
    
    // --- 1. PERBAIKAN DIMULAI DI SINI ---
    // Jika 'kode' masih undefined (karena params belum siap), 
    // atau jika kita masih loading, tunjukkan loader.
    if (kode === undefined || loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <Loader className="animate-spin text-(--color-brand-primary)" size={48} />
          <p className="mt-4 text-lg text-(--color-dark-primary)">Mencari pesanan Anda...</p>
        </div>
      );
    }
    // --- 1. PERBAIKAN SELESAI ---

    // 2. Sekarang, TypeScript tahu bahwa 'kode' PASTI sebuah string
    if (error || !order) {
      return (
        <motion.div 
          className="text-center p-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-red-600 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-(--color-dark-primary)">
            Kode pesanan <span className="font-bold">{kode.toUpperCase()}</span> tidak valid.
          </p>
        </motion.div>
      );
    }

    // 3. 'kode' di sini juga PASTI sebuah string
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.2 }}
      >
        {/* Rincian Pesanan */}
        <motion.div 
          className="mb-8 p-6 bg-white rounded-xl shadow-lg" 
          variants={fadeUp}
        >
          <h3 className="text-lg font-semibold text-(--color-dark-primary)">
            Pelanggan: 
            <span className="text-xl font-bold text-(--color-text-primary)"> {order.customer}</span>
          </h3>
          <p className="text-lg font-semibold text-(--color-dark-primary)">
            Kode: 
            <span className="text-xl font-bold text-(--color-text-primary)"> {kode.toUpperCase()}</span>
          </p>
          {order.itemsText && (
            <p className="mt-2 text-(--color-dark-primary)">{order.itemsText}</p>
          )}
          {order.details && order.details.length > 0 && (
            <ul className="mt-3 text-(--color-dark-primary) list-disc list-inside space-y-1">
              {order.details.map((d, i) => (
                <li key={i}>
                  {d.nama_layanan} — {d.jumlah} • Rp {d.sub_total.toLocaleString('id-ID')}
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Tracker Status */}
        <OrderStatusTracker currentStatus={order.status} />
      </motion.div>
    );
  };

  return (
    <>
      <Header />
      <main className="py-20 px-4 bg-gradient-to-b from-white to-(--color-light-primary) min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <motion.h1 
            className="text-4xl font-bold text-center text-(--color-text-primary) mb-12" 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Status Pelacakan
          </motion.h1>
          
          <div className="bg-(--color-light-primary)/50 rounded-2xl shadow-xl p-6 md:p-10">
            {renderContent()}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}