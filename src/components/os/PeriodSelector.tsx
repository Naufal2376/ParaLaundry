// src/components/os/PeriodSelector.tsx
"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import React, { useState, useTransition } from "react"
import { Calendar, Filter, X, ChevronDown, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PeriodSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [isOpen, setIsOpen] = useState(false)

  // State untuk custom range
  const initialFrom = searchParams.get("from") || ""
  const initialTo = searchParams.get("to") || ""
  const [startDate, setStartDate] = useState(initialFrom)
  const [endDate, setEndDate] = useState(initialTo)

  // Menentukan label tombol utama berdasarkan filter yang aktif
  const activePeriod = searchParams.get("period")
  const activeFrom = searchParams.get("from")
  const activeTo = searchParams.get("to")

  let buttonLabel = "Bulan Ini" // Default label
  if (activeFrom && activeTo) {
    // Jika custom range aktif, tampilkan tanggalnya
    const f = new Date(activeFrom).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })
    const t = new Date(activeTo).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    })
    buttonLabel = `${f} - ${t}`
  } else if (activePeriod) {
    // Jika preset aktif (hari/minggu/dll)
    buttonLabel =
      activePeriod.charAt(0).toUpperCase() + activePeriod.slice(1) + " Ini"
  }

  // Fungsi untuk menerapkan Preset (Hari/Minggu/Bulan/Tahun)
  const applyPreset = (period: string) => {
    const params = new URLSearchParams()
    params.set("period", period)
    // Hapus parameter custom date agar tidak bentrok
    params.delete("from")
    params.delete("to")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
      setIsOpen(false)
    })
  }

  // Fungsi untuk menerapkan Custom Range
  const applyCustom = () => {
    if (!startDate || !endDate) return
    const params = new URLSearchParams()
    params.set("from", startDate)
    params.set("to", endDate)
    // Hapus parameter period preset
    params.delete("period")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
      setIsOpen(false)
    })
  }

  return (
    <>
      {/* --- 1. TOMBOL PEMICU (TRIGGER BUTTON) --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all shadow-sm w-full md:w-auto justify-between md:justify-start"
      >
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" />
          <span className="font-medium text-sm sm:text-base">
            {buttonLabel}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {/* --- 2. MODAL POP-UP --- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop Gelap (Klik untuk tutup) */}
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
              className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header Modal */}
              <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Filter size={18} className="text-blue-600" /> Filter
                    Laporan
                  </h3>
                  <p className="text-xs text-gray-500">
                    Pilih rentang waktu data
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {/* Pilihan Cepat (Preset) */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    Pilih Cepat
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {["hari", "minggu", "bulan", "tahun"].map((p) => {
                      const isActive = activePeriod === p && !activeFrom
                      // Default "bulan" jika tidak ada parameter apapun
                      const isDefault =
                        !activePeriod && !activeFrom && p === "bulan"

                      return (
                        <button
                          key={p}
                          onClick={() => applyPreset(p)}
                          className={`
                                                    relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all
                                                    ${
                                                      isActive || isDefault
                                                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                                                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-600"
                                                    }
                                                `}
                        >
                          {p.charAt(0).toUpperCase() + p.slice(1)} Ini
                          {(isActive || isDefault) && (
                            <Check size={14} strokeWidth={3} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Divider dengan Teks */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase font-semibold">
                    <span className="bg-white px-3 text-gray-400">
                      Atau Kustom Tanggal
                    </span>
                  </div>
                </div>

                {/* Input Tanggal Kustom */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600 ml-1">
                        Dari Tanggal
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600 ml-1">
                        Sampai Tanggal
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <button
                    onClick={applyCustom}
                    disabled={!startDate || !endDate || isPending}
                    className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-slate-500/30 active:scale-[0.98] flex justify-center items-center gap-2"
                  >
                    {isPending ? "Memuat..." : "Terapkan Filter"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
