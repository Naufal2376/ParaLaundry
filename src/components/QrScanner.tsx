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
    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerRegionId,
      { 
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    // DIPERBAIKI: 'decodedResult: any' diubah menjadi '_decodedResult: unknown'
    const handleSuccess = (decodedText: string, _decodedResult: unknown) => {
      html5QrcodeScanner.clear();
      onScanSuccess(decodedText);
    };

    // DIPERBAIKI: 'errorMessage' diubah menjadi '_errorMessage'
    const handleError = (_errorMessage: string) => {
      // Kita memang sengaja tidak melakukan apa-apa saat error
    };

    html5QrcodeScanner.render(handleSuccess, handleError);

    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Gagal membersihkan Html5QrcodeScanner.", error);
      });
    };
  }, [onScanSuccess]);

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
          className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[--color-text-primary] shadow-lg"
          aria-label="Tutup scanner"
        >
          <X />
        </button>

        <h3 className="text-xl font-bold text-center text-[--color-text-primary] mb-4">
          Pindai Kode QR
        </h3>
        
        <div id={scannerRegionId} className="w-full" />
      </div>
    </motion.div>
  );
};

export default QrScanner;