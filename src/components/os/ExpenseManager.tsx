"use client";
import React, { useState, useMemo, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import ExpenseCard from './ExpenseCard'; 
import { Save, Search } from 'lucide-react';

type ExpenseRow = {
  expense_id: number;
  tanggal_pengeluaran: string;
  keterangan: string;
  jumlah: number;
};

interface ExpenseManagerProps {
  role: string; // Role sekarang wajib
  initialExpenses: ExpenseRow[];
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({ role, initialExpenses }) => {
  const [jumlah, setJumlah] = useState<number | ''>('');
  const [kategori, setKategori] = useState('Operasional');
  const [keterangan, setKeterangan] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [rows, setRows] = useState<ExpenseRow[]>(initialExpenses);
  const [editing, setEditing] = useState<ExpenseRow | null>(null);
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  // --- LOGIKA HAK AKSES ---
  // Hanya Owner yang boleh menghapus
  const canDelete = role === "Owner"; 

  const refreshTable = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('expenses')
      .select('expense_id, tanggal_pengeluaran, keterangan, jumlah')
      .order('tanggal_pengeluaran', { ascending: false });
    if (data) setRows(data as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      if (!jumlah || jumlah <= 0) {
        setErrorMessage('Nominal harus lebih dari 0.');
        return;
      }
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const finalKeterangan = `[${kategori}] ${keterangan}`.trim();
      
      const { error } = await supabase.from('expenses').insert({
        jumlah,
        keterangan: finalKeterangan || kategori,
        tanggal_pengeluaran: tanggal,
        user_id: user?.id ?? null,
      });
      
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Pengeluaran berhasil disimpan.');
        setJumlah('');
        setKategori('Operasional');
        setKeterangan('');
        await refreshTable();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async (exp: ExpenseRow) => {
    // Hanya Owner yang boleh edit (sesuai permintaan tidak boleh hapus/ubah data sensitif oleh pegawai)
    // Tapi jika pegawai salah input, biasanya mereka perlu edit. 
    // Jika ingin ketat (hanya owner), tambahkan: if(!canDelete) return;
    
    startTransition(async () => {
      if (!editing) return;
      const supabase = createClient();
      const { error } = await supabase
        .from('expenses')
        .update({ keterangan: editing.keterangan, jumlah: editing.jumlah })
        .eq('expense_id', exp.expense_id);
      
      if (!error) {
        setEditing(null);
        await refreshTable();
      } else {
        alert("Gagal edit: " + error.message);
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!canDelete) {
      alert("Hanya Owner yang dapat menghapus data keuangan.");
      return;
    }

    if (window.confirm("Anda yakin ingin menghapus pengeluaran ini?")) {
      startTransition(async () => {
        const supabase = createClient();
        const { error } = await supabase.from('expenses').delete().eq('expense_id', id);
        
        if (error) {
            alert("Gagal menghapus: " + error.message);
        } else {
            setRows(rows.filter(x => x.expense_id !== id));
        }
      });
    }
  };

   const handleUpdateEditing = (field: 'keterangan' | 'jumlah', value: string | number) => {
    if (editing) {
      setEditing({ ...editing, [field]: value });
    }
  };

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      new Date(r.tanggal_pengeluaran).toLocaleDateString('id-ID').includes(q) ||
      r.keterangan.toLowerCase().includes(q) ||
      String(r.jumlah).includes(q)
    );
  }, [rows, query]);

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 text-(--color-dark-primary)">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full p-3 border border-(--color-light-primary-active) rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-(--color-dark-primary)">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full p-3 border border-(--color-light-primary-active) rounded-lg"
            >
              <option>Operasional</option>
              <option>Gaji</option>
              <option>Perlengkapan</option>
              <option>Lainnya</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-(--color-dark-primary)">Nominal (Rp)</label>
            <input
              type="number"
              value={jumlah}
              min={0}
              step={1000}
              onChange={(e) => setJumlah(e.target.value ? Number(e.target.value) : '')}
              required
              className="w-full p-3 border border-(--color-light-primary-active) rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-(--color-dark-primary)">Catatan</label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={3}
              className="w-full p-3 border border-(--color-light-primary-active) rounded-lg"
              placeholder="Contoh: Beli deterjen, perbaikan mesin, dll."
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="shine-button flex items-center bg-(--color-brand-primary) text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg hover:scale-105 disabled:opacity-50"
          >
            <Save className="mr-2" size={18} />
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
          {errorMessage && <span className="text-red-500 text-sm">{errorMessage}</span>}
          {successMessage && <span className="text-green-600 text-sm">{successMessage}</span>}
        </div>
      </form>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-semibold text-(--color-text-primary)">Daftar Pengeluaran</h2>
            <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari pengeluaran..."
                    className="w-full pl-10 pr-4 py-2 border border-(--color-light-primary-active) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
                />
            </div>
        </div>
        
        <div className="hidden md:block overflow-x-auto">
          <table className={`w-full text-left ${isPending ? 'opacity-50' : ''}`}>
            <thead>
              <tr className="border-b border-(--color-light-primary-active)">
                <th className="p-3">Tanggal</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3 text-right">Jumlah</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.expense_id} className="border-b">
                  <td className="p-3">{new Date(r.tanggal_pengeluaran).toLocaleDateString('id-ID')}</td>
                  <td className="p-3">
                    {editing?.expense_id === r.expense_id ? (
                      <input
                        className="p-2 border rounded w-full"
                        value={editing.keterangan}
                        onChange={(e) => setEditing({ ...editing, keterangan: e.target.value })}
                      />
                    ) : (
                      r.keterangan
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {editing?.expense_id === r.expense_id ? (
                      <input
                        type="number"
                        className="p-2 border rounded w-32 text-right"
                        value={editing.jumlah}
                        onChange={(e) => setEditing({ ...editing, jumlah: Number(e.target.value || 0) })}
                      />
                    ) : (
                      `Rp ${Number(r.jumlah).toLocaleString('id-ID')}`
                    )}
                  </td>
                  <td className="p-3 space-x-2 text-center">
                    {editing?.expense_id === r.expense_id ? (
                      <button
                        type="button"
                        className="px-3 py-1 bg-(--color-brand-primary) text-white rounded"
                        disabled={isPending}
                        onClick={() => handleSaveEdit(r)}
                      >Simpan</button>
                    ) : (
                      // Tombol Edit (opsional: bisa disembunyikan juga jika pegawai tidak boleh edit)
                      // Untuk saat ini kita biarkan tombol edit, tapi database akan menolak jika Anda set policy UPDATE ke owner only
                      // Jika policy UPDATE hanya owner, sebaiknya tombol ini juga: canDelete && <button...>
                      canDelete && (
                        <button
                            type="button"
                            className="px-3 py-1 bg-white border rounded"
                            disabled={isPending}
                            onClick={() => setEditing(r)}
                        >Edit</button>
                      )
                    )}
                    
                    {/* HANYA TAMPILKAN JIKA OWNER */}
                    {canDelete && (
                    <button
                      type="button"
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      disabled={isPending}
                      onClick={() => handleDelete(r.expense_id)}
                    >Hapus</button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td className="p-3 text-center" colSpan={4}>Belum ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="md:hidden mt-4 space-y-4">
          {filteredRows.length > 0 ? (
            filteredRows.map((r) => (
              <ExpenseCard
                key={r.expense_id}
                expense={r}
                editing={editing}
                isPending={isPending}
                onEdit={setEditing}
                onDelete={handleDelete}
                onSave={handleSaveEdit}
                onUpdateEditing={handleUpdateEditing}
              />
            ))
          ) : (
            <p className="p-4 text-center text-(--color-dark-primary)">
              Belum ada data.
            </p>
          )}
        </div>
      </div>
    </>
  );
}