// src/app/login/page.tsx
"use client";
import React, { useState } from 'react';
import { Sparkles, User, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Di masa depan, di sini akan ada logika verifikasi
    // Untuk sekarang, kita langsung arahkan ke dashboard
    router.push('/os');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-(--color-light-primary) to-white p-4">
      <motion.div 
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-active) rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-(--color-text-primary)">Para Laundry OS</span>
        </div>
        
        <h2 className="text-xl font-semibold text-center text-(--color-text-primary) mb-2">Selamat Datang</h2>
        <p className="text-center text-(--color-dark-primary) mb-8">Masuk untuk mengelola operasional laundry.</p>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-dark-primary)/50" />
            <input 
              type="text"
              placeholder="Username"
              defaultValue="pegawai" // Contoh data
              className="w-full py-3 pl-10 pr-4 border border-(--color-light-primary-active) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-dark-primary)/50" />
            <input 
              type="password"
              placeholder="Password"
              defaultValue="12345" // Contoh data
              className="w-full py-3 pl-10 pr-4 border border-(--color-light-primary-active) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold hover:cursor-pointer bg-(--color-brand-primary) rounded-lg shadow-lg hover:bg-(--color-brand-primary-hover) active:bg-(--color-brand-primary-active) transition-all duration-300 transform hover:scale-105"
          >
            Masuk
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;