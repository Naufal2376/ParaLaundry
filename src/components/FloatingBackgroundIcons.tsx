// src/components/FloatingBackgroundIcons.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Shirt, Sparkles, Zap } from 'lucide-react';

const icons = [Shirt, Sparkles, Zap];

interface FloatingItem {
  id: number;
  Icon: React.ElementType;
  size: number;
  style: React.CSSProperties;
}

const FloatingBackgroundIcons = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    // Hasilkan ikon hanya di sisi klien setelah komponen dimuat
    const newItems = Array.from({ length: 15 }, (_, i) => {
      const Icon = icons[i % 3];
      const size = Math.random() * (24 - 12) + 12;
      return {
        id: i,
        Icon,
        size,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * (10 - 5) + 5}s ease-in-out infinite ${Math.random() * 5}s`,
        },
      };
    });
    setItems(newItems);
  }, []); // <-- Array dependensi kosong ini PENTING

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {items.map(item => (
        <div 
          key={item.id} 
          className="absolute text-[--color-brand-primary] opacity-10"
          style={item.style}
        >
          <item.Icon style={{ width: item.size, height: item.size }} />
        </div>
      ))}
    </div>
  );
};

export default FloatingBackgroundIcons;