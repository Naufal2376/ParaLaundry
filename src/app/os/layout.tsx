// src/app/os/layout.tsx
import Sidebar from "@/components/os/Sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Kita gunakan 'flex' untuk membuat sidebar dan konten berdampingan
    <div className="flex min-h-screen bg-(--color-light-primary)">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}