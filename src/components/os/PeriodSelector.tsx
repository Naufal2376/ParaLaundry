// src/components/os/PeriodSelector.tsx
"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import React, { useState, useTransition, useEffect } from "react"
import {
  Calendar as CalendarIcon,
  Filter,
  X,
  ChevronDown,
  Check,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Calendar from "./Calendar"
import { DateRange } from "react-day-picker"

export default function PeriodSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [isOpen, setIsOpen] = useState(false)

  // State untuk range kalender
  const initialFrom = searchParams.get("from")
  const initialTo = searchParams.get("to")

  const [date, setDate] = useState<DateRange | undefined>({
    from: initialFrom ? new Date(initialFrom) : undefined,
    to: initialTo ? new Date(initialTo) : undefined,
  })

  // Label Tombol
  const activePeriod = searchParams.get("period")
  let buttonLabel = "Bulan Ini"

  if (initialFrom && initialTo) {
    const f = format(new Date(initialFrom), "dd MMM", { locale: id })
    const t = format(new Date(initialTo), "dd MMM yyyy", { locale: id })
    buttonLabel = `${f} - ${t}`
  } else if (activePeriod) {
    buttonLabel =
      activePeriod.charAt(0).toUpperCase() + activePeriod.slice(1) + " Ini"
  }

  // Reset kalender jika preset dipilih
  const applyPreset = (period: string) => {
    const params = new URLSearchParams()
    params.set("period", period)
    params.delete("from")
    params.delete("to")

    // Bersihkan state kalender lokal
    setDate(undefined)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
      setIsOpen(false)
    })
  }

  // Terapkan Range dari Kalender
  const applyCustom = () => {
    if (!date?.from || !date?.to) return

    const params = new URLSearchParams()
    // Konversi date object ke string YYYY-MM-DD
    params.set("from", format(date.from, "yyyy-MM-dd"))
    params.set("to", format(date.to, "yyyy-MM-dd"))
    params.delete("period")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
      setIsOpen(false)
    })
  }

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all shadow-sm w-full md:w-auto justify-between md:justify-start"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-blue-600" />
          <span className="font-medium text-sm sm:text-base">
            {buttonLabel}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {/* MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Filter size={18} className="text-blue-600" /> Filter Data
                </h3>
                <button onClick={() => setIsOpen(false)}>
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {/* Preset Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {["hari", "minggu", "bulan", "tahun"].map((p) => {
                    const isActive = activePeriod === p && !initialFrom
                    const isDefault =
                      !activePeriod && !initialFrom && p === "bulan"
                    return (
                      <button
                        key={p}
                        onClick={() => applyPreset(p)}
                        className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all ${
                          isActive || isDefault
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    )
                  })}
                </div>

                <div className="relative mb-6 text-center">
                  <span className="bg-white px-3 text-xs text-gray-400 uppercase font-semibold">
                    Atau Pilih Tanggal
                  </span>
                </div>

                {/* KALENDER VISUAL */}
                <div className="flex justify-center mb-4">
                  <Calendar
                    mode="range" // Mode Range untuk tarik tanggal
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1} // Tampilkan 1 bulan agar muat di HP
                  />
                </div>

                {/* Action Button */}
                <button
                  onClick={applyCustom}
                  disabled={!date?.from || !date?.to || isPending}
                  className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex justify-center items-center gap-2"
                >
                  {isPending ? "Memuat..." : "Terapkan Filter"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}