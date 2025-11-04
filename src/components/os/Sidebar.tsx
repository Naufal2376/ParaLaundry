// src/components/os/Sidebar.tsx
"use client";
import React from 'react';
import { LayoutDashboard, FileText, List, PieChart, LogOut, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

// Data link navigasi
const navLinks = [
  { name: 'Dashboard', href: '/os', icon: <LayoutDashboard /> },
  { name: 'Buat Transaksi', href: '/os/transaksi/baru', icon: <FileText /> },
  { name: 'Daftar Transaksi', href: '/os/transaksi', icon: <List /> },
  { name: 'Manajemen Layanan', href: '/os/layanan', icon: <PieChart /> },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen flex-col p-4 bg-white shadow-2xl sticky top-0">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-10 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-active) rounded-lg flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-(--color-text-primary)">Para Laundry</span>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-grow">
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name} className="mb-2">
                <a 
                  href={link.href}
                  className={`
                    flex items-center p-3 rounded-lg font-semibold transition-all duration-200
                    ${isActive 
                      ? 'bg-(--color-brand-primary) text-white shadow-md' 
                      : 'text-(--color-dark-primary) hover:bg-(--color-light-primary)'}
                  `}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tombol Logout */}
      <div className="mt-auto">
        <a 
          href="/login"
          className="flex items-center p-3 text-(--color-dark-primary) hover:bg-(--color-light-primary) rounded-lg"
        >
          <LogOut className="mr-3" />
          Keluar
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;