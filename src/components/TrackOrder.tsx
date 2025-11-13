// src/components/TrackOrder.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Send } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import FloatingBackgroundIcons from '@/components/FloatingBackgroundIcons';
import AnimatedBubbles from '@/components/AnimatedBubbles';
import QrScanner from './QrScanner'; // Pastikan Anda juga sudah membuat file ini

const TrackOrder = () => {
  const router = useRouter();
  const [kode, setKode] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kode.trim()) {
      router.push(`/lacak/${kode.trim().toUpperCase()}`);
    } else {
      alert("Harap masukkan kode pesanan terlebih dahulu.");
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false);
    let finalCode = decodedText.trim().toUpperCase();
    
    try {
      const url = new URL(decodedText);
      const pathParts = url.pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart) {
        finalCode = lastPart.toUpperCase();
      }
    } catch (_e) {
      // Bukan URL, anggap itu adalah kodenya
    }

    router.push(`/lacak/${finalCode}`);
  };

  return (
    <>
      <AnimatePresence>
        {isScannerOpen && (
          <QrScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => setIsScannerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* PERBAIKAN: 
        - 'overflow-hidden' ditambahkan untuk memastikan ikon float tidak keluar batas
        - 'px-4' (padding horizontal) ditambahkan untuk mobile
      */}
      <section id="lacak" className="py-20 px-4 bg-white relative z-10 overflow-hidden">
        <FloatingBackgroundIcons />
        <AnimatedBubbles />
        <div className="container mx-auto">
          
          <h2 
            className="text-4xl font-bold text-center text-(--color-text-primary) mb-4" 
            data-aos="fade-down"
          >
            Lacak Pesanan Anda
          </h2>
          <p 
            className="text-center text-(--color-dark-primary) mb-12 max-w-2xl mx-auto" 
            data-aos="fade-down" 
            data-aos-delay="100"
          >
            Ketahui status cucian Anda secara real-time.
          </p>

          {/* PERBAIKAN: 
            - 'p-8 md:p-12' diubah menjadi 'p-6 sm:p-8 md:p-12' (padding lebih kecil di mobile)
            - 'px-4 py-6' ditambahkan untuk layar super kecil
          */}
          <div 
            className="max-w-3xl mx-auto bg-gradient-to-br from-(--color-light-primary) to-white px-4 py-6 sm:p-8 md:p-12 rounded-2xl shadow-xl" 
            data-aos="zoom-in-up"
          >
            {/* PERBAIKAN: 
              - 'md:grid-cols-3' diubah menjadi 'sm:grid-cols-3' (grid aktif lebih cepat)
              - 'gap-6' diubah menjadi 'gap-4 sm:gap-8' (gap lebih kecil di mobile)
            */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 items-center">
              
              {/* PERBAIKAN: 
                - 'md:col-span-1' diubah menjadi 'sm:col-span-1'
                - Ikon disembunyikan di layar XS (hidden) dan muncul di SM (sm:flex)
                  agar tidak memakan tempat di mobile.
              */}
              <div className="hidden sm:flex md:col-span-1 justify-center">
                <QrCode 
                  className="w-24 h-24 text-(--color-brand-primary) animate-[--animation-float-slow]"
                  style={{ animationDelay: '0.5s' }}
                />
              </div>

              {/* PERBAIKAN: 
                - 'md:col-span-2' diubah menjadi 'sm:col-span-2'
              */}
              <div className="sm:col-span-2">
                <h3 className="text-2xl font-bold text-(--color-text-primary) mb-4 text-center sm:text-left">
                  Punya Kode Pesanan?
                </h3>
                <p className="text-(--color-dark-primary) mb-6 text-sm text-center sm:text-left">
                  Masukkan kode pesanan (e.g., PL-123) atau pindai (scan) QR code pada nota Anda.
                </p>
                
                {/* PERBAIKAN: 
                  - 'flex-col sm:flex-row' ditambahkan agar tombol Lacak ada di bawah input pada mobile
                */}
                <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    placeholder="Ketik kode Anda..." 
                    className="flex-grow p-4 rounded-lg border-2 border-(--color-light-primary-active) focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary) transition-all"
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    aria-label="Lacak Pesanan"
                    className="shine-button text-white bg-(--color-brand-primary) p-4 rounded-lg flex items-center justify-center transition-all hover:bg-(--color-brand-primary-hover) hover:scale-105"
                  >
                    <Send size={24} />
                  </button>
                </form>

                <button 
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="w-full mt-4 bg-white text-(--color-brand-primary) border-2 border-(--color-brand-primary) p-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:bg-(--color-light-primary-hover) hover:scale-105"
                >
                  <QrCode size={20} />
                  Pindai dengan Kamera
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TrackOrder;