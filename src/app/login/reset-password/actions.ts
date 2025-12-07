"use server"

import { createClient } from "@/lib/supabase/server"

export async function verifyOTPAndResetPassword(
  email: string,
  token: string, // Token ini bisa 6 atau 8 digit tergantung setting Supabase
  newPassword: string
) {
  const supabase = await createClient()

  // 1. Verifikasi Token dengan tipe 'recovery'
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery", // <-- KUNCI PERBAIKAN: Ubah tipe ke recovery
  })

  if (verifyError) {
    return { error: `Kode verifikasi salah atau kedaluwarsa.` }
  }

  // 2. Update Password setelah sesi recovery aktif
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    return { error: "Gagal memperbarui password. Silakan coba lagi." }
  }

  return { success: true }
}
