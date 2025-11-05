// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AOSInit } from "@/components/AOSInit";
import BubbleCursor from "@/components/BubbleCursor"; // <-- PASTIKAN INI ADA
import FloatingBackgroundIcons from "@/components/FloatingBackgroundIcons";
import AnimatedBubbles from "@/components/AnimatedBubbles";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Para Laundry - Solusi Laundry Cepat & Bersih",
  description: "Layanan laundry kiloan, satuan, dan ekspres profesional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <AOSInit />
      <body className={`${poppins.variable} font-poppins`}>
        <BubbleCursor />
        {/* Background global yang ramai, berada di belakang semua section */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <FloatingBackgroundIcons />
          <AnimatedBubbles />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}