// src/components/os/ServiceTable.tsx
"use client";
import React, { useState, useTransition, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ServiceModal, type Service } from './ServiceModal'; // Impor Modal & Tipe
import { deleteService } from '@/app/os/layanan/actions';
import { Edit, Trash2, Search } from 'lucide-react';

interface ServiceTableProps {
  role: string | null;
  services: Service[];
}

export const ServiceTable: React.FC<ServiceTableProps> = ({ role, services }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');

  const isOwner = role === "Owner";

  const openModalForNew = () => {
    setEditingService(null); // Pastikan mode-nya 'Tambah Baru'
    setIsModalOpen(true);
  };

  const openModalForEdit = (service: Service) => {
    setEditingService(service); // Set data untuk mode 'Edit'
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      startTransition(async () => {
        await deleteService(id);
      });
    }
  };

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(s =>
      s.nama_layanan.toLowerCase().includes(q) ||
      String(s.harga).includes(q) ||
      s.satuan.toLowerCase().includes(q)
    );
  }, [services, query]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        {isOwner && (
          <button
            onClick={openModalForNew}
            className="shine-button flex items-center bg-(--color-brand-primary) text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            Tambah Layanan Baru
          </button>
        )}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari layanan..."
                className="pl-10 pr-4 py-2 border border-(--color-light-primary-active) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
            />
        </div>
      </div>

      {/* Tabel Data Layanan */}
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden mt-8 ${isPending ? 'opacity-50' : ''}`}>
        <table className="w-full text-left">
          <thead className="bg-(--color-light-primary-hover)">
            <tr>
              <th className="p-4">Nama Layanan</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Satuan</th>
              {isOwner && <th className="p-4 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filteredServices.map(service => (
              <tr key={service.service_id} className="border-b hover:bg-(--color-light-primary)">
                <td className="p-4 font-medium text-(--color-text-primary)">{service.nama_layanan}</td>
                <td className="p-4 text-(--color-dark-primary)">Rp {service.harga.toLocaleString('id-ID')}</td>
                <td className="p-4 text-(--color-dark-primary)">/{service.satuan}</td>
                {/* Tombol Edit/Hapus (Hanya Owner) */}
                {isOwner && (
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openModalForEdit(service)}
                      className="text-(--color-brand-primary) hover:text-(--color-brand-primary-hover) mr-4"
                      disabled={isPending}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.service_id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isPending}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render Modal (Pop-up) */}
      <AnimatePresence>
        {(isModalOpen || editingService) && (
          <ServiceModal
            service={editingService}
            onClose={() => {
              setIsModalOpen(false);
              setEditingService(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};