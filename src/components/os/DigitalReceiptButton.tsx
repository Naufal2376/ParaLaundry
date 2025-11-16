// src/components/os/DigitalReceiptButton.tsx
"use client";
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Pastikan Anda sudah 'npm install react-icons'

// Tipe data ini harus cocok dengan yang dikirim oleh halaman 'sukses'
type Service = { nama_layanan: string } | null;
type Customer = { nama: string; no_hp: string } | null;
type OrderDetail = {
  jumlah: number;
  sub_total: number;
  service: Service;
};
type Order = {
  order_id: number;
  tanggal_order: string;
  total_biaya: number;
  status_bayar: string;
  customer: Customer;
  order_details: OrderDetail[];
};

const DigitalReceiptButton: React.FC<{ order: Order }> = ({ order }) => {
  
  const sendWhatsAppReceipt = () => {
    // 1. Cek apakah ada nomor HP
    if (!order.customer?.no_hp) {
      alert('Nomor HP pelanggan tidak ditemukan untuk pesanan ini.');
      return;
    }

    // 2. Format rincian item
    const items = order.order_details.map((item) => 
      `- ${item.service?.nama_layanan || 'N/A'} (x${Number(item.jumlah).toLocaleString('id-ID')}): Rp ${Number(item.sub_total).toLocaleString('id-ID')}`
    ).join('\n'); // \n = baris baru

    // 3. Buat pesan WhatsApp
    // Kita gunakan *tebal* dan ~coret~ (jika perlu) untuk styling
    const message = `
*Nota Digital Para Laundry*
Terima kasih, ${order.customer?.nama || 'Pelanggan'}!

Pesanan Anda *PL-${order.order_id}* telah kami terima.

*Tanggal:* ${new Date(order.tanggal_order).toLocaleString('id-ID')}
*Status:* ${order.status_bayar}

*Rincian Pesanan:*
${items}

*Total Biaya:* *Rp ${Number(order.total_biaya).toLocaleString('id-ID')}*

Anda bisa melacak pesanan Anda secara real-time kapan saja melalui link di bawah ini:
https://para-laundry.vercel.app/lacak/PL-${order.order_id}

Terima kasih!
    `.trim().replace(/\n\s+\n/g, '\n\n'); // Menghapus spasi aneh

    // 4. Format nomor HP (mengubah 08... menjadi 628...)
    const formattedPhoneNumber = order.customer.no_hp.replace(/[^0-9]/g, '').replace(/^0/, '62');
    
    // 5. Buat URL dan buka di tab baru
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <button
      onClick={sendWhatsAppReceipt}
      // Kita gunakan kelas 'shine-button-whatsapp' (yang ada di globals.css)
      // atau style kustom jika tidak ada
      className="shine-button-whatsapp flex items-center justify-center w-full bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-all"
    >
      <FaWhatsapp className="mr-2" size={20} />
      Kirim Nota via WhatsApp
    </button>
  );
};

export default DigitalReceiptButton;