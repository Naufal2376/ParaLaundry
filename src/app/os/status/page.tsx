// src/app/os/status/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { QrCode, Send, Loader } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import QrScanner from '@/components/QrScanner';
import { updateOrderStatus } from '@/app/os/transaksi/actions';
import { redirect } from 'next/navigation';

type StatusCucian = "Masuk Antrean" | "Proses Dicuci" | "Siap Diambil" | "Selesai";

export default function UpdateStatusPage() {
  const [kode, setKode] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [statusCucian, setStatusCucian] = useState<StatusCucian>('Masuk Antrean');
  const [message, setMessage] = useState<string>('');
  const [details, setDetails] = useState<{ nama_layanan: string; jumlah: number; sub_total: number }[]>([]);

  useEffect(() => {
    const guard = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return redirect('/login');
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role !== 'Pegawai') return redirect('/os');
    };
    guard();
  }, []);

  const fetchOrder = async (inputCode: string) => {
    setLoading(true);
    setMessage('');
    try {
      const supabase = createClient();
      let cleanCode = inputCode.trim();
      if (cleanCode.includes('/lacak/')) {
         cleanCode = cleanCode.split('/lacak/').pop() || '';
      }
      const code = inputCode.trim().toUpperCase();
      const numMatch = code.match(/\d+/);
      const numericId = numMatch ? Number(numMatch[0]) : Number(code);
      const { data, error } = await supabase
        .from('orders')
        .select(`order_id, status_cucian, customer:customers ( nama ), order_details(jumlah, sub_total, service:services(nama_layanan))`)
        .eq('order_id', numericId)
        .single();
      if (error || !data) {
        setOrderId(null);
        setCustomerName('');
        setMessage('Pesanan tidak ditemukan.');
        setDetails([]);
      } else {
        const rel = (data as any).customer;
        setOrderId((data as any).order_id);
        setCustomerName(Array.isArray(rel) ? (rel[0]?.nama ?? 'Tanpa Nama') : (rel?.nama ?? 'Tanpa Nama'));
        setStatusCucian((data as any).status_cucian as StatusCucian);
        const det = ((data as any).order_details || []).map((d: any) => ({
          nama_layanan: Array.isArray(d.service) ? (d.service[0]?.nama_layanan ?? '') : (d.service?.nama_layanan ?? ''),
          jumlah: Number(d.jumlah ?? 0),
          sub_total: Number(d.sub_total ?? 0),
        }));
        setDetails(det);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kode.trim()) return setMessage('Masukkan kode terlebih dahulu.');
    await fetchOrder(kode);
  };

  const handleScanSuccess = async (decodedText: string) => {
    setIsScannerOpen(false);
    let finalCode = decodedText.trim().toUpperCase();
    try {
      const url = new URL(decodedText);
      const parts = url.pathname.split('/');
      finalCode = (parts.pop() || '').toUpperCase();
    } catch {}
    setKode(finalCode);
    await fetchOrder(finalCode);
  };

  const handleUpdateStatus = async () => {
    if (!orderId) return setMessage('Order belum dipilih.');
    const res = await updateOrderStatus(orderId, statusCucian);
    if (res?.error) setMessage(res.error);
    else setMessage('Status berhasil diperbarui.');
  };

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <QrCode className="w-8 h-8 text-(--color-brand-primary)" />
        <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">Update Status Cucian</h1>
      </header>

      {isScannerOpen && (
        <QrScanner onScanSuccess={handleScanSuccess} onClose={() => setIsScannerOpen(false)} />
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Masukkan kode (mis: PL-123)"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            className="flex-1 p-3 border border-(--color-light-primary-active) rounded-lg"
          />
          <button type="submit" className="px-4 py-3 bg-(--color-brand-primary) text-white rounded-lg flex items-center gap-2">
            <Send size={16} /> Cari
          </button>
          <button type="button" onClick={() => setIsScannerOpen(true)} className="px-4 py-3 bg-white text-(--color-brand-primary) border-2 border-(--color-brand-primary) rounded-lg flex items-center gap-2">
            <QrCode size={16} /> Pindai
          </button>
        </form>

        {loading && (
          <div className="flex items-center gap-2 mt-4 text-(--color-dark-primary)">
            <Loader className="animate-spin" size={16} /> Memuat...
          </div>
        )}

        {orderId && !loading && (
          <div className="mt-6 space-y-3">
            <div className="text-(--color-text-primary)">
              <div className="font-semibold">Order: PL-{orderId}</div>
              <div>Pelanggan: {customerName}</div>
            </div>
            {details.length > 0 && (
              <ul className="text-(--color-dark-primary) list-disc list-inside">
                {details.map((d, i) => (
                  <li key={i}>{d.nama_layanan} — {d.jumlah} • Rp {d.sub_total.toLocaleString('id-ID')}</li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-3">
              <select
                value={statusCucian}
                onChange={(e) => setStatusCucian(e.target.value as StatusCucian)}
                className="p-3 border border-(--color-light-primary-active) rounded-lg"
              >
                {['Masuk Antrean','Proses Dicuci','Siap Diambil','Selesai'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button onClick={handleUpdateStatus} className="px-4 py-3 bg-(--color-brand-primary) text-white rounded-lg">Update</button>
            </div>
          </div>
        )}

        {message && <p className="mt-4 text-(--color-dark-primary)">{message}</p>}
      </div>
    </div>
  );
}


