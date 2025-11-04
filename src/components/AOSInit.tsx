"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSInit = () => {
  useEffect(() => {
    AOS.init({
      duration: 700, // Durasi animasi
      once: true,     // Animasi hanya berjalan sekali
    });
  }, []);

  return null;
};