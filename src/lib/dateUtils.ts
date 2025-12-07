// src/lib/dateUtils.ts

export type Period = "hari" | "minggu" | "bulan" | "tahun"

export function getPeriodDateRange(
  period?: string,
  from?: string,
  to?: string
) {
  const now = new Date()
  // Set default ke akhir hari ini (23:59:59)
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)

  let start = new Date(now)
  start.setHours(0, 0, 0, 0) // Default start awal hari ini

  // 1. Jika Custom Range (Dari - Sampai)
  if (from && to) {
    return {
      start: new Date(`${from}T00:00:00`),
      end: new Date(`${to}T23:59:59.999`),
    }
  }

  // 2. Jika Preset (Hari/Minggu/Bulan/Tahun)
  switch (period) {
    case "hari":
      // Start sudah default di 00:00 hari ini
      break
    case "minggu":
      // Mundur ke hari Senin minggu ini
      const day = start.getDay() // 0 (Minggu) - 6 (Sabtu)
      const diff = start.getDate() - day + (day === 0 ? -6 : 1)
      start.setDate(diff)
      break
    case "bulan":
      // Tanggal 1 bulan ini
      start.setDate(1)
      break
    case "tahun":
      // Tanggal 1 Januari tahun ini
      start.setMonth(0, 1)
      break
    default:
      // Default fallback: Bulan ini (agar data tidak terlalu banyak saat load awal)
      start.setDate(1)
      break
  }

  return { start, end }
}
