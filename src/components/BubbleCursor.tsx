// src/components/BubbleCursor.tsx
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipe data untuk setiap gelembung
interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
}

const BubbleCursor = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    let lastMove = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Hanya buat gelembung baru setiap 50ms (throttle)
      if (now - lastMove < 50) return; 
      lastMove = now;

      const newBubble: Bubble = {
        id: now,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * (20 - 10) + 10, // Ukuran acak
      };
      
      setBubbles(prev => [...prev, newBubble]);

      // Hapus gelembung dari state setelah 1 detik (sesuai durasi transisi)
      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
      }, 1000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []); // Hanya berjalan sekali saat komponen dimuat

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      <AnimatePresence>
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            className="absolute bg-[--color-brand-primary] rounded-full opacity-70" // Dibuat sedikit transparan
            
            // --- LOGIKA ANIMASI YANG BENAR ---
            style={{
              // Atur posisi awal dan ukuran di sini
              left: bubble.x - (bubble.size / 2),
              top: bubble.y - (bubble.size / 2),
              width: bubble.size,
              height: bubble.size,
            }}
            
            initial={{ 
              opacity: 0, 
              scale: 0.5 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: -50 // Bergerak ke atas 50px
            }}
            exit={{ 
              opacity: 0, 
              scale: 0 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            // --- AKHIR PERBAIKAN ---
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BubbleCursor;