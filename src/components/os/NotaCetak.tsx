// src/components/os/NotaCetak.tsx
"use client";
import React from 'react';
import QRCode from 'react-qr-code';
import { Printer } from 'lucide-react';

// --- 1. PERBAIKAN TIPE DATA DI SINI ---
type Service = {
    nama_layanan: string;
  } | null;
  
  type OrderDetail = {
    jumlah: number;
    sub_total: number;
    service: Service; // <-- Diubah menjadi Objek
  };
  
  type Customer = {
    nama: string;
    no_hp: string;
  } | null;
  
  type Order = {
    order_id: number;
    tanggal_order: string;
    total_biaya: number;
    status_bayar: string;
    customer: Customer; // <-- Diubah menjadi Objek
    order_details: OrderDetail[];
  };
  // --- AKHIR PERBAIKAN TIPE DATA ---

const NotaCetak: React.FC<{ order: Order }> = ({ order }) => {
    const trackingUrl = `https://para-laundry.vercel.app/lacak/PL-${order.order_id}`;
    const handlePrint = () => { window.print(); };
  
    return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
      {/* Tombol Cetak */}
      <div className="no-print mb-6 text-center">
        <h2 className="text-2xl font-bold text-(--color-text-primary) mb-2">
          Transaksi Berhasil!
        </h2>
        <p className="text-(--color-dark-primary) mb-4">
          Pesanan PL-{order.order_id} telah dibuat.
        </p>
        <button
          onClick={handlePrint}
          className="shine-button flex items-center justify-center w-full bg-(--color-brand-primary) text-white font-semibold px-6 py-3 rounded-lg shadow-lg"
        >
          <Printer className="mr-2" size={20} />
          Cetak Nota
        </button>
      </div>

      {/* --- AREA NOTA YANG AKAN DICETAK --- */}
      <div className="printable-area">
        {/* Header Nota */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-black">Para Laundry</h1>
          <p className="text-xs text-gray-600">Jl. Indralaya-Prabumulih Indralaya (Pertokoan Amanah Depan UNSRI) | 0813-7777-1420</p>
          <hr className="my-2 border-dashed" />
        </div>

        {/* Info Pelanggan & Transaksi */}
        <div className="text-sm text-gray-800">
          <p><strong>ID Pesanan:</strong> PL-{order.order_id}</p>
          <p><strong>Tanggal:</strong> {new Date(order.tanggal_order).toLocaleString('id-ID')}</p>
          {/* --- 2. PERBAIKAN JSX DI SINI --- */}
          <p><strong>Pelanggan:</strong> {order.customer?.nama || 'N/A'}</p>
          <p><strong>Status:</strong> {order.status_bayar}</p>
        </div>
        <hr className="my-2 border-dashed" />

        {/* Rincian Item */}
        <div className="text-sm text-gray-800">
          {order.order_details.map((item, index) => (
            <div key={index} className="flex justify-between">
              {/* --- 2. PERBAIKAN JSX DI SINI --- */}
              <span>{item.service?.nama_layanan || 'N/A'} (x{Number(item.jumlah).toLocaleString('id-ID')})</span>
              <span>Rp {Number(item.sub_total).toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>
        <hr className="my-2 border-dashed" />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold text-black">
          <span>TOTAL</span>
          <span>Rp {Number(order.total_biaya).toLocaleString('id-ID')}</span>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center mt-4">
          <p className="text-xs text-gray-600 mb-2">Lacak pesanan Anda di sini:</p>
          <div className="bg-white p-2 border">
            <QRCode value={trackingUrl} size={128} />
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-6">
          <h4 className="font-bold mb-2">Ketentuan:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Pengambilan barang harus disertai dengan nota</li>
            <li>Kami tidak bertanggung jawab apabila luntur/susut karena sifat bahannya</li>
            <li>Jika terjadi kehilangan/kerusakan kami hanya mengganti max. Rp. 50 000 perpotong</li>
            <li>Penggantian barang jika terjadi kehilangan/kerusakan paling lama 1 bulan</li>
            <li>Kami tidak bertanggung jawab atas barang yang tidak diambil dalam waktu 30 hari</li>
            <li>Hak klaim berlaku 24 jam setelah barang diambil</li>
            <li>Setiap konsumen dianggap setuju dengan aturan tersebut setelah menandatangani nota ini</li>
          </ol>
        </div>
        <p className="text-xs text-center text-gray-600 mt-4">Terima kasih!</p>
      </div>
    </div>
  );
};

export default NotaCetak;