// src/components/Preloader.tsx
"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

// Varian animasi untuk teks (DENGAN PERBAIKAN)
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1 + 0.5, // Tambahkan delay awal
      duration: 0.5,
      type: "spring" as const, // <-- PERBAIKAN DI SINI
      damping: 12,
      stiffness: 100
    },
  }),
};

// Ini HANYA komponen visual untuk preloader
export const PreloaderVisuals = () => {
  const logoText = "Para Laundry";

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-(--color-light-primary) z-[9999]"
      // Animasi untuk seluruh layar loading
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
    >
      <motion.div
        // Animasi untuk logo
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6"
      >
        <Image
          src="/ParaLaundry.png"
          alt="Para Laundry Logo"
          width={100} // Ukuran logo di preloader
          height={100}
          className="animate-pulse"
          priority // Prioritaskan loading logo
        />
      </motion.div>
      
      {/* Kontainer untuk animasi teks "Para Laundry" */}
      <motion.h1 
        className="text-4xl font-extrabold tracking-wider text-(--color-text-primary) flex"
        initial="hidden"
        animate="visible"
      >
        {logoText.split("").map((char, i) => (
          <motion.span 
            key={i} 
            variants={textVariants} // <-- Ini sekarang akan valid
            custom={i}
            className={char === ' ' ? 'mx-1' : ''}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
    </motion.div>
  );
};

// Ekspor default agar 'AppShell' bisa menemukannya
export default PreloaderVisuals;