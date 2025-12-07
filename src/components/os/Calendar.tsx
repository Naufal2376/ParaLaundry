"use client"

import React from "react"
import { DayPicker } from "react-day-picker"
import { id } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Import style bawaan
import "react-day-picker/dist/style.css"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export default function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={id}
      showOutsideDays={showOutsideDays}
      className={`p-3 bg-white rounded-xl border border-gray-100 ${className}`}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-bold text-gray-700",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
        day_today: "bg-gray-100 text-gray-900 font-bold",
        day_outside: "text-gray-300 opacity-50",
        day_disabled: "text-gray-300 opacity-50",
        day_range_middle:
          "aria-selected:bg-blue-50 aria-selected:text-blue-700 rounded-none",
        day_hidden: "invisible",
        ...classNames,
      }}
      // PERBAIKAN: Sertakan kunci untuk V8 (Icon...) dan V9 (Chevron...)
      // Gunakan 'as any' untuk bypass error tipe versi yang mismatch
      components={
        {
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
          ChevronLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          ChevronRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        } as any
      }
      {...props}
    />
  )
}
