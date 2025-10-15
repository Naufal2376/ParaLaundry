// src/components/os/OrderTable.tsx
"use client";
import React from 'react';

// Data statis sebagai contoh
const orders = [
  { id: 'PL-001', customer: 'Budi Santoso', service: 'Cuci Kering Setrika', status: 'Proses Cuci', entryDate: '15/10/2025' },
  { id: 'PL-002', customer: 'Citra Lestari', service: 'Bed Cover', status: 'Siap Diambil', entryDate: '14/10/2025' },
  { id: 'PL-003', customer: 'Agus Wijaya', service: 'Cuci Kering Setrika', status: 'Selesai', entryDate: '12/10/2025' },
];

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Proses Cuci': return 'bg-yellow-100 text-yellow-800';
    case 'Siap Diambil': return 'bg-green-100 text-green-800';
    case 'Selesai': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrderTable = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
      <h3 className="font-bold text-xl text-[--color-text-primary] mb-4">Transaksi Terkini</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">ID Pesanan</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Layanan</th>
              <th className="p-4">Tanggal Masuk</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-[--color-light-primary]">
                <td className="p-4 font-semibold">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.service}</td>
                <td className="p-4">{order.entryDate}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;