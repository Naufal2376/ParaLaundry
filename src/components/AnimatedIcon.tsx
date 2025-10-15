// src/components/AnimatedIcon.tsx
import React from 'react';
import { FaTshirt, FaSoap, FaStar, FaSun, FaMoon, FaPlus } from 'react-icons/fa';
import { GiWashingMachine, GiSparkles } from 'react-icons/gi';

const icons = [
  { icon: <FaTshirt className="text-xl" /> },
  { icon: <FaSoap className="text-lg" /> },
  { icon: <FaStar className="text-xl" /> },
  { icon: <FaSun className="text-2xl" /> },
  { icon: <FaMoon className="text-lg" /> },
  { icon: <GiSparkles className="text-xl" /> },
];

const AnimatedIcon = () => {
  // Atur seberapa jauh ikon dari pusat (sesuaikan jika perlu)
  const orbitRadius = "140px"; 
  const orbitDuration = 30; // Harus sama dengan durasi di CSS (dalam detik)
  const totalIcons = icons.length;

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
      
      {/* Ikon Mesin Cuci di Tengah */}
      <div className="absolute w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center shadow-2xl animate-[--animation-pulse]">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-[--color-light-primary] rounded-full flex items-center justify-center">
          <GiWashingMachine className="text-6xl md:text-7xl text-[--color-brand-primary] animate-[--animation-spin-slow]" />
        </div>
      </div>

      {/* Kontainer untuk semua Ikon yang Mengorbit */}
      <div className="w-full h-full">
        {icons.map((item, index) => {
          // Hitung sudut awal untuk setiap ikon agar tersebar merata
          const initialAngle = (360 / totalIcons) * index;
          // Hitung delay agar animasi dimulai dari posisi yang tersebar
          const animationDelay = `-${(orbitDuration / totalIcons) * index}s`;

          return (
            // "Lengan" tak terlihat yang berputar
            <div
              key={index}
              className="absolute top-1/2 left-1/2 w-px h-px"
              style={{ transform: `rotate(${initialAngle}deg)` }}
            >
              {/* Titik yang didorong keluar dan dianimasikan */}
              <div
                className="absolute top-0 left-0 animate-[--animation-orbit]"
                style={{
                  transform: `translateX(${orbitRadius})`,
                  animationDelay,
                }}
              >
                {/* Gelembung ikon yang melawan rotasi dan mengambang */}
                <div
                  className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg animate-[--animation-counter-orbit] animate-[--animation-float-slow]"
                  style={{ animationDelay }}
                >
                  <div className="text-[--color-brand-primary]">
                    {item.icon}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedIcon;