// src/components/os/ServiceCard.tsx
import React from 'react';
import { Service } from './ServiceModal';
import { Edit, Trash2 } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  isOwner: boolean;
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
  isPending: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isOwner, onEdit, onDelete, isPending }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg text-(--color-text-primary)">{service.nama_layanan}</p>
          <p className="text-gray-600">Rp {service.harga.toLocaleString('id-ID')} /{service.satuan}</p>
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(service)}
              className="text-(--color-brand-primary) hover:text-(--color-brand-primary-hover)"
              disabled={isPending}
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(service.service_id)}
              className="text-red-500 hover:text-red-700"
              disabled={isPending}
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;