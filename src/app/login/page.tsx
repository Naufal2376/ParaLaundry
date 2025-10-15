// src/app/login/page.tsx
"use client";
import React from 'react';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[--color-light-primary] to-[--color-light-primary-hover]">
      <div 
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl" 
        data-aos="zoom-in-up"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[--color-text-primary]">
            Para Laundry OS ✨
          </h1>
          <p className="mt-2 text-[--color-dark-primary]">
            Silakan masuk untuk melanjutkan
          </p>
        </div>
        <form className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-dark-primary]" />
            <input
              type="text"
              placeholder="Username"
              className="w-full py-3 pl-12 pr-4 border border-[--color-light-primary-hover] rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-brand-primary]"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-dark-primary]" />
            <input
              type="password"
              placeholder="Password"
              className="w-full py-3 pl-12 pr-4 border border-[--color-light-primary-hover] rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-brand-primary]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-[--color-brand-primary] rounded-lg hover:bg-[--color-brand-primary-hover] active:bg-[--color-brand-primary-active] transition-all duration-300 transform hover:scale-105"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;