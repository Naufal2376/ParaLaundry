"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyOTPAndResetPassword } from "./actions" // Import action yang baru
import Image from "next/image"
import { Lock, Mail, ArrowLeft, KeyRound } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const emailFromQuery = searchParams.get("email") || ""

  const [email, setEmail] = useState(emailFromQuery)
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle")
  const [msg, setMsg] = useState<string>("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg("")

    // Validasi dasar
    if (!email || !otp) {
      setMsg("Email dan kode OTP harus diisi.")
      setStatus("error")
      return
    }

    // --- PERBAIKAN: Hapus limitasi panjang karakter OTP ---
    // Token Supabase bisa 6 atau 8 digit (atau hash panjang jika dari link)
    // Jadi kita hanya bersihkan spasi (trim)
    const cleanToken = otp.trim()

    if (password.length < 6) {
      setMsg("Password minimal 6 karakter.")
      setStatus("error")
      return
    }

    if (password !== confirm) {
      setMsg("Konfirmasi password tidak sama.")
      setStatus("error")
      return
    }

    setStatus("submitting")

    // Panggil Server Action dengan token UTUH
    const res = await verifyOTPAndResetPassword(email, cleanToken, password)

    if (res?.error) {
      setMsg(res.error)
      setStatus("error")
    } else {
      setMsg("Password berhasil diubah! Mengalihkan ke login...")
      setStatus("success")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/ParaLaundry.png"
            alt="Para Laundry"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            Masukkan kode OTP dari email dan password baru.
          </p>
        </div>

        {msg && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              status === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                placeholder="Email Anda"
                className="w-full rounded-lg border pl-10 pr-3 py-3 focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kode OTP
            </label>
            <div className="relative">
              <KeyRound
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Contoh: 123456"
                // HAPUS maxLength={6} atau perbesar angkanya
                maxLength={20}
                className="w-full rounded-lg border pl-10 pr-3 py-3 font-mono tracking-widest focus:ring-2 focus:ring-blue-500"
                value={otp}
                // Izinkan input angka saja, tanpa memotong panjang string
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Masukkan kode angka yang Anda terima di email.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Baru
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                className="w-full rounded-lg border pl-10 pr-3 py-3 focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                placeholder="Ketik ulang password"
                className="w-full rounded-lg border pl-10 pr-3 py-3 focus:ring-2 focus:ring-blue-500"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
            disabled={status === "submitting" || status === "success"}
          >
            {status === "submitting" ? "Memproses..." : "Ubah Password"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={16} /> Kembali ke Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
