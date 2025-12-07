// src/components/os/PeriodSelector.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

type Period = 'hari' | 'minggu' | 'bulan' | 'tahun';

export default function PeriodSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get initial state from URL params to ensure server and client are in sync
  const initialPeriod = (searchParams.get("period") as Period) || "bulan"
  const initialFrom = searchParams.get("from") || ""
  const initialTo = searchParams.get("to") || ""

  // If 'from' exists, a custom period is active, so don't highlight any period button.
  const [activePeriod, setActivePeriod] = useState<Period | null>(
    initialFrom ? null : initialPeriod
  )
  const [startDate, setStartDate] = useState(initialFrom)
  const [endDate, setEndDate] = useState(initialTo)

  const handlePeriodChange = (newPeriod: Period) => {
    setActivePeriod(newPeriod)
    // Clear date inputs when a period button is clicked
    setStartDate("")
    setEndDate("")
    const params = new URLSearchParams()
    params.set("period", newPeriod)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleDateChange = () => {
    if (!startDate || !endDate) {
      alert("Silakan pilih tanggal mulai dan tanggal selesai.")
      return
    }
    // A custom date range is being applied, so no period button is active.
    setActivePeriod(null)
    const params = new URLSearchParams()
    params.set("from", startDate)
    params.set("to", endDate)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const getButtonClass = (p: Period) => {
    const base =
      "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base"
    if (activePeriod === p) {
      return `${base} bg-blue-600 text-white shadow-md`
    }
    return `${base} bg-white hover:bg-blue-50 text-gray-700 border border-gray-300`
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
