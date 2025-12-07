// src/components/os/Sidebar.tsx
"use client";
import {
  LayoutDashboard,
  FileText,
  List,
  PieChart,
  LogOut,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { logout } from "@/app/login/actions"
import Image from "next/image"
import Link from "next/link"

// --- KODE SIMULASI DIHAPUS ---
// type UserRole = "Pegawai" | "Owner"; <-- HAPUS
// const USER_ROLE: UserRole = "Pegawai"; <-- HAPUS

// Definisikan semua link yang mungkin ada
const allNavLinks = [
  {
    name: "Dashboard",
    href: "/os",
    icon: <LayoutDashboard />,
    roles: ["Pegawai", "Owner"],
  },
  {
    name: "Transaksi Baru",
    href: "/os/transaksi/baru",
    icon: <Sparkles />,
    roles: ["Pegawai", "Owner"],
  },
  {
    name: "Pengeluaran",
    href: "/os/pengeluaran",
    icon: <FileText />,
    roles: ["Owner", "Pegawai"],
  },
  {
    name: "Daftar Transaksi",
    href: "/os/transaksi",
    icon: <List />,
    roles: ["Pegawai", "Owner"],
  },
  {
    name: "Update Status",
    href: "/os/status",
    icon: <UserCheck />,
    roles: ["Pegawai", "Owner"],
  },
  {
    name: "Manajemen Layanan",
    href: "/os/layanan",
    icon: <PieChart />,
    roles: ["Owner", "Pegawai"],
  },
  { name: "Kelola User", href: "/os/users", icon: <Users />, roles: ["Owner"] },
  {
    name: "Laporan",
    href: "/os/laporan",
    icon: <TrendingUp />,
    roles: ["Owner", "Pegawai"],
  },
]

// 1. Tentukan tipe props yang diterima
interface SidebarProps {
  userRole: string | null
}

// 2. Terima 'userRole' sebagai prop
const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  // This is a temporary comment to trigger linter re-evaluation.
  const pathname = usePathname()

  // 3. Saring link navigasi berdasarkan 'userRole' dari prop
  const visibleNavLinks = allNavLinks.filter(
    (link) => userRole && link.roles.includes(userRole)
  )

  return (
    <aside className="w-64 flex flex-col p-4 bg-white h-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-4 px-2 flex-shrink-0">
        <div className="from-(--color-brand-primary) to-(--color-brand-primary-active) flex items-center justify-center">
          <Image
            src="/ParaLaundry.png"
            alt="Para Laundry Logo"
            width={50}
            height={50}
            className="rounded-md"
          />
        </div>
        <span className="text-xl font-bold text-(--color-text-primary)">
          Para Laundry
        </span>
      </div>

      {/* Info Peran Pengguna (Dinamis) */}
      <div className="mb-4 px-2 flex-shrink-0">
        <p className="text-xs text-(--color-dark-primary)">
          Anda login sebagai:
        </p>
        <div className="flex items-center gap-2 mt-1">
          {/* 4. Tampilkan ikon berdasarkan 'userRole' dari prop */}
          {userRole === "Owner" ? (
            <UserCog className="w-4 h-4 text-(--color-brand-primary)" />
          ) : (
            <UserCheck className="w-4 h-4 text-(--color-dark-primary)" />
          )}
          <span className="font-semibold text-(--color-text-primary) text-base">
            {userRole || "Tamu"}
          </span>
        </div>
      </div>

      {/* Menu Navigasi (Sudah difilter) dengan scroll */}
      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-1">
          {visibleNavLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`
                    flex items-center p-2.5 rounded-lg font-semibold transition-all duration-200 text-sm
                    ${
                      isActive
                        ? "bg-(--color-brand-primary) text-white shadow-md"
                        : "text-(--color-dark-primary) hover:bg-(--color-light-primary)"
                    }
                  `}
                >
                  <span className="mr-2 flex-shrink-0">{link.icon}</span>
                  <span className="truncate">{link.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Tombol Logout */}
      <div className="mt-3 flex-shrink-0">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center p-2.5 text-(--color-dark-primary) hover:bg-(--color-light-primary) rounded-lg w-full text-left text-sm"
          >
            <LogOut className="mr-2 flex-shrink-0" size={18} />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  )
}

export default Sidebar;