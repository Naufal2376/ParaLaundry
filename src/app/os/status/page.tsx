// src/app/os/status/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { QrCode, Send, Loader, Shirt, Hash, User, Package, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import QrScanner from '@/components/QrScanner';
import { updateOrderStatus } from '@/app/os/transaksi/actions';
import { redirect } from 'next/navigation';

type StatusCucian = "Masuk Antrean" | "Proses Dicuci" | "Siap Diambil" | "Selesai";
type StatusBayar = "Lunas" | "Belum Lunas";

interface OrderDetails {
  order_id: number;
  order_code: string;
  customerName: string;
  statusCucian: StatusCucian;
  statusBayar: StatusBayar;
  totalBiaya: number;
  items: {
    nama_layanan: string;
    jumlah: number;
    sub_total: number;
  }[];
}

export default function UpdateStatusPage() {
  const [kode, setKode] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [message, setMessage] = useState<string>('');
  const [currentStatus, setCurrentStatus] = useState<StatusCucian>('Masuk Antrean');

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
      // Allow both 'Pegawai' and 'Owner'
      if (profile?.role !== 'Pegawai' && profile?.role !== 'Owner') {
        return redirect('/os');
      }
    };
    guard();
  }, []);

  const fetchOrder = async (inputCode: string) => {
    setLoading(true);
    setMessage('');
    setOrder(null);
    try {
      const supabase = createClient();
      let cleanCode = inputCode.trim().toUpperCase();
      
      // Handle full URLs from QR codes
      if (cleanCode.includes('/lacak/')) {
         cleanCode = cleanCode.split('/lacak/').pop() || '';
      } else if (cleanCode.startsWith('HTTP')) {
        try {
          const url = new URL(cleanCode);
          const parts = url.pathname.split('/');
          cleanCode = (parts.pop() || parts.pop() || '').toUpperCase();
        } catch (e) {
          // Not a valid URL, proceed with the code as is
        }
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          order_id, 
          order_code,
          status_cucian, 
          status_bayar,
          total_biaya,
          customer:customers ( nama ), 
          order_details(jumlah, sub_total, service:services(nama_layanan))
        `)
        .eq('order_code', cleanCode)
        .single();

      if (error || !data) {
        setMessage('Pesanan tidak ditemukan atau kode tidak valid.');
      } else {
        const fetchedData = data as any;
        const customerName = Array.isArray(fetchedData.customer) ? (fetchedData.customer[0]?.nama ?? 'Tanpa Nama') : (fetchedData.customer?.nama ?? 'Tanpa Nama');
        const orderItems = (fetchedData.order_details || []).map((d: any) => ({
          nama_layanan: Array.isArray(d.service) ? (d.service[0]?.nama_layanan ?? 'N/A') : (d.service?.nama_layanan ?? 'N/A'),
          jumlah: Number(d.jumlah ?? 0),
          sub_total: Number(d.sub_total ?? 0),
        }));

        const newOrder: OrderDetails = {
          order_id: fetchedData.order_id,
          order_code: fetchedData.order_code,
          customerName: customerName,
          statusCucian: fetchedData.status_cucian,
          statusBayar: fetchedData.status_bayar,
          totalBiaya: fetchedData.total_biaya,
          items: orderItems,
        };
        
        setOrder(newOrder);
        setCurrentStatus(newOrder.statusCucian);
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
    setKode(decodedText); // Show the raw scanned value
    await fetchOrder(decodedText); // Let fetchOrder handle parsing
  };

  const handleUpdateStatus = async () => {
    if (!order) return setMessage('Order belum dipilih.');
    setLoading(true);
    const res = await updateOrderStatus(order.order_id, currentStatus);
    setLoading(false);
    if (res?.error) {
      setMessage(`Gagal update: ${res.error}`);
    } else {
      setMessage('Status berhasil diperbarui.');
      // Refetch to confirm
      await fetchOrder(order.order_code);
    }
  };

  const getStatusColor = (status: StatusCucian) => {
    switch (status) {
      case 'Masuk Antrean': return 'bg-gray-200 text-gray-800';
      case 'Proses Dicuci': return 'bg-blue-200 text-blue-800';
      case 'Siap Diambil': return 'bg-yellow-200 text-yellow-800';
      case 'Selesai': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-100';
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center gap-4 mb-6">
        <Package className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Update Status Pesanan</h1>
      </header>

      {isScannerOpen && (
        <QrScanner onScanSuccess={handleScanSuccess} onClose={() => setIsScannerOpen(false)} />
      )}

      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Masukkan atau pindai Kode Pesanan (contoh: PL-XYZ12)"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />
          <button type="submit" disabled={loading} className="px-5 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition duration-200 disabled:bg-gray-400">
            {loading ? <Loader className="animate-spin" size={18} /> : <Send size={16} />} 
            Cari
          </button>
          <button type="button" onClick={() => setIsScannerOpen(true)} className="px-5 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition duration-200">
            <QrCode size={16} /> Pindai QR
          </button>
        </form>
      </div>

      {loading && !order && (
        <div className="flex items-center justify-center gap-3 mt-8 text-gray-600">
          <Loader className="animate-spin" size={24} /> 
          <span className='text-lg'>Mencari pesanan...</span>
        </div>
      )}

      {message && <p className="mt-4 text-center text-red-600 font-semibold">{message}</p>}

      {order && (
        <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Hash className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-bold text-gray-800">Kode: {order.order_code}</h2>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <User className="w-5 h-5" />
                <span>{order.customerName}</span>
              </div>
            </div>
            <div className="flex md:justify-end items-start gap-4">
                <div className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.statusCucian)}`}>
                  {order.statusCucian}
                </div>
                <div className={`px-3 py-1 text-sm font-semibold rounded-full ${order.statusBayar === 'Lunas' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {order.statusBayar}
                </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Shirt size={18} /> Rincian Layanan</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{item.nama_layanan}</p>
                    <p className="text-sm text-gray-500">{item.jumlah} item</p>
                  </div>
                  <p className="font-semibold text-gray-800">Rp {item.sub_total.toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
             <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-dashed">
                <p className="text-lg font-bold text-gray-800">Total</p>
                <p className="text-lg font-bold text-blue-600">Rp {order.totalBiaya.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><CheckCircle size={18}/> Perbarui Status</h3>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as StatusCucian)}
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {['Masuk Antrean','Proses Dicuci','Siap Diambil','Selesai'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button 
                onClick={handleUpdateStatus} 
                disabled={loading || currentStatus === order.statusCucian}
                className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? <Loader className="animate-spin" size={18} /> : <CheckCircle size={16} />}
                Update Status
              </button>
            </div>
             {loading && <p className="text-sm text-center mt-2 text-gray-500">Memperbarui...</p>}
          </div>
        </div>
      )}
    </div>
  );
}


