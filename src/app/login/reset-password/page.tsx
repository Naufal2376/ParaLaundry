// src/app/login/reset-password/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { updatePassword } from "./actions"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClient(), [])
  const [status, setStatus] = useState<
    "exchanging" | "ready" | "submitting" | "error"
  >("exchanging")
  const [msg, setMsg] = useState<string>("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  useEffect(() => {
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
      return
    }
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }: { error: any }) => {
        if (error) {
          setMsg("Sesi reset tidak valid atau sudah kedaluwarsa.")
          setStatus("error")
        } else {
          setStatus("ready")
        }
      })
      .catch(() => {
        setMsg("Gagal menukar kode reset. Coba lagi dari tautan email.")
        setStatus("error")
      })
  }, [searchParams, supabase])

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
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Reset Password</h1>
      {msg && <div className="mb-3 text-sm text-red-600">{msg}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="password"
          placeholder="Password baru"
          className="w-full rounded border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={status !== "ready" && status !== "submitting"}
        />
        <input
          type="password"
          placeholder="Konfirmasi password baru"
          className="w-full rounded border px-3 py-2"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={status !== "ready" && status !== "submitting"}
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-60"
          disabled={status !== "ready" && status !== "submitting"}
        >
          {status === "submitting" ? "Menyimpan..." : "Simpan Password"}
        </button>
      </form>
    </div>
  )
}
