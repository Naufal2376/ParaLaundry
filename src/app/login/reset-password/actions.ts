// src/app/login/reset-password/actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"

export async function verifyOTPAndResetPassword(
  email: string,
  token: string,
  newPassword: string
) {
  const supabase = await createClient()

  // 1. Verifikasi Token
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  })

  if (verifyError) {
    console.error("Verify Error:", verifyError) // Log untuk debugging di server console

    // Terjemahkan error umum dari Supabase
    if (
      verifyError.message.includes("Token has expired") ||
      verifyError.message.includes("Invalid token")
    ) {
      return {
        error:
          "Kode OTP salah atau sudah kedaluwarsa. Silakan minta kode baru.",
      }
    }

    return { error: `Gagal verifikasi: ${verifyError.message}` }
  }

  // 2. Update Password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    console.error("Update Password Error:", updateError)

    if (updateError.message.includes("Password should be")) {
      return { error: "Password terlalu lemah. Gunakan minimal 6 karakter." }
    }
    if (updateError.message.includes("New password should be different")) {
      return { error: "Password baru tidak boleh sama dengan password lama." }
    }

    return {
      error: "Terjadi kesalahan saat menyimpan password. Silakan coba lagi.",
    }
  }

  return { success: true }
}
