// src/app/login/page.tsx
"use client";

import { login } from "./actions";
// 1. Impor useState dari React
import { Suspense, useState } from "react";
// 2. Impor ikon Eye dan EyeOff
import { Sparkles, User, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Image from 'next/image';

// ❗️ Penting: jangan prerender halaman login
export const dynamic = "force-dynamic";

function Login() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  // 3. Tambahkan state untuk melacak visibilitas password
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-(--color-light-primary) to-white p-4">
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" as const, stiffness: 100 }} // Perbaikan 'as const' untuk build Vercel
      >
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="from-(--color-brand-primary) to-(--color-brand-primary-active) flex items-center justify-center">
            <Image 
              src="/ParaLaundry.png" 
              alt="Para Laundry Logo" 
              width={32} 
              height={32}
              className="rounded-md"
            />
          </div>
          <span className="text-2xl font-bold text-(--color-text-primary)">
            Para Laundry OS
          </span>
        </div>

        <h2 className="text-xl font-semibold text-center text-(--color-text-primary) mb-2">
          Selamat Datang
        </h2>
        <p className="text-center text-(--color-dark-primary) mb-8">
          Masuk untuk mengelola operasional laundry.
        </p>

        <form action={login} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-dark-primary)/50" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full py-3 pl-10 pr-4 border border-(--color-light-primary-active) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
            />
          </div>
          
          {/* --- 4. PERBAIKAN PADA BLOK PASSWORD --- */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-dark-primary)/50" />
            <input
              // Ubah 'type' menjadi dinamis
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              // Tambahkan padding di kanan (pr-10) untuk ikon mata
              className="w-full py-3 pl-10 pr-10 border border-(--color-light-primary-active) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
            />
            {/* Tambahkan tombol/ikon mata di sini */}
            <button
              type="button" // PENTING: agar tidak men-submit form
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-dark-primary)/50 cursor-pointer"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {/* --- AKHIR PERBAIKAN --- */}

          {message && (
            <p className="text-sm text-center text-red-500">{message}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-(--color-brand-primary) rounded-lg shadow-lg hover:bg-(--color-brand-primary-hover) active:bg-(--color-brand-primary-active) transition-all duration-300 transform hover:scale-105"
          >
            Masuk
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}