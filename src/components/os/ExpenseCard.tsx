// src/components/os/ExpenseCard.tsx
"use client";
import React from 'react';
import { Edit, Trash2, Save } from 'lucide-react';

// Tipe data yang sama dengan di ExpenseManager
export type ExpenseRow = {
  expense_id: number;
  tanggal_pengeluaran: string;
  keterangan: string;
  jumlah: number;
};

interface ExpenseCardProps {
  expense: ExpenseRow
  editing: ExpenseRow | null
  isPending: boolean
  canDelete: boolean // Tambahkan prop untuk kontrol hak akses
  onEdit: (expense: ExpenseRow) => void
  onDelete: (id: number) => void
  onSave: (expense: ExpenseRow) => void
  onUpdateEditing: (
    field: "keterangan" | "jumlah",
    value: string | number
  ) => void
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  editing,
  isPending,
  canDelete,
  canEdit,
  onEdit,
  onDelete,
  onSave,
  onUpdateEditing,
}) => {
  const isEditing = editing?.expense_id === expense.expense_id

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md border ${
        isEditing ? "border-blue-500" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-800">
            {new Date(expense.tanggal_pengeluaran).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          {isEditing ? (
            <input
              type="text"
              value={editing!.keterangan}
              onChange={(e) => onUpdateEditing("keterangan", e.target.value)}
              className="mt-1 w-full p-2 border rounded-md"
            />
          ) : (
            <p className="text-sm text-gray-600">{expense.keterangan}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {isEditing ? (
            <input
              type="number"
              value={editing!.jumlah}
              onChange={(e) =>
                onUpdateEditing("jumlah", Number(e.target.value))
              }
              className="w-32 p-2 border rounded-md text-right font-mono"
            />
          ) : (
            <p className="font-bold text-lg text-red-500">
              Rp {expense.jumlah.toLocaleString("id-ID")}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 mt-4 pt-2 border-t">
        {isEditing ? (
          <button
            onClick={() => onSave(expense)}
            disabled={isPending}
            className="flex items-center gap-1 text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
          >
            <Save size={14} />
            Simpan
          </button>
        ) : (
          <>
            {/* Hanya tampilkan tombol Edit jika Owner */}
            {canEdit && (
              <button
                onClick={() => onEdit(expense)}
                disabled={isPending}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md"
              >
                <Edit size={14} />
                Edit
              </button>
            )}
          </>
        )}
        {/* Hanya tampilkan tombol Hapus jika Owner */}
        {canDelete && (
          <button
            onClick={() => onDelete(expense.expense_id)}
            disabled={isPending}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 px-3 py-1 rounded-md"
          >
            <Trash2 size={14} />
            Hapus
          </button>
        )}
      </div>
    </div>
  )
}

export default ExpenseCard;
