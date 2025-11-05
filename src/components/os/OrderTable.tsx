// src/components/os/OrderTable.tsx
"use client";
import React, { useMemo, useState, useTransition } from 'react';
import { updateOrderStatus, updatePaymentStatus } from '@/app/os/transaksi/actions';

// --- 1. PERBAIKAN TIPE DATA DI SINI ---
type Customer = {
  nama: string;
} | null; // Tipe customer sekarang adalah Objek atau null

export interface Order {
  order_id: number;
  customer_id: number;
  status_cucian: string;
  total_biaya: number; 
  status_bayar: string;
  customer: Customer; // <-- Diubah dari 'customers: Customer[]' menjadi 'customer: Customer'
}
// -----------------------------

interface OrderTableProps {
  orders: Order[];
}

// Opsi dropdown
const statusCucianOptions: StatusCucian[] = ["Masuk Antrean", "Proses Dicuci", "Siap Diambil", "Selesai"];
const statusBayarOptions: StatusBayar[] = ["Belum Lunas", "Lunas"];

type StatusCucian = "Masuk Antrean" | "Proses Dicuci" | "Siap Diambil" | "Selesai";
type StatusBayar = "Lunas" | "Belum Lunas";

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Proses Dicuci': return 'bg-yellow-100 text-yellow-800';
    case 'Siap Diambil': return 'bg-green-100 text-green-800';
    case 'Selesai': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
const getPaymentClass = (payment: string) => {
  return payment === 'Lunas' ? 'text-green-600' : 'text-red-600';
};

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<'order_id'|'customer'|'status_cucian'|'status_bayar'|'total_biaya'>('order_id');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');

  const handleStatusCucianChange = (orderId: number, newStatus: StatusCucian) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result?.error) alert(result.error);
    });
  };

  const handleStatusBayarChange = (orderId: number, newStatus: StatusBayar) => {
    startTransition(async () => {
      const result = await updatePaymentStatus(orderId, newStatus);
      if (result?.error) alert(result.error);
    });
  };

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? orders.filter(o =>
          String(o.order_id).includes(q) ||
          (o.customer?.nama?.toLowerCase() || '').includes(q) ||
          o.status_cucian.toLowerCase().includes(q) ||
          o.status_bayar.toLowerCase().includes(q)
        )
      : orders;
    const sorted = [...base].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const av = sortKey === 'customer' ? (a.customer?.nama || '') : (a as any)[sortKey];
      const bv = sortKey === 'customer' ? (b.customer?.nama || '') : (b as any)[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return sorted;
  }, [orders, query, sortKey, sortDir]);

  const onSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl text-(--color-text-primary)">Transaksi Terkini</h3>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari ID, nama, status..."
          className="p-2 border border-(--color-light-primary-active) rounded-lg w-64"
        />
      </div>
      <div className={`overflow-x-auto ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-(--color-light-primary-hover)">
              <th className="p-4 cursor-pointer" onClick={() => onSort('order_id')}>ID</th>
              <th className="p-4 cursor-pointer" onClick={() => onSort('customer')}>Pelanggan</th>
              <th className="p-4 cursor-pointer" onClick={() => onSort('status_cucian')}>Status Cucian</th>
              <th className="p-4 cursor-pointer" onClick={() => onSort('status_bayar')}>Status Bayar</th>
              <th className="p-4 cursor-pointer" onClick={() => onSort('total_biaya')}>Total</th>
            </tr>
            </thead>
          <tbody>
            {filteredSorted.map(order => (
              <tr key={order.order_id} className="border-b hover:bg-(--color-light-primary)">
                <td className="p-4 font-semibold text-(--color-brand-primary)">PL-{order.order_id}</td>
                
                {/* --- 2. PERBAIKAN TAMPILAN DI SINI --- */}
                <td className="p-4 text-(--color-text-primary)">
                  {order.customer?.nama || 'N/A'}
                </td>
                {/* ----------------------------- */}

                <td className="p-4">
                  <select
                    value={order.status_cucian}
                    onChange={(e) => handleStatusCucianChange(order.order_id, e.target.value as StatusCucian)}
                    className={`p-2 rounded-lg border text-sm font-medium ${getStatusClass(order.status_cucian)}`}
                    disabled={isPending}
                  >
                    {statusCucianOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <select
                    value={order.status_bayar}
                    onChange={(e) => handleStatusBayarChange(order.order_id, e.target.value as StatusBayar)}
                    className={`p-2 rounded-lg border text-sm font-semibold ${getPaymentClass(order.status_bayar)}`}
                    disabled={isPending}
                  >
                    {statusBayarOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-(--color-text-primary) font-medium">
                  Rp {Number(order.total_biaya).toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-(--color-dark-primary)">
                  Belum ada data transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;