// src/components/os/ExpenseCard.tsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Expense {
  expense_id: number;
  tanggal_pengeluaran: string;
  keterangan: string;
  jumlah: number;
}

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  isEditing: boolean;
  editingExpense: { expense_id: number; keterangan: string; jumlah: number } | null;
  setEditingExpense: (expense: { expense_id: number; keterangan: string; jumlah: number }) => void;
  onSaveEdit: (expense: Expense) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete, isEditing, editingExpense, setEditingExpense, onSaveEdit }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm text-gray-500">{new Date(expense.tanggal_pengeluaran).toLocaleDateString('id-ID')}</p>
          {isEditing && editingExpense?.expense_id === expense.expense_id ? (
            <input
              className="p-2 border rounded w-full text-lg font-bold"
              value={editingExpense.keterangan}
              onChange={(e) => setEditingExpense({ ...editingExpense, keterangan: e.target.value })}
            />
          ) : (
            <p className="font-bold text-lg text-(--color-text-primary)">{expense.keterangan}</p>
          )}
        </div>
        {isEditing && editingExpense?.expense_id === expense.expense_id ? (
          <button
            type="button"
            className="px-3 py-1 bg-(--color-brand-primary) text-white rounded text-sm"
            onClick={() => onSaveEdit(expense)}
          >
            Simpan
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(expense)}
              className="text-(--color-brand-primary) hover:text-(--color-brand-primary-hover)"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(expense.expense_id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
      <div>
        <label className="text-sm text-gray-500">Jumlah</label>
        {isEditing && editingExpense?.expense_id === expense.expense_id ? (
          <input
            type="number"
            className="p-2 border rounded w-full text-lg font-bold"
            value={editingExpense.jumlah}
            onChange={(e) => setEditingExpense({ ...editingExpense, jumlah: Number(e.target.value || 0) })}
          />
        ) : (
          <p className="font-bold text-lg">Rp {Number(expense.jumlah).toLocaleString('id-ID')}</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseCard;