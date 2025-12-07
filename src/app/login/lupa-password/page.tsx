// src/app/login/lupa-password/page.tsx
"use client";

import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"
import { sendOTP } from "./actions"

export default function LupaPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    const result = await sendOTP(email)

    if (result.error) {
      setStatus("error")
      setMessage(result.error)
    } else {
      setStatus("success")
      setMessage(
        "Kode OTP 6 digit telah dikirim ke email Anda. Silakan cek inbox atau folder spam."
      )
      // Redirect ke halaman verifikasi OTP setelah 2 detik
      setTimeout(() => {
        router.push(`/login/reset-password?email=${encodeURIComponent(email)}`)
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/ParaLaundry.png"
                alt="Para Laundry"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Lupa Password?
            </h1>
            <p className="text-gray-600 text-sm">
              Masukkan email Anda dan kami akan mengirimkan kode OTP 6 digit
            </p>
          </div>

          {/* Form atau Success Message */}
          {status === "success" ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-700 mb-6">{message}</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft size={20} />
                Kembali ke Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-6">
                <div className="relative flex items-center bg-white/60 hover:bg-white/80 rounded-xl border-2 border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <div className="pl-4 text-gray-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Anda"
                    required
                    className="w-full py-4 px-3 bg-transparent outline-none text-gray-700"
                  />
                </div>
              </div>

              {/* Error Message */}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm"
                >
                  {message}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Kode OTP"
                )}
              </motion.button>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
                >
                  <ArrowLeft size={16} />
                  Kembali ke Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
