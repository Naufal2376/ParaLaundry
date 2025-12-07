"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendOTP(email: string) {
  const supabase = await createClient()

  // Kirim OTP 6 digit ke email
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Hanya untuk user yang sudah ada
    },
  })

  if (error) {
    return { error: "Gagal mengirim OTP. Pastikan email terdaftar." }
  }

  return { success: true }
}
