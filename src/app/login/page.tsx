// src/app/login/page.tsx
"use client";
import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi login di sini
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-light-primary to-light-primary-hover">
      <div 
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl" 
        data-aos="zoom-in-up"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary">
            Para Laundry OS ✨
          </h1>
          <p className="mt-2 text-dark-primary">
            Silakan masuk untuk melanjutkan
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-primary" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-3 pl-12 pr-4 border border-light-primary-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-primary" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pl-12 pr-4 border border-light-primary-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-hover active:bg-brand-primary-active transition-all duration-300 transform hover:scale-105"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;