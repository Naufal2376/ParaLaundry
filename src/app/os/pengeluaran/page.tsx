// src/app/os/pengeluaran/page.tsx
import React from "react"
import { Wallet } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ExpenseManager } from "@/components/os/ExpenseManager"
import PeriodSelector from "@/components/os/PeriodSelector" // <-- Import Selector
import { getPeriodDateRange } from "@/lib/dateUtils" // <-- Import Helper

export default async function ExpensePage(props: {
  searchParams: Promise<any>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "Owner" && profile?.role !== "Pegawai") redirect("/os")

  // 1. Hitung Rentang Tanggal
  const { start, end } = getPeriodDateRange(
    searchParams.period,
    searchParams.from,
    searchParams.to
  )

  // 2. Query dengan Filter Tanggal
  const { data: initialExpenses } = await supabase
    .from("expenses")
    .select("expense_id, tanggal_pengeluaran, keterangan, jumlah")
    // Filter berdasarkan rentang tanggal
    .gte("tanggal_pengeluaran", start.toISOString())
    .lte("tanggal_pengeluaran", end.toISOString())
    .order("tanggal_pengeluaran", { ascending: false })

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Wallet className="w-8 h-8 text-(--color-brand-primary)" />
          <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">
            Catat Pengeluaran
          </h1>
        </div>

        {/* 3. Pasang Filter */}
        <div className="w-full md:w-auto">
          <PeriodSelector />
        </div>
      </header>

      {/* Info rentang aktif */}
      <p className="text-sm text-gray-500 mb-6 px-1">
        Menampilkan pengeluaran: <b>{start.toLocaleDateString("id-ID")}</b> s/d{" "}
        <b>{end.toLocaleDateString("id-ID")}</b>
      </p>

      <ExpenseManager
        initialExpenses={initialExpenses || []}
        role={profile?.role || "Pegawai"}
      />
    </div>
  )
}
