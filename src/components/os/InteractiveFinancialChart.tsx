"use client"
import React, { useState } from "react"
import BarChartComponent from "./BarChartComponent"
import { PeriodDataTable } from "./PeriodDataTable"

interface BarChartData {
  name: string
  pendapatan: number
  pengeluaran?: number
}

interface TransactionData {
  tanggal: string
  keterangan: string
  jumlah: number
  tipe: "pendapatan" | "pengeluaran"
}

interface InteractiveFinancialChartProps {
  barChartData: BarChartData[]
  allIncomeData: Array<{
    tanggal_order: string
    total_biaya: number
    order_code?: string
  }>
  allExpenseData: Array<{
    tanggal_pengeluaran: string
    jumlah: number
    keterangan: string
  }>
  bucketKeyFunction: (date: string) => string
}

export const InteractiveFinancialChart: React.FC<
  InteractiveFinancialChartProps
> = ({ barChartData, allIncomeData, allExpenseData, bucketKeyFunction }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  const handleBarClick = (periodName: string) => {
    setSelectedPeriod(periodName)
  }

  const getDetailData = (periodName: string): TransactionData[] => {
    const details: TransactionData[] = []

    // Filter pendapatan untuk periode yang dipilih
    allIncomeData.forEach((item) => {
      const key = bucketKeyFunction(item.tanggal_order)
      if (key === periodName) {
        details.push({
          tanggal: item.tanggal_order,
          keterangan: `Order ${item.order_code || "N/A"}`,
          jumlah: Number(item.total_biaya),
          tipe: "pendapatan",
        })
      }
    })

    // Filter pengeluaran untuk periode yang dipilih
    allExpenseData.forEach((item) => {
      const key = bucketKeyFunction(item.tanggal_pengeluaran)
      if (key === periodName) {
        details.push({
          tanggal: item.tanggal_pengeluaran,
          keterangan: item.keterangan,
          jumlah: Number(item.jumlah),
          tipe: "pengeluaran",
        })
      }
    })

    return details.sort(
      (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
    )
  }

  return (
    <>
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-lg h-[400px] sm:h-[450px] md:h-[500px]">
        <BarChartComponent data={barChartData} onBarClick={handleBarClick} />
      </div>

      {selectedPeriod && (
        <PeriodDataTable
          periodName={selectedPeriod}
          data={getDetailData(selectedPeriod)}
          onClose={() => setSelectedPeriod(null)}
        />
      )}
    </>
  )
}
