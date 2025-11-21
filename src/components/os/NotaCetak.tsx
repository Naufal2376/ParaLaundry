// src/components/os/NotaCetak.tsx
"use client";

import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Printer } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

// Sesuaikan Interface dengan data yang dikirim dari page.tsx
interface NotaProps {
  data: {
    order_code: string; // Menggunakan Code (PL-XXXX), bukan ID angka
    date: string | Date;
    customer: {
      name: string;
      phone: string;
    };
    payment: {
      total: number;
      paid: number;
      method: string;
    };
    items: Array<{
      service_name: string;
      qty: number;
      price: number;
      subtotal: number;
    }>;
  };
}

export default function NotaCetak({ data }: NotaProps) {
  const notaRef = useRef<HTMLDivElement>(null);
  
  // --- LOGIC HITUNGAN ---
  const total = Number(data.payment.total);
  const bayar = Number(data.payment.paid);
  const kembalian = bayar - total;
  const isLunas = bayar >= total;
  const statusBayarString = isLunas ? 'Lunas' : 'Belum Lunas';

  // URL Tracking menggunakan Order Code
  const trackingUrl = `https://para-laundry.vercel.app/lacak/${data.order_code}`;

  const handlePrint = () => {
    window.print();
  };

  // --- LOGIC WHATSAPP ---
  const sendWhatsAppReceipt = () => {
    if (!data.customer.phone) {
      alert('Nomor HP pelanggan tidak ditemukan.');
      return;
    }

    // Format rincian item (looping dari data.items)
    const itemsList = data.items.map((item) => 
      `- ${item.service_name} (x${item.qty}): Rp ${item.subtotal.toLocaleString('id-ID')}`
    ).join('\n');

    // Logic teks pembayaran untuk WA
    const isBayarNanti = !isLunas && bayar === 0;
    const paymentInfo = isBayarNanti 
      ? `*💳 Status Pembayaran:* Bayar saat pengambilan barang`
      : `*💵 Jumlah Bayar:* Rp ${bayar.toLocaleString('id-ID')}\n*🔄 Kembalian:* Rp ${kembalian.toLocaleString('id-ID')}`;

    const message = `
*NOTA DIGITAL PARA LAUNDRY*

Terima kasih, ${data.customer.name || 'Pelanggan'}!

Pesanan Anda *${data.order_code}* telah kami terima.

*📋 Detail Pesanan:*
• *ID Pesanan:* ${data.order_code}
• *Tanggal:* ${new Date(data.date).toLocaleString('id-ID')}
• *Status Pembayaran:* ${statusBayarString}

*🛍️ Rincian Pesanan:*
${itemsList}

*💰 Total Biaya:* *Rp ${total.toLocaleString('id-ID')}*
${paymentInfo}

*📱 Lacak Pesanan:*
Anda bisa melacak pesanan Anda secara real-time melalui link berikut:
${trackingUrl}

*📲 Scan QR Code:*
Gunakan QR Code pada nota fisik untuk melacak pesanan dengan mudah!

*📍 Alamat:*
Jl. Indralaya-Prabumulih Indralaya (Pertokoan Amanah Depan UNSRI)
📞 0813-7777-1420

Terima kasih atas kepercayaan Anda!
    `.trim().replace(/\n\s+\n/g, '\n\n');

    // Format nomor HP (08 -> 628)
    const formattedPhoneNumber = data.customer.phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
      
      {/* --- TOMBOL AKSI (TIDAK DICETAK) --- */}
      <div className="no-print mb-6 text-center print:hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Transaksi Berhasil!
        </h2>
        <p className="text-gray-600 mb-4">
          Pesanan <span className="font-mono font-bold text-blue-600">{data.order_code}</span> telah dibuat.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={sendWhatsAppReceipt}
            className="flex items-center justify-center w-full bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-all"
          >
            <FaWhatsapp className="mr-2" size={20} />
            Kirim Nota via WhatsApp
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center w-full bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-slate-900 transition-all"
          >
            <Printer className="mr-2" size={20} />
            Cetak Nota
          </button>
        </div>
      </div>

      {/* --- AREA NOTA FISIK --- */}
      <div ref={notaRef} className="printable-area border p-4 border-gray-200 rounded-lg print:border-none print:p-0">
        
        {/* Header Nota */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-black uppercase tracking-wider">Para Laundry</h1>
          <p className="text-[10px] text-gray-600 mt-1 leading-tight">
            Jl. Indralaya-Prabumulih Indralaya<br/>(Pertokoan Amanah Depan UNSRI)<br/>
            WA: 0813-7777-1420
          </p>
          <hr className="my-3 border-dashed border-gray-400" />
        </div>

        {/* Info Transaksi */}
        <div className="text-xs text-gray-800 mb-3">
          <div className="flex justify-between">
            <span>Kode Order:</span>
            <span className="font-bold font-mono">{data.order_code}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit', hour:'2-digit', minute:'2-digit' })}</span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span className="font-semibold uppercase">{data.customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span>{statusBayarString}</span>
          </div>
        </div>
        
        <hr className="my-2 border-dashed border-gray-400" />

        {/* Rincian Item */}
        <div className="text-xs text-gray-800 space-y-2">
          {data.items.map((item, index) => (
            <div key={index} className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-medium">{item.service_name}</span>
                <span className="text-gray-500">{item.qty} x {item.price.toLocaleString('id-ID')}</span>
              </div>
              <span className="font-medium">Rp {item.subtotal.toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>

        <hr className="my-3 border-dashed border-gray-400" />

        {/* Total & Pembayaran */}
        <div className="text-xs text-gray-800 space-y-1">
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
          
          {/* Logic Tampilan Pembayaran */}
          {!isLunas && bayar === 0 ? (
            <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded text-center">
              <span className="font-bold">BAYAR SAAT AMBIL</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between pt-1">
                <span>TUNAI ({data.payment.method})</span>
                <span>Rp {bayar.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between pt-1 font-semibold">
                <span>KEMBALI</span>
                <span>Rp {kembalian < 0 ? 0 : kembalian.toLocaleString('id-ID')}</span>
              </div>
            </>
          )}
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center mt-6 mb-4">
          <p className="text-[10px] text-gray-500 mb-1">Scan untuk melacak cucian:</p>
          <div className="p-1 border border-gray-200 rounded">
            <QRCode value={trackingUrl} size={100} style={{ height: "auto", maxWidth: "100%", width: "100px" }} />
          </div>
          <p className="text-[10px] font-mono mt-1">{data.order_code}</p>
        </div>

        {/* Ketentuan (Syarat) */}
        <div className="text-[9px] text-gray-500 mt-4 border-t border-dashed pt-2">
          <h4 className="font-bold mb-1">KETENTUAN:</h4>
          <ol className="list-decimal list-inside space-y-[2px] leading-tight">
            <li>Pengambilan barang harus disertai dengan nota</li>
            <li>Kami tidak bertanggung jawab apabila luntur/susut karena sifat bahannya</li>
            <li>Jika terjadi kehilangan/kerusakan kami hanya mengganti max. Rp. 50 000 perpotong</li>
            <li>Penggantian barang jika terjadi kehilangan/kerusakan paling lama 1 bulan</li>
            <li>Kami tidak bertanggung jawab atas barang yang tidak diambil dalam waktu 30 hari</li>
            <li>Hak klaim berlaku 24 jam setelah barang diambil</li>
            <li>Setiap konsumen dianggap setuju dengan aturan tersebut setelah menandatangani nota ini</li>
          </ol>
        </div>

        <p className="text-[10px] text-center text-gray-400 mt-6 italic">
          -- Terima Kasih & Selamat Datang Kembali --
        </p>
      </div>
    </div>
  );
};