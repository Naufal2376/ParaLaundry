// src/components/os/QrCodeModal.tsx
"use client";
import React from 'react';
import { motion } from "framer-motion"
import { X } from 'lucide-react';
import QRCode from 'react-qr-code'; // Pastikan Anda sudah 'npm install react-qr-code'

interface QrCodeModalProps {
  value: string;      // URL pelacakan (misal: "https://.../lacak/PL-123")
  onClose: () => void; // Fungsi untuk menutup modal
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ value, onClose }) => {
  return (
    // 'AnimatePresence' akan menangani animasi keluar-masuk
    <motion.div
      className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs relative text-center"
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
        
        <h2 className="text-xl font-bold text-(--color-text-primary) mb-4">
          Kode QR Pelacakan
        </h2>
        
        {/* Kontainer QR Code */}
        <div className="bg-white p-4 border rounded-lg">
          <QRCode value={value} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
        </div>

        <p className="text-sm text-(--color-dark-primary) mt-4">
          Scan dengan kamera HP Anda untuk melacak pesanan.
        </p>
      </motion.div>
    </motion.div>
  );
};