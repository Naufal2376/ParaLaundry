// src/components/AppShell.tsx
"use client"; // <-- INI ADALAH KUNCI UTAMA

import React, { useState, useEffect } from 'react';
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
  // State untuk mengelola preloader
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi waktu loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Tampilkan preloader selama 2.5 detik

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Inisialisasi AOS (Client Component) */}
      <AOSInit />
      {/* Kursor Gelembung (Client Component) */}
      <BubbleCursor />
      
      {/* Background global yang ramai (Client Component) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <FloatingBackgroundIcons />
        <AnimatedBubbles />
      </div>

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