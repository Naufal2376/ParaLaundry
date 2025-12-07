// src/app/login/reset-password/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { updatePassword } from "./actions"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [status, setStatus] = useState<
    "exchanging" | "ready" | "submitting" | "error"
  >("exchanging")
  const [msg, setMsg] = useState<string>("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  useEffect(() => {
    const error = searchParams.get("error")
    const errorDesc = searchParams.get("error_description")

    // Jika Supabase sudah memberi error (expired / invalid)
    if (error) {
      setMsg(
        errorDesc ||
          "Tautan reset sudah kedaluwarsa atau tidak valid. Silakan minta tautan baru."
      )
      setStatus("error")
      const timer = setTimeout(() => router.push("/login/lupa-password"), 1800)
      return () => clearTimeout(timer)
    }

    const codeFromQuery = searchParams.get("code")
    const codeFromHash = new URLSearchParams(
      window.location.hash.replace("#", "?")
    ).get("code")
    const code = codeFromQuery || codeFromHash

    if (!code) {
      setMsg(
        "Kode reset tidak ditemukan. Silakan buka ulang tautan dari email."
      )
      setStatus("error")
      const timer = setTimeout(() => router.push("/login/lupa-password"), 1800)
      return () => clearTimeout(timer)
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }: { error: any }) => {
        if (error) {
          setMsg("Sesi reset tidak valid atau sudah kedaluwarsa.")
          setStatus("error")
          const timer = setTimeout(
            () => router.push("/login/lupa-password"),
            1800
          )
          return () => clearTimeout(timer)
        }
        setStatus("ready")
      })
      .catch(() => {
        setMsg("Gagal menukar kode reset. Coba lagi dari tautan email.")
        setStatus("error")
        const timer = setTimeout(
          () => router.push("/login/lupa-password"),
          1800
        )
        return () => clearTimeout(timer)
      })
  }, [router, searchParams, supabase])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setMsg("Password minimal 6 karakter.")
      return
    }
    if (password !== confirm) {
      setMsg("Konfirmasi password tidak sama.")
      return
    }
    setStatus("submitting")
    const res = await updatePassword(password)
    if (res?.error) {
      setMsg(res.error)
      setStatus("ready")
    } else {
      setMsg("Password berhasil diubah. Silakan login.")
      setStatus("ready")
      setTimeout(() => router.push("/login"), 1200)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">Masukkan password baru Anda</p>
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
              Password baru
            </label>
            <input
              type="password"
              placeholder="Password baru"
              className="w-full rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status !== "ready" && status !== "submitting"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi password baru
            </label>
            <input
              type="password"
              placeholder="Konfirmasi password baru"
              className="w-full rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={status !== "ready" && status !== "submitting"}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={status !== "ready" && status !== "submitting"}
          >
            {status === "submitting" ? "Menyimpan..." : "Simpan Password"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Tidak ada kode?{" "}
            <a
              href="/login/lupa-password"
              className="text-blue-600 hover:underline"
            >
              Kirim ulang
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
