// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = {
    supabase: await createClient(), // Buat klien (sudah async)
    response: NextResponse.next({
      request: {
        headers: new Headers(request.headers),
      },
    }),
  }

  // Ambil data pengguna yang sedang login
  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // --- LOGIKA KEAMANAN BARU ---

  // 1. Jika pengguna TIDAK login DAN mencoba mengakses area OS (kecuali login)
  if (!user && pathname.startsWith('/os')) {
    // Arahkan (redirect) ke halaman login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Jika pengguna SUDAH login DAN mencoba mengakses halaman login
  if (user && pathname === '/login') {
    // Arahkan (redirect) ke dashboard
    return NextResponse.redirect(new URL('/os', request.url));
  }
  
  // 3. Jika tidak ada masalah, lanjutkan seperti biasa
  await supabase.auth.getSession(); // Refresh sesi
  return response;
}

// Config matcher (tetap sama)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}