// src/components/os/ServiceModal.tsx
"use client";
import React, { useEffect } from 'react';
// 1. IMPOR DIPERBAIKI: Impor dari 'react-dom' (untuk React 18/Next.js stabil)
import { useFormState, useFormStatus } from 'react-dom'; 
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { createService, updateService, type ServiceFormState } from '@/app/os/layanan/actions';

// Tipe data untuk layanan (dari database)
export interface Service {
  service_id: number;
  nama_layanan: string;
  harga: number;
  satuan: string;
}

interface ServiceModalProps {
  service: Service | null; 
  onClose: () => void;
}

// Tombol Submit (useFormStatus dari 'react-dom')
function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
  const { pending } = useFormStatus(); // Ini sekarang akan berfungsi
  return (
    <button
      type="submit"
      disabled={pending}
      className="shine-button w-full bg-(--color-brand-primary) text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
    >
      {pending ? "Menyimpan..." : (isEditMode ? "Perbarui Layanan" : "Simpan Layanan Baru")}
    </button>
  );
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  const isEditMode = service !== null;
  const initialState: ServiceFormState = null;

  const action = isEditMode 
    ? updateService.bind(null, service.service_id)
    : createService;
    
  // 2. NAMA HOOK DIPERBAIKI: Gunakan 'useFormState' (nama lama dari react-dom)
  const [formState, formAction] = useFormState(action, initialState);

  // Efek untuk menutup modal secara otomatis setelah berhasil
  useEffect(() => {
    if (formState && !formState.error) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [formState, onClose]);

  return (
    <motion.div
      className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-(--color-text-primary) shadow-lg"
        >
          <X />
        </button>
        
        <h2 className="text-2xl font-bold text-(--color-text-primary) mb-6">
          {isEditMode ? "Edit Layanan" : "Tambah Layanan Baru"}
        </h2>
        
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-(--color-dark-primary) mb-1">Nama Layanan</label>
            <input 
              type="text"
              name="nama_layanan"
              defaultValue={service?.nama_layanan}
              required
              className="w-full p-3 border border-(--color-light-primary-active) rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--color-dark-primary) mb-1">Harga (Rp)</label>
              <input 
                type="number"
                name="harga"
                step="any" // Izinkan desimal
                defaultValue={service?.harga}
                required
                className="w-full p-3 border border-(--color-light-primary-active) rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--color-dark-primary) mb-1">Satuan</label>
              <select 
                name="satuan"
                defaultValue={service?.satuan}
                required
                className="w-full p-3 border border-(--color-light-primary-active) rounded-lg bg-white"
              >
                <option value="kg">kg</option>
                <option value="pcs">pcs</option>
              </select>
            </div>
          </div>
          
          {/* Tombol Submit dan Pesan Status */}
          <div className="pt-4">
            <SubmitButton isEditMode={isEditMode} />
            {formState?.message && (
              <p className={`text-sm mt-2 text-center ${
                formState.error ? 'text-red-500' : 'text-green-600'
              }`}>
                {formState.message}
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};