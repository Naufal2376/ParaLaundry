// src/app/os/transaksi/page.tsx
import { List, Plus } from "lucide-react"
import React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import OrderTable, { type Order } from "@/components/os/OrderTable"
import PeriodSelector from "@/components/os/PeriodSelector" // <-- Import Selector
import { getPeriodDateRange } from "@/lib/dateUtils" // <-- Import Helper

// Tambahkan prop searchParams
export default async function TransaksiPage(props: {
  searchParams: Promise<any>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  // 1. Hitung Rentang Tanggal
  const { start, end } = getPeriodDateRange(
    searchParams.period,
    searchParams.from,
    searchParams.to
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  let userRole: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profile) userRole = profile.role
  }

  // 2. Query dengan Filter Tanggal
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      order_id,
      order_code,
      customer_id,
      status_cucian,
      total_biaya,
      status_bayar,
      tanggal_order,
      customer:customers ( nama ) 
    `
    )
    // Filter berdasarkan rentang tanggal
    .gte("tanggal_order", start.toISOString())
    .lte("tanggal_order", end.toISOString())
    .order("tanggal_order", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error.message)
  }

  const orders: Order[] =
    (data?.map((o: any) => ({
      ...o,
      customer: Array.isArray(o.customer)
        ? o.customer[0] ?? null
        : o.customer ?? null,
    })) as Order[]) || []

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <List className="w-8 h-8 text-(--color-brand-primary)" />
          <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">
            Daftar Transaksi
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* 3. Pasang Filter di sini */}
          <div className="w-full sm:w-auto">
            <PeriodSelector />
          </div>

          {(userRole === "Pegawai" || userRole === "Owner") && (
            <Link
              href="/os/transaksi/baru"
              className="shine-button flex items-center justify-center gap-2 bg-(--color-brand-primary) text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-(--color-brand-primary-active) transition-colors shadow-sm"
            >
              <Plus size={20} />
              <span>Baru</span>
            </Link>
          )}
        </div>
      </header>

      {/* Info rentang aktif (Opsional, agar user tahu sedang melihat data tanggal berapa) */}
      <p className="text-sm text-gray-500 mb-4">
        Menampilkan data: <b>{start.toLocaleDateString("id-ID")}</b> s/d{" "}
        <b>{end.toLocaleDateString("id-ID")}</b>
      </p>

      <OrderTable orders={orders} userRole={userRole} />
    </div>
  )
}
