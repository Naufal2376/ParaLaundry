// src/app/auth/callback/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  // Ambil parameter "next" untuk redirect setelah login (default ke dashboard atau home)
  const next = searchParams.get("next") ?? "/os"

  if (code) {
    const supabase = await createClient()

    // Tukar Auth Code menjadi Session (Cookies)
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Jika berhasil, redirect ke halaman tujuan
      // Gunakan 'origin' untuk memastikan redirect ke domain yang sama
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Jika gagal atau tidak ada code, kembalikan ke halaman login dengan error
  return NextResponse.redirect(
    `${origin}/login?message=Verifikasi gagal atau link kedaluwarsa`
  )
}
