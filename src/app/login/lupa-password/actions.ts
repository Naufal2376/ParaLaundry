"use server"

import { createClient } from "@/lib/supabase/server"

export async function sendOTP(email: string) {
  const supabase = await createClient()

  // Dapatkan URL dasar aplikasi (localhost atau domain produksi)
  // Pastikan Anda sudah set NEXT_PUBLIC_BASE_URL di .env.local atau Vercel
  const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  // GANTI: Menggunakan resetPasswordForEmail (Flow Recovery)
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // RedirectTO ini penting jika user mengklik LINK di email
    redirectTo: `${origin}/login/reset-password`,
  })

  if (error) {
    console.error("Error sending recovery:", error.message)
    // Pesan error umum untuk keamanan (user enumeration protection)
    return { error: "Gagal memproses permintaan. Pastikan email benar." }
  }

  return { success: true }
}
