// src/components/os/PeriodSelector.tsx
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useState, useTransition } from "react"

export default function PeriodSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get initial state from URL params to ensure server and client are in sync
  const initialFrom = searchParams.get("from") || ""
  const initialTo = searchParams.get("to") || ""
  const [startDate, setStartDate] = useState(initialFrom)
  const [endDate, setEndDate] = useState(initialTo)

  const handleDateChange = () => {
    if (!startDate || !endDate) {
      alert("Silakan pilih tanggal mulai dan tanggal selesai.")
      return
    }
    const params = new URLSearchParams()
    params.set("from", startDate)
    params.set("to", endDate)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div
      className={`transition-opacity ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Date range selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex-1 w-full">
          <label
            htmlFor="start-date"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Dari Tanggal
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 w-full">
          <label
            htmlFor="end-date"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Sampai Tanggal
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full sm:w-auto self-end">
          <button
            onClick={handleDateChange}
            disabled={!startDate || !endDate || isPending}
            className="w-full px-6 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            Terapkan
          </button>
        </div>
      </div>

      {/* Display active custom date range */}
      {initialFrom && initialTo && (
        <p className="text-sm text-gray-600 mt-3">
          Menampilkan laporan dari{" "}
          <strong>
            {new Date(initialFrom).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>{" "}
          sampai{" "}
          <strong>
            {new Date(initialTo).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>
          .
        </p>
      )}
    </div>
  )
}
