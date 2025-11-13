// src/components/os/OrderTable.tsx
"use client";
import React, { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { updateOrderStatus, updatePaymentStatus } from '@/app/os/transaksi/actions';
import { AnimatePresence } from 'framer-motion';
import { QrCodeModal } from './QrCodeModal';
import OrderCard from './OrderCard';
import { QrCode, Search, ChevronDown, ChevronUp } from 'lucide-react';

// Tipe data (interface) Anda
type Customer = {
  nama: string;
} | null;

export interface Order {
  order_id: number;
  customer_id: number;
  status_cucian: string;
  total_biaya: number;
  status_bayar: string;
  customer: Customer;
}

interface OrderTableProps {
  orders: Order[];
}

// Opsi dropdown dan fungsi helper
export const statusCucianOptions: StatusCucian[] = ["Masuk Antrean", "Proses Dicuci", "Siap Diambil", "Selesai"];
export const statusBayarOptions: StatusBayar[] = ["Belum Lunas", "Lunas"];
export type StatusCucian = "Masuk Antrean" | "Proses Dicuci" | "Siap Diambil" | "Selesai";
export type StatusBayar = "Lunas" | "Belum Lunas";

export const getStatusClass = (status: string) => {
  switch (status) {
    case 'Proses Dicuci': return 'bg-yellow-100 text-yellow-800';
    case 'Siap Diambil': return 'bg-green-100 text-green-800';
    case 'Selesai': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
export const getPaymentClass = (payment: string) => {
  return payment === 'Lunas' ? 'text-green-600' : 'text-red-600';
};
// -----------------------------

type SortKey = 'order_id' | 'customer' | 'status_cucian' | 'status_bayar' | 'total_biaya';

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const [isPending, startTransition] = useTransition();
  const [modalQrValue, setModalQrValue] = useState<string | null>(null);
  
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('order_id');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');

  // Handler (tetap sama)
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

  const handleShowQr = (orderId: number) => {
    const trackingUrl = `https://para-laundry.vercel.app/lacak/PL-${orderId}`;
    setModalQrValue(trackingUrl);
  };

  // Logika Filter dan Sort (tetap sama)
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
      const av = sortKey === 'customer' ? (a.customer?.nama || '') : a[sortKey];
      const bv = sortKey === 'customer' ? (b.customer?.nama || '') : b[sortKey];
      
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return sorted;
  }, [orders, query, sortKey, sortDir]);

  // Fungsi onSort (tetap sama)
  const onSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  
  const SortIcon = ({ colKey }: { colKey: SortKey }) => {
    if (sortKey !== colKey) return null;
    return sortDir === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <>
      <AnimatePresence>
        {modalQrValue && (
          <QrCodeModal
            value={modalQrValue}
            onClose={() => setModalQrValue(null)}
          />
        )}
      </AnimatePresence>
    
      <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-(--color-text-primary)">Daftar Transaksi</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari transaksi..."
                    className="pl-10 pr-4 py-2 border border-(--color-light-primary-active) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
                />
            </div>
        </div>
        
        <div className={`hidden md:block overflow-x-auto ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 cursor-pointer" onClick={() => onSort('order_id')}>
                    Order ID <SortIcon colKey="order_id" />
                </th>
                <th className="p-4 cursor-pointer" onClick={() => onSort('customer')}>
                    Customer <SortIcon colKey="customer" />
                </th>
                <th className="p-4 cursor-pointer" onClick={() => onSort('status_cucian')}>
                    Status Cucian <SortIcon colKey="status_cucian" />
                </th>
                <th className="p-4 cursor-pointer" onClick={() => onSort('status_bayar')}>
                    Status Bayar <SortIcon colKey="status_bayar" />
                </th>
                <th className="p-4 cursor-pointer" onClick={() => onSort('total_biaya')}>
                    Total <SortIcon colKey="total_biaya" />
                </th>
                <th className="p-4">QR Code</th>
                <th className="p-4">Detail</th>
              </tr>
            </thead>
            
            <tbody>
              {filteredSorted.length > 0 ? (
                filteredSorted.map(order => (
                  <tr key={order.order_id} className="border-b hover:bg-(--color-light-primary)">
                    <td className="p-4 font-semibold text-(--color-brand-primary)">PL-{order.order_id}</td>
                    <td className="p-4 text-(--color-text-primary)">
                      {order.customer?.nama || 'N/A'}
                    </td>
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
                    <td className="p-4">
                      <button
                        onClick={() => handleShowQr(order.order_id)}
                        className="flex items-center gap-1 text-(--color-brand-primary) hover:text-(--color-brand-primary-hover) disabled:opacity-50"
                        disabled={isPending}
                      >
                        <QrCode size={16} />
                        Lihat
                      </button>
                    </td>
                    <td className="p-4">
                        <Link href={`/os/transaksi/sukses/${order.order_id}`} className="text-blue-500 hover:underline">
                            Lihat Detail
                        </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-(--color-dark-primary)">
                    {orders.length === 0 ? "Belum ada data transaksi." : "Tidak ada hasil yang cocok dengan pencarian Anda."}
                  </td>
                </tr>
              )}
            </tbody>
            
          </table>
        </div>
        <div className="md:hidden">
          {filteredSorted.length > 0 ? (
            filteredSorted.map(order => (
              <OrderCard
                key={order.order_id}
                order={order}
                onStatusCucianChange={handleStatusCucianChange}
                onStatusBayarChange={handleStatusBayarChange}
                onShowQr={handleShowQr}
                isPending={isPending}
              />
            ))
          ) : (
            <div className="p-4 text-center text-(--color-dark-primary)">
              {orders.length === 0 ? "Belum ada data transaksi." : "Tidak ada hasil yang cocok dengan pencarian Anda."}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderTable;
