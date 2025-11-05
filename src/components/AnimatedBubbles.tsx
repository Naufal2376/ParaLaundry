"use client";
import React, { useState, useEffect } from 'react';

interface Bubble {
  id: number;
  style: React.CSSProperties;
}

const AnimatedBubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Hasilkan gelembung HANYA di dalam useEffect (sisi klien)
    const newBubbles = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 95}%`,
        width: `${Math.random() * (16 - 6) + 6}px`,
        height: `${Math.random() * (16 - 6) + 6}px`,
        animation: `var(--animation-rise-bubble) ${Math.random() * (28 - 12) + 12}s linear ${Math.random() * 12}s infinite`,
      },
    }));
    setBubbles(newBubbles);
  }, []); // Array dependensi kosong

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {bubbles.map(bubble => (
        <div 
          key={bubble.id} 
          className="absolute bottom-0 w-4 h-4 bg-(--color-brand-primary) rounded-full opacity-20"
          style={bubble.style}
        />
      ))}
    </div>
  );
};

export default AnimatedBubbles;