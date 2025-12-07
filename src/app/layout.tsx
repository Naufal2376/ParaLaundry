// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell"; // <-- Impor Shell Klien kita
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Para Laundry - Solusi Laundry Cepat & Bersih",
  description:
    "Layanan laundry kiloan, satuan, dan ekspres profesional di Indralaya. Cuci setrika, cuci kilat, sepatu, tas, selimut dengan harga terjangkau.",
  keywords: [
    "laundry indralaya",
    "cuci setrika",
    "laundry murah",
    "laundry kilat",
    "para laundry",
  ],
  authors: [{ name: "Para Laundry" }],
  openGraph: {
    title: "Para Laundry - Solusi Laundry Terpercaya",
    description:
      "Layanan laundry profesional di Indralaya dengan harga terjangkau",
    url: "https://para-laundry.vercel.app",
    siteName: "Para Laundry",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

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
          <Analytics/>
        </AppShell>
      </body>
    </html>
  );
}