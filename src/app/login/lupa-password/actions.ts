// src/app/login/lupa-password/actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"

export async function sendOTP(email: string) {
  const supabase = await createClient()

  // Kita hapus properti 'redirectTo' karena user akan input manual
  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    // Pesan error lebih spesifik untuk debugging (bisa disederhanakan untuk user public)
    console.error("Error sending recovery:", error.message)

    if (error.message.includes("Rate limit")) {
      return {
        error: "Terlalu banyak permintaan. Silakan tunggu beberapa saat lagi.",
      }
    }

    return { error: "Gagal mengirim kode. Pastikan email terdaftar dan benar." }
  }

  return { success: true }
}
