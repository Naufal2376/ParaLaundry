// src/components/os/Sidebar.tsx
"use client";
import React from 'react';
import { LayoutDashboard, FileText, List, PieChart, LogOut, Sparkles, TrendingUp, UserCheck, UserCog } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/login/actions';

// --- KODE SIMULASI DIHAPUS ---
// type UserRole = "Pegawai" | "Owner"; <-- HAPUS
// const USER_ROLE: UserRole = "Pegawai"; <-- HAPUS

// Definisikan semua link yang mungkin ada
const allNavLinks = [
  { name: 'Dashboard', href: '/os', icon: <LayoutDashboard />, roles: ['Pegawai', 'Owner'] },
  { name: 'Buat Transaksi', href: '/os/transaksi/baru', icon: <FileText />, roles: ['Pegawai', 'Owner'] },
  { name: 'Daftar Transaksi', href: '/os/transaksi', icon: <List />, roles: ['Pegawai', 'Owner'] },
  { name: 'Manajemen Layanan', href: '/os/layanan', icon: <PieChart />, roles: ['Owner'] }, // <-- Owner Only
  { name: 'Laporan Keuangan', href: '/os/laporan', icon: <TrendingUp />, roles: ['Owner'] }, // <-- Owner Only
];

// 1. Tentukan tipe props yang diterima
interface SidebarProps {
  userRole: string | null;
}

// 2. Terima 'userRole' sebagai prop
const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const pathname = usePathname();

  // 3. Saring link navigasi berdasarkan 'userRole' dari prop
  const visibleNavLinks = allNavLinks.filter(link => 
    userRole && link.roles.includes(userRole)
  );

  return (
    <aside className="w-64 h-screen flex flex-col p-4 bg-white shadow-2xl sticky top-0">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-6 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-active) rounded-lg flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-(--color-text-primary)">Para Laundry</span>
      </div>

      {/* Info Peran Pengguna (Dinamis) */}
      <div className="mb-6 px-2">
        <p className="text-sm text-(--color-dark-primary)">Anda login sebagai:</p>
        <div className="flex items-center gap-2 mt-1">
          {/* 4. Tampilkan ikon berdasarkan 'userRole' dari prop */}
          {userRole === "Owner" 
            ? <UserCog className="w-5 h-5 text-(--color-brand-primary)" />
            : <UserCheck className="w-5 h-5 text-(--color-dark-primary)" />
          }
          <span className="font-semibold text-(--color-text-primary) text-lg">{userRole || 'Tamu'}</span>
        </div>
      </div>

      {/* Menu Navigasi (Sudah difilter) */}
      <nav className="flex-grow">
        <ul>
          {visibleNavLinks.map((link) => {
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
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center p-3 text-(--color-dark-primary) hover:bg-(--color-light-primary) rounded-lg w-full text-left"
          >
            <LogOut className="mr-3" />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;