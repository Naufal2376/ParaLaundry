"use client"
import React from "react"
import { X } from "lucide-react"

interface TransactionData {
  tanggal: string
  keterangan: string
  jumlah: number
  tipe: "pendapatan" | "pengeluaran"
}

interface PeriodDataTableProps {
  periodName: string
  data: TransactionData[]
  onClose: () => void
}

export const PeriodDataTable: React.FC<PeriodDataTableProps> = ({
  periodName,
  data,
  onClose,
}) => {
  const pendapatan = data.filter((d) => d.tipe === "pendapatan")
  const pengeluaran = data.filter((d) => d.tipe === "pengeluaran")

  const totalPendapatan = pendapatan.reduce((acc, item) => acc + item.jumlah, 0)
  const totalPengeluaran = pengeluaran.reduce(
    (acc, item) => acc + item.jumlah,
    0
  )
  const laba = totalPendapatan - totalPengeluaran

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6 border-2 border-blue-500">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Detail Periode: {periodName}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Pendapatan</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {totalPendapatan.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-red-600">
            Rp {totalPengeluaran.toLocaleString("id-ID")}
          </p>
        </div>
        <div
          className={`${laba >= 0 ? "bg-blue-50" : "bg-red-50"} p-4 rounded-lg`}
        >
          <p className="text-sm text-gray-600">Laba Bersih</p>
          <p
            className={`text-2xl font-bold ${
              laba >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            Rp {laba.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tabel Pendapatan */}
        <div>
          <h4 className="font-semibold text-lg mb-3 text-green-700">
            Pendapatan ({pendapatan.length} transaksi)
          </h4>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-green-100 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Tanggal</th>
                  <th className="p-2 text-left">Keterangan</th>
                  <th className="p-2 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {pendapatan.length > 0 ? (
                  pendapatan.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-2">{item.keterangan}</td>
                      <td className="p-2 text-right font-semibold text-green-600">
                        Rp {item.jumlah.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      Tidak ada data pendapatan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabel Pengeluaran */}
        <div>
          <h4 className="font-semibold text-lg mb-3 text-red-700">
            Pengeluaran ({pengeluaran.length} transaksi)
          </h4>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-100 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Tanggal</th>
                  <th className="p-2 text-left">Keterangan</th>
                  <th className="p-2 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {pengeluaran.length > 0 ? (
                  pengeluaran.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-2">{item.keterangan}</td>
                      <td className="p-2 text-right font-semibold text-red-600">
                        Rp {item.jumlah.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      Tidak ada data pengeluaran
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
