"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendResetEmail(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://para-laundry.vercel.app"
    }/login/reset-password`,
  })

  if (error) {
    return { error: "Gagal mengirim email reset password. Pastikan email terdaftar." };
  }

  return { success: true };
}
