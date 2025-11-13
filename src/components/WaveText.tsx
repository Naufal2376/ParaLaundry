// src/components/WaveText.tsx
"use client";
import { motion } from 'framer-motion';

const WaveText = ({ text }: { text: string }) => {
  const letters = Array.from(text);

  return (
    <motion.h1
      // overflow-hidden tidak lagi diperlukan
      className="text-4xl md:text-7xl font-bold text-(--color-text-primary) mb-6 flex justify-center flex-wrap"
      // Hapus variants, initial, dan animate dari kontainer
    >
      {letters.map((letter, index) => (
        <motion.span 
          key={index} 
          // Hapus 'variants' dari sini
          className={letter === ' ' ? 'mx-2' : ''}
          
          // --- KODE BARU DIMULAI DI SINI ---
          // Animasikan properti 'y' (naik dan turun)
          animate={{
            y: [0, -15, 0] // Keyframes: Posisi Awal -> Puncak -> Kembali ke Awal
          }}
          // Atur transisi untuk loop tak terbatas
          transition={{
            duration: 2, // Durasi satu siklus gelombang (naik dan turun)
            repeat: Infinity, // Ulangi selamanya
            ease: "easeInOut", // Gerakan yang halus
            
            // INI ADALAH KUNCI EFEK GELOMBANG:
            // Setiap huruf akan memulai animasinya 0.1 detik
            // setelah huruf sebelumnya.
            delay: index * 0.1 
          }}
          // --- KODE BARU SELESAI ---
        >
          {letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default WaveText;
