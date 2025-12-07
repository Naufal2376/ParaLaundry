"use server";

import { createClient } from "@/lib/supabase/server";

export async function verifyOTPAndResetPassword(
  email: string,
  token: string,
  newPassword: string
) {
  const supabase = await createClient()

  // Verifikasi OTP
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  })

  if (verifyError) {
    return { error: "Kode OTP tidak valid atau sudah kedaluwarsa." }
  }

  // Update password setelah OTP valid
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    return { error: "Gagal mengubah password. Silakan coba lagi." }
  }

  return { success: true }
}
