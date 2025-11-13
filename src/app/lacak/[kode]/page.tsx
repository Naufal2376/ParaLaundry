"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import { Loader, Calendar, CheckCircle, DollarSign, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient as createBrowserSupabase } from '@/lib/supabase/client';

type OrderData = {
  customer_name: string;
  status_cucian: string;
  details: { nama_layanan: string; jumlah: number; sub_total: number }[];
  tanggal_order: string;
  tanggal_selesai: string | null;
  total_biaya: number;
  status_bayar: string;
};

// Helper untuk format tanggal
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Belum Selesai';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function LacakPage() {
  const params = useParams();
  const kode = Array.isArray(params.kode) ? params.kode[0] : params.kode;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!kode) return;
      setLoading(true);
      setError(false);
      try {
        const supabase = createBrowserSupabase();
        const code = String(kode).toUpperCase();
        const numericId = parseInt(code.replace(/[^0-9]/g, ''), 10);

        const { data, error } = await supabase.rpc('get_order_by_id', {
            order_id_input: numericId,
          })
          .maybeSingle();

        if (error || !data) {
          setOrder(null);
          setError(true);
        } else {
          setOrder(data as OrderData);
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

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  const renderContent = () => {
    if (kode === undefined || loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <Loader className="animate-spin text-(--color-brand-primary)" size={48} />
          <p className="mt-4 text-lg text-(--color-dark-primary)">Mencari pesanan Anda...</p>
        </div>
      );
    }

    if (error || !order) {
      return (
        <motion.div className="text-center p-8" variants={fadeUp} initial="hidden" animate="visible">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-(--color-dark-primary)">
            Kode pesanan <span className="font-bold">{kode.toUpperCase()}</span> tidak valid.
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
        <motion.div className="mb-8 p-6 bg-white rounded-xl shadow-lg" variants={fadeUp}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-(--color-dark-primary)">
                Pelanggan:
                <span className="block text-2xl font-bold text-(--color-text-primary)">{order.customer_name}</span>
              </h3>
              <p className="text-md font-semibold text-(--color-dark-primary) mt-2">
                Kode:
                <span className="block text-lg font-bold text-(--color-text-primary)">{kode.toUpperCase()}</span>
              </p>
            </div>
            <div className={`text-right p-2 rounded-lg ${order.status_bayar === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                <p className="font-bold text-sm">{order.status_bayar}</p>
            </div>
          </div>
          
          <hr className="my-4" />

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-(--color-brand-primary)" />
              <strong>Tgl Order:</strong> {formatDate(order.tanggal_order)}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <strong>Tgl Selesai:</strong> {formatDate(order.tanggal_selesai)}
            </div>
          </div> */}

          <div className="mt-6">
            <h4 className="font-semibold text-md mb-2">Detail Layanan:</h4>
            <ul className="space-y-2">
              {order.details.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span>{item.nama_layanan} ({item.jumlah})</span>
                  <span className="font-medium">Total: Rp {(item.sub_total ?? 0).toLocaleString('id-ID')}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="mt-6 text-right">
            <p className="text-lg font-semibold text-(--color-dark-primary)">
              Total Biaya:
              <span className="block text-2xl font-bold text-(--color-text-primary)">
                Rp {(order.total_biaya ?? 0).toLocaleString('id-ID')}
              </span>
            </p>
          </div> */}
        </motion.div>

        <OrderStatusTracker currentStatus={order.status_cucian} />
      </motion.div>
    );
  };

  return (
    <>
      <Header />
      <main className="py-20 px-4 bg-gradient-to-b from-white to-(--color-light-primary) min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <motion.h1 className="text-4xl font-bold text-center text-(--color-text-primary) mb-12" variants={fadeUp} initial="hidden" animate="visible">
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