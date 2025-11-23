// src/app/login/page.tsx
"use client";

import { login } from "./actions";
import React, { useState, useEffect } from "react";
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shirt, 
  Droplets, 
  Sparkles, 
  WashingMachine
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Image from 'next/image';
import { useFormStatus } from "react-dom";

export const dynamic = "force-dynamic";

// --- 1. KOMPONEN BACKGROUND PARTIKEL ---
const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const icons = [Shirt, Droplets, Sparkles, WashingMachine];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gradient-to-br from-blue-50 via-white to-blue-100">      

      {/* Ikon Mengapung */}
      {Array.from({ length: 12 }).map((_, i) => {
        const Icon = icons[i % icons.length];
        const randomSize = Math.random() * 20 + 15;
        const randomDelay = Math.random() * 5;
        const randomDuration = Math.random() * 10 + 10;
        
        return (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: Math.random() * 100 + "vw", opacity: 0 }}
            animate={{ 
              y: "-10vh", 
              opacity: [0, 1, 0],
              rotate: 360 
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              delay: randomDelay,
              ease: "linear"
            }}
            className="absolute text-(--color-brand-primary)/20"
          >
            <Icon size={randomSize} />
          </motion.div>
        );
      })}
    </div>
  );
};

// --- 2. INPUT INTERAKTIF (OPTIMIZED WITH CSS TRANSITIONS) ---
const InteractiveInput = ({ 
  icon: Icon, 
  type, 
  name, 
  placeholder, 
  showPasswordToggle, 
  onTogglePassword, 
  isPasswordVisible 
}: any) => {
  // ID unik untuk menghubungkan label dan input
  const inputId = `input-${name}`;

  return (
    <div className="relative group mb-5">
      <div className={`relative flex items-center overflow-visible rounded-xl border-2 transition-all duration-300 z-10 
        bg-white/60 hover:bg-white/80
        focus-within:border-(--color-brand-primary) focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(0,132,255,0.15)]
      `}>
        {/* Ikon Sisi Kiri */}
        <div className="pl-4 text-gray-400 group-focus-within:text-(--color-brand-primary) transition-colors duration-300">
          <Icon size={20} />
        </div>

        <input
          id={inputId}
          type={type}
          name={name}
          placeholder=" " // Placeholder harus ada tapi kosong agar CSS selector berfungsi
          className="peer w-full py-4 px-3 bg-transparent outline-none text-gray-700 font-medium z-0"
          required
        />

        {/* Label Animasi (CSS-based) */}
        <label
          htmlFor={inputId}
          className="absolute top-4 left-12 text-gray-400 pointer-events-none font-medium transition-all duration-300 ease-in-out
            peer-placeholder-shown:top-4 peer-placeholder-shown:left-12 peer-placeholder-shown:scale-100
            peer-focus:-top-4 peer-focus:-left-0 peer-focus:scale-85 peer-focus:text-(--color-brand-primary) peer-focus:bg-white peer-focus:px-2 peer-focus:py-0 peer-focus:rounded-md peer-focus:shadow-sm
            peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:-left-0 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:py-0 peer-[:not(:placeholder-shown)]:rounded-md peer-[:not(:placeholder-shown)]:shadow-sm
          "
        >
          {placeholder}
        </label>
        
        {/* Toggle Password */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="pr-4 text-gray-400 hover:text-(--color-brand-primary) transition-colors"
          >
            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- 3. TOMBOL SUBMIT MAGNETIK ---
function MagneticButton() {
  const { pending } = useFormStatus();

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      disabled={pending}
      className="relative w-full py-4 bg-gradient-to-r from-(--color-brand-primary) to-(--color-brand-primary-active) text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 overflow-hidden group"
    >
      {/* Efek Kilau Bergerak */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_ease-in-out] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
      
      <div className="relative z-20 flex items-center justify-center gap-2">
        {pending ? (
          <>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <WashingMachine size={20} /> 
            </motion.div>
            <span>Memproses...</span>
          </>
        ) : (
          <>
            <span>Masuk ke Sistem</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </div>
    </motion.button>
  );
}

// --- 4. KARTU UTAMA (TANPA 3D TILT & LOGO CLEAN) ---
function LoginCard() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [showPassword, setShowPassword] = useState(false);
  const [greeting, setGreeting] = useState("Selamat Datang");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 18) setGreeting("Selamat Siang");
    else setGreeting("Selamat Malam");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 w-full max-w-[450px]"
    >
      <div className="relative bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
        
        {/* Dekorasi Lingkaran di dalam kartu */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-200/50 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-200/50 rounded-full blur-2xl" />

        {/* Header: Logo Bersih Tanpa Kotak */}
        <div className="text-center mb-8 relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <Image 
              src="/ParaLaundry.png" 
              alt="Logo Para Laundry" 
              width={100} 
              height={100} 
              className="object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              priority
            />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-(--color-text-primary)"
          >
            {greeting}!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-(--color-dark-primary)/80 mt-2 font-medium"
          >
            Silakan masuk ke <b>Para Laundry OS</b>
          </motion.p>
        </div>

        {/* Form */}
        <form action={login} className="relative z-10 space-y-2">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <InteractiveInput 
              icon={User} 
              type="email" 
              name="email" 
              placeholder="Email Pegawai / Owner" 
            />
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <InteractiveInput 
              icon={Lock} 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Kata Sandi" 
              showPasswordToggle={true}
              isPasswordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
          </motion.div>

          {/* Error Message dengan Shake Animation */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4 shadow-sm"
              >
                <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  {message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-2"
          >
            <MagneticButton />
          </motion.div>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-gray-400 mt-8"
        >
          &copy; {new Date().getFullYear()} Para Laundry. Security Encrypted.
        </motion.p>
      </div>
    </motion.div>
  );
}

// --- 5. WRAPPER UTAMA (100vh & Overflow Hidden) ---
export default function LoginPage() {
  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center relative font-poppins">
      <FloatingParticles />
      <div className="p-4 w-full flex justify-center">
        <LoginCard />
      </div>
    </div>
  );
}