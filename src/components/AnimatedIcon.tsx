// src/components/AnimatedIcon.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
// DIPERBAIKI: Mengimpor WashingMachine dari lucide-react
import { Shirt, Sparkles, BedDouble, Footprints, WashingMachine } from 'lucide-react';

const icons = [
  { icon: <Shirt size={24} /> },
  { icon: <Sparkles size={20} /> },
  { icon: <BedDouble size={24} /> },
  { icon: <Footprints size={22} /> },
];

const AnimatedIcon = () => {
  const orbitRadius = "100px";
  const orbitDuration = 30;

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      
      {/* Ikon Mesin Cuci di Tengah */}
      <motion.div 
        className="absolute w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-2xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-24 h-24 md:w-32 md:h-32 bg-(--color-light-primary) rounded-full flex items-center justify-center">
          
          {/* DIPERBAIKI: Menggunakan ikon WashingMachine yang benar */}
          <WashingMachine className="text-5xl md:text-6xl text-(--color-brand-primary) animate-[--animation-spin-slow]" />

        </div>
      </motion.div>

      {/* Kontainer untuk Ikon yang Mengorbit */}
      <div className="w-full h-full">
        {icons.map((item, index) => {
          const angle = (360 / icons.length) * index;

          return (
            // "Lengan" tak terlihat yang berputar
            <motion.div
              key={index}
              className="absolute top-1/2 left-1/2 w-px h-px"
              style={{ transform: `rotate(${angle}deg)` }}
              animate={{ rotate: 360 + angle }}
              transition={{
                duration: orbitDuration,
                repeat: Infinity,
                ease: "linear",
                delay: -(orbitDuration / icons.length) * index,
              }}
            >
              {/* Titik yang didorong keluar */}
              <div
                className="absolute top-0 left-0"
                style={{ transform: `translateX(${orbitRadius})` }}
              >
                {/* Gelembung ikon yang melawan rotasi */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: orbitDuration,
                    repeat: Infinity,
                    ease: "linear",
                    delay: -(orbitDuration / icons.length) * index,
                  }}
                >
                  {/* Div ini TIDAK lagi memiliki animasi 'y' (naik-turun) */}
                  <div
                    className="text-(--color-brand-primary)"
                  >
                    {item.icon}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedIcon;