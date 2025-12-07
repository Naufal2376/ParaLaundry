// src/components/os/PeriodSelector.tsx
"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import React, { useState, useTransition } from "react"
import { Calendar, Filter, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PeriodSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [isOpen, setIsOpen] = useState(false)

  // Ambil state awal dari URL
  const initialFrom = searchParams.get("from") || ""
  const initialTo = searchParams.get("to") || ""

  // State lokal untuk input tanggal
  const [startDate, setStartDate] = useState(initialFrom)
  const [endDate, setEndDate] = useState(initialTo)

  // Label Tombol Utama
  let buttonLabel = "Filter Tanggal" // Default label

  if (initialFrom && initialTo) {
    const f = new Date(initialFrom).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })
    const t = new Date(initialTo).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    })
    buttonLabel = `${f} - ${t}`
  } else {
    // Jika tidak ada filter tanggal kustom (sedang pakai default sistem)
    // Kita bisa tampilkan label generik atau info default
    const activePeriod = searchParams.get("period")
    if (activePeriod) {
      buttonLabel =
        activePeriod.charAt(0).toUpperCase() + activePeriod.slice(1) + " Ini"
    }
  }

  // Fungsi Terapkan Custom Range
  const applyCustom = () => {
    // Validasi sederhana
    if (!startDate || !endDate) return

    const params = new URLSearchParams()
    params.set("from", startDate)
    params.set("to", endDate)
    params.delete("period") // Hapus preset jika ada agar tidak bentrok

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
      setIsOpen(false)
    })
  }

  // Fungsi Reset (Opsional: Jika ingin kembali ke default)
  const handleReset = () => {
    setStartDate("")
    setEndDate("")
    const params = new URLSearchParams()
    // Menghapus semua parameter akan mengembalikan ke default page (biasanya bulan ini)
    params.delete("from")
    params.delete("to")
    params.delete("period")

    startTransition(() => {
      router.push(`${pathname}`)
      setIsOpen(false)
    })
  }

  return (
    <>
      {/* 1. TOMBOL PEMICU */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all shadow-sm w-full md:w-auto justify-between md:justify-start"
      >
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" />
          <span className="font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
            {buttonLabel}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {/* 2. MODAL POP-UP */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Konten Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header Modal */}
              <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Filter size={18} className="text-blue-600" /> Filter
                    Tanggal
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                {/* Input Tanggal Manual */}
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 ml-1">
                      Dari Tanggal
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-700 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 ml-1">
                      Sampai Tanggal
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-700 cursor-pointer"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    {/* Tombol Reset (Opsional) */}
                    <button
                      onClick={handleReset}
                      className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                    >
                      Reset
                    </button>

                    {/* Tombol Terapkan */}
                    <button
                      onClick={applyCustom}
                      disabled={!startDate || !endDate || isPending}
                      className="flex-[2] py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex justify-center items-center gap-2 active:scale-[0.98]"
                    >
                      {isPending ? "..." : "Terapkan"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
