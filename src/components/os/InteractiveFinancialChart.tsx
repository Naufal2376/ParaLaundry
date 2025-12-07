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
  periodDetailsMap: Record<string, TransactionData[]>
}

export const InteractiveFinancialChart: React.FC<
  InteractiveFinancialChartProps
> = ({ barChartData, periodDetailsMap }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  const handleBarClick = (periodName: string) => {
    setSelectedPeriod(periodName)
  }

  const getDetailData = (periodName: string): TransactionData[] => {
    return periodDetailsMap[periodName] || []
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
