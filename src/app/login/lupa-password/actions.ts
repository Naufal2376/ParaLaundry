// src/app/login/lupa-password/actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"

export async function sendOTP(email: string) {
  const supabase = await createClient()

  // Deteksi environment (Localhost atau Production)
  // Sebaiknya set NEXT_PUBLIC_BASE_URL di Environment Variables Vercel
  const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  // Arahkan ke /auth/callback, lalu minta callback meneruskan ke /login/reset-password
  const redirectUrl = `${origin}/auth/callback?next=/login/reset-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  })

  if (error) {
    console.error("Error sending recovery:", error.message)
    return { error: "Gagal memproses permintaan. Pastikan email benar." }
  }

  return { success: true }
}
