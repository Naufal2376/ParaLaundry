// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AOSInit } from "@/components/AOSInit";


const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Para Laundry - Solusi Laundry Cepat & Bersih",
  description: "Layanan laundry kiloan, satuan, dan ekspres profesional dengan harga terjangkau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <AOSInit />
      <body className={`${poppins.variable} font-poppins bg-light-primary text-text-primary`}>
        {children}
      </body>
    </html>
  );
}