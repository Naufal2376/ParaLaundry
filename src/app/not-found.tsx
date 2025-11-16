// src/app/not-found.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-2xl font-semibold mb-4">Halaman tidak ditemukan</h1>
      <p>Anda akan dialihkan ke halaman utama...</p>
    </div>
  );
}
