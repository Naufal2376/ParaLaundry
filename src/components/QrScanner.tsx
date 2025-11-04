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
  // ID untuk div yang akan menjadi viewfinder
  const scannerRegionId = "qr-scanner-viewfinder";

  useEffect(() => {
    // Inisialisasi scanner
    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerRegionId,
      { 
        fps: 10, // Frame per second untuk scan
        qrbox: { width: 250, height: 250 }, // Ukuran kotak scan
      },
      false // Verbose (false = nonaktifkan log yang tidak perlu)
    );

    // Fungsi callback saat berhasil scan
    const handleSuccess = (decodedText: string, decodedResult: any) => {
      html5QrcodeScanner.clear(); // Hentikan scanner
      onScanSuccess(decodedText); // Kirim hasil ke parent
    };

    // Fungsi callback jika ada error (bisa diabaikan)
    const handleError = (errorMessage: string) => {
      // console.warn(errorMessage);
    };

    // Mulai render scanner
    html5QrcodeScanner.render(handleSuccess, handleError);

    // Cleanup: Hentikan scanner saat komponen ditutup
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Gagal membersihkan Html5QrcodeScanner.", error);
      });
    };
  }, [onScanSuccess]);

  return (
    // Modal Overlay
    <motion.div
      className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative" data-aos="zoom-in-up">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[--color-text-primary] shadow-lg"
          aria-label="Tutup scanner"
        >
          <X />
        </button>

        <h3 className="text-xl font-bold text-center text-[--color-text-primary] mb-4">
          Pindai Kode QR
        </h3>
        
        {/* Ini adalah div di mana viewfinder kamera akan muncul */}
        <div id={scannerRegionId} className="w-full" />
      </div>
    </motion.div>
  );
};

export default QrScanner;