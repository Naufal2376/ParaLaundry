// src/components/QrScanner.tsx
"use client";
import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanSuccess, onClose }) => {
  const scannerRegionId = "qr-scanner-viewfinder";

  useEffect(() => {
    // Buat variabel untuk menyimpan instance scanner
    let html5QrcodeScanner: Html5QrcodeScanner | null = null;

    // Fungsi untuk inisialisasi dan render scanner
    const startScanner = () => {
      // Hanya buat instance baru jika belum ada
      if (!html5QrcodeScanner) {
        html5QrcodeScanner = new Html5QrcodeScanner(
          scannerRegionId,
          { 
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          false 
        );
      }
      
      const handleSuccess = (decodedText: string, _decodedResult: unknown) => {
        onScanSuccess(decodedText);
      };

      const handleError = (_errorMessage: string) => {
        // Abaikan error (misal: "QR code not found")
      };

      // Render scanner
      html5QrcodeScanner.render(handleSuccess, handleError);
    };

    // Panggil fungsi untuk memulai
    startScanner();

    // --- INI ADALAH FUNGSI CLEANUP (PEMBERSIH) ---
    return () => {
      if (html5QrcodeScanner) {
        // Hentikan scanner dan bersihkan DOM
        html5QrcodeScanner.clear().catch(error => {
          console.error("Gagal membersihkan scanner:", error);
        });
        html5QrcodeScanner = null; // Hapus instance
      }
    };
  }, [onScanSuccess]); // 'onClose' dihapus dari dependensi agar tidak re-trigger

  return (
    <motion.div
      className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative" data-aos="zoom-in-up">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-(--color-text-primary) shadow-lg"
          aria-label="Tutup scanner"
        >
          <X />
        </button>

        <h3 className="text-xl font-bold text-center text-(--color-text-primary) mb-4">
          Pindai Kode QR
        </h3>
        
        {/* Div viewfinder */}
        <div id={scannerRegionId} className="w-full" />
      </div>
    </motion.div>
  );
};

export default QrScanner;