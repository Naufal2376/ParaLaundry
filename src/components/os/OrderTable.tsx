// src/components/os/OrderTable.tsx
"use client";
import React from 'react';

// Data statis sebagai contoh
const orders = [
  { id: 'PL-123', customer: 'Budi Santoso', status: 'Proses Dicuci', total: 'Rp 35.000', payment: 'Belum Lunas' },
  { id: 'PL-122', customer: 'Citra Lestari', status: 'Siap Diambil', total: 'Rp 10.000', payment: 'Lunas' },
  { id: 'PL-121', customer: 'Agus Wijaya', status: 'Selesai', total: 'Rp 21.000', payment: 'Lunas' },
  { id: 'PL-120', customer: 'Dewi K.', status: 'Masuk Antrean', total: 'Rp 15.000', payment: 'Belum Lunas' },
];

// Fungsi helper untuk styling status
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Proses Dicuci': return 'bg-yellow-100 text-yellow-800';
    case 'Siap Diambil': return 'bg-green-100 text-green-800';
    case 'Selesai': return 'bg-blue-100 text-blue-800';
    case 'Masuk Antrean': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
const getPaymentClass = (payment: string) => {
  return payment === 'Lunas' ? 'text-green-600' : 'text-red-600';
};

const OrderTable = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
      <h3 className="font-bold text-xl text-(--color-text-primary) mb-4">Transaksi Terkini</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-(--color-light-primary-hover)">
              <th className="p-4">ID Pesanan</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total</th>
              <th className="p-4">Bayar</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-(--color-light-primary)">
                <td className="p-4 font-semibold text-(--color-brand-primary)">{order.id}</td>
                <td className="p-4 text-(--color-text-primary)">{order.customer}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-(--color-text-primary) font-medium">{order.total}</td>
                <td className={`p-4 font-semibold ${getPaymentClass(order.payment)}`}>
                  {order.payment}
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