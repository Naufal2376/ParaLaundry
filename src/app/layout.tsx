// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell"; // <-- Impor Shell Klien kita

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-poppins'
});

// Sekarang 'metadata' Anda akan berfungsi kembali!
export const metadata: Metadata = {
  title: "Para Laundry - Solusi Laundry Cepat & Bersih",
  description: "Layanan laundry kiloan, satuan, dan ekspres profesional.",
};

// Ini sekarang adalah Server Component (TANPA "use client")
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} font-poppins`}>
        {/* AppShell adalah Client Component yang berisi:
          - Preloader
          - AOSInit
          - BubbleCursor
          - FloatingBackgroundIcons
          - AnimatedBubbles
          - Dan {children} (halaman Anda)
        */}
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}