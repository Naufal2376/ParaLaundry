// src/components/os/OrderCard.tsx
import React from 'react';
import { Order } from './OrderTable';
import { getStatusClass, getPaymentClass, statusCucianOptions, statusBayarOptions } from './OrderTable';
import { QrCode, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface OrderCardProps {
  order: Order;
  onStatusCucianChange: (orderId: number, newStatus: any) => void;
  onStatusBayarChange: (orderId: number, newStatus: any) => void;
  onShowQr: (orderId: number) => void;
  isPending: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusCucianChange, onStatusBayarChange, onShowQr, isPending }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg text-(--color-brand-primary)">PL-{order.order_id}</p>
          <p className="text-gray-600">{order.customer?.nama || 'N/A'}</p>
        </div>
        <Link href={`/os/transaksi/sukses/${order.order_id}`} className="flex items-center text-blue-500">
          Detail <ChevronRight size={16} />
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500">Status Cucian</label>
          <select
            value={order.status_cucian}
            onChange={(e) => onStatusCucianChange(order.order_id, e.target.value)}
            className={`w-full p-2 rounded-lg border text-sm font-medium ${getStatusClass(order.status_cucian)}`}
            disabled={isPending}
          >
            {statusCucianOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-500">Status Bayar</label>
          <select
            value={order.status_bayar}
            onChange={(e) => onStatusBayarChange(order.order_id, e.target.value)}
            className={`w-full p-2 rounded-lg border text-sm font-semibold ${getPaymentClass(order.status_bayar)}`}
            disabled={isPending}
          >
            {statusBayarOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <p className="font-bold text-lg">Rp {Number(order.total_biaya).toLocaleString('id-ID')}</p>
        <button
          onClick={() => onShowQr(order.order_id)}
          className="flex items-center gap-1 text-(--color-brand-primary) hover:text-(--color-brand-primary-hover) disabled:opacity-50"
          disabled={isPending}
        >
          <QrCode size={16} />
          Lihat QR
        </button>
      </div>
    </div>
  );
};

export default OrderCard;