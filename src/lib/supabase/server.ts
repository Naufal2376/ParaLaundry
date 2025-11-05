// src/lib/supabase/server.ts
"use server"; // <-- Tandai sebagai Modul Server

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Jadikan fungsi ini ASYNC
export async function createClient() { 
  // AWAIT cookies() untuk mendapatkan cookie store yang sebenarnya
  const cookieStore = await cookies(); 

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Tangani jika cookie tidak bisa di-set
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Tangani jika cookie tidak bisa dihapus
          }
        },
      },
    }
  );
}