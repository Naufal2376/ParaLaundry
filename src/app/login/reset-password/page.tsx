// src/app/login/reset-password/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, CheckCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { updatePassword } from "./actions";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // Cek apakah ada token dari URL (Supabase redirect)
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    
    if (error) {
      setStatus("error");
      setMessage(errorDescription || "Link reset password tidak valid atau sudah kadaluarsa.");
    } else {
      setIsValidToken(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Password dan konfirmasi password tidak sama.");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setMessage("Password minimal 6 karakter.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const result = await updatePassword(password);

    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage("Password berhasil diubah! Anda akan diarahkan ke halaman login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  if (!isValidToken && status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-xl text-center">
          <div className="text-red-500 mb-4">
            <Lock className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Link Tidak Valid</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link
            href="/login/lupa-password"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Kirim Ulang Link Reset
          </Link>
        </div>
      </div>
    );
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
            <p className="text-gray-600 text-sm">Masukkan password baru Anda</p>
          </div>

          {/* Success State */}
          {status === "success" ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-700">{message}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Password Input */}
              <div className="mb-4">
                <div className="relative flex items-center bg-white/60 hover:bg-white/80 rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-all">
                  <div className="pl-4 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password Baru"
                    required
                    className="w-full py-4 px-3 bg-transparent outline-none text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-4 text-gray-400 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="mb-6">
                <div className="relative flex items-center bg-white/60 hover:bg-white/80 rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-all">
                  <div className="pl-4 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi Password Baru"
                    required
                    className="w-full py-4 px-3 bg-transparent outline-none text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="pr-4 text-gray-400 hover:text-blue-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
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
                    Menyimpan...
                  </>
                ) : (
                  "Reset Password"
                )}
              </motion.button>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link href="/login" className="text-gray-600 hover:text-gray-800 text-sm">
                  Kembali ke Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
