// src/components/AppShell.tsx
"use client"; // <-- INI ADALAH KUNCI UTAMA

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // <-- Impor hook
import { AnimatePresence } from 'framer-motion';
import { AOSInit } from "@/components/AOSInit";
import { PreloaderVisuals } from "@/components/Preloader";
import BubbleCursor from "@/components/BubbleCursor";
import FloatingBackgroundIcons from "@/components/FloatingBackgroundIcons";
import AnimatedBubbles from "@/components/AnimatedBubbles";

export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname(); // <-- Dapatkan path saat ini

  useEffect(() => {
    // Jika path adalah halaman dashboard, jangan tampilkan preloader
    if (pathname.startsWith('/os')) {
      setIsLoading(false);
      return;
    }

    // Simulasi waktu loading untuk halaman lain
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Tampilkan preloader selama 2.5 detik

    return () => clearTimeout(timer);
  }, [pathname]); // <-- Tambahkan pathname sebagai dependensi

  return (
    <>
      {/* Inisialisasi AOS (Client Component) */}
      <AOSInit />

      {/* Conditionally render heavy animations on non-functional pages */}
      {!pathname.startsWith('/login') && !pathname.startsWith('/os') && (
        <>
          <BubbleCursor />
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <FloatingBackgroundIcons />
            <AnimatedBubbles />
          </div>
        </>
      )}

      {/* Logika Preloader */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          // Jika sedang loading, tampilkan preloader
          <PreloaderVisuals key="preloader" />
        ) : (
          // Jika tidak, tampilkan konten halaman (children)
          <div key="content" className="relative z-10">
            {children}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}