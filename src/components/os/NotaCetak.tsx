// src/components/os/NotaCetak.tsx
"use client";

import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Printer, User, Calendar, Hash, Phone, Shirt } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';

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
    // We need to move the printable area out of the main content flow
    // for the print styles in globals.css to work correctly.
    const printableElement = notaRef.current;
    if (printableElement) {
      const parent = printableElement.parentNode;
      document.body.appendChild(printableElement);
      window.print();
      // Move it back after printing
      parent?.appendChild(printableElement);
    }
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
  
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg max-w-md mx-auto print:shadow-none print:p-0">
      
      {/* --- TOMBOL AKSI (TIDAK DICETAK) --- */}
      <div className="no-print mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Transaksi Berhasil!
        </h2>
        <p className="text-gray-600 mb-6">
          Pesanan <span className="font-mono font-bold text-blue-600">{data.order_code}</span> telah dibuat.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={sendWhatsAppReceipt}
            className="shine-button-whatsapp flex items-center justify-center w-full bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-all"
          >
            <FaWhatsapp className="mr-2" size={20} />
            Kirim Nota via WhatsApp
          </button>
          <button
            onClick={handlePrint}
            className="shine-button flex items-center justify-center w-full bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-slate-900 transition-all"
          >
            <Printer className="mr-2" size={20} />
            Cetak Nota
          </button>
        </div>
      </div>

      {/* --- AREA NOTA FISIK --- */}
      <div ref={notaRef} className="printable-area bg-white p-6 rounded-lg border border-gray-200">
        
        {/* Header Nota */}
        <div className="flex items-center justify-between pb-4 border-b border-dashed">
          <div className="flex items-center gap-3">
            <Image src="/ParaLaundry.png" alt="Logo" width={50} height={50} className="rounded-full" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Para Laundry</h1>
              <p className="text-xs text-gray-500">Nota Pemesanan</p>
            </div>
          </div>
          {isLunas && (
            <div className="bg-green-100 text-green-700 font-bold text-sm py-1 px-4 rounded-full">
              LUNAS
            </div>
          )}
        </div>

        {/* Info Transaksi */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 my-4">
          <div className="flex items-center gap-2">
            <User size={14} className="text-gray-400" />
            <span className="font-semibold truncate">{data.customer.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" />
            <span>{data.customer.phone || 'No HP'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash size={14} className="text-gray-400" />
            <span className="font-mono">{data.order_code}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <span>{formatDate(data.date)}</span>
          </div>
        </div>
        
        {/* Rincian Item */}
        <div className="border-t border-b border-dashed py-4 space-y-3">
          {data.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Shirt size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{item.service_name}</p>
                  <p className="text-xs text-gray-500">{item.qty} x @{item.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <p className="font-semibold text-gray-800">Rp {item.subtotal.toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>

        {/* Total & Pembayaran */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-800">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg text-blue-600 border-t pt-2 mt-2">
            <span>TOTAL</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
          
          {/* Logic Tampilan Pembayaran */}
          {isLunas && bayar > 0 && (
            <>
              <div className="flex justify-between items-center text-xs pt-2">
                <span className="text-gray-500">Tunai</span>
                <span className="text-gray-500">Rp {bayar.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Kembali</span>
                <span className="text-gray-500">Rp {kembalian < 0 ? 0 : kembalian.toLocaleString('id-ID')}</span>
              </div>
            </>
          )}
           {!isLunas && bayar > 0 && (
            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-center text-xs text-yellow-800">
              <span className="font-bold">DP: Rp {bayar.toLocaleString('id-ID')}</span>
            </div>
          )}
          {!isLunas && bayar === 0 && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-center">
              <span className="font-bold text-red-700">BAYAR SAAT AMBIL</span>
            </div>
          )}
        </div>

        {/* QR Code & Footer */}
        <div className="flex flex-col items-center mt-6 text-center border-t border-dashed pt-4">
          <p className="text-xs text-gray-500 mb-2">Lacak status pesanan Anda dengan memindai kode ini:</p>
          <div className="p-1.5 bg-white border border-gray-300 rounded-md inline-block">
            <QRCode value={trackingUrl} size={90} />
          </div>
          <p className="text-xs font-mono mt-2 text-gray-500">{data.order_code}</p>
          <p className="text-[10px] text-gray-400 mt-4 italic">
            Terima kasih telah mempercayai Para Laundry!
          </p>
        </div>
      </div>
    </div>
  );
};