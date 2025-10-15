// src/components/AOSInit.tsx
"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSInit = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true, // Animasi hanya berjalan sekali
    });
  }, []);

  return null;
};