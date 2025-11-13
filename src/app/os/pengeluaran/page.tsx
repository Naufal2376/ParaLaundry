"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Wallet, Save, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import ExpenseCard from '@/components/os/ExpenseCard';
import DashboardWrapper from '@/components/os/DashboardWrapper';

export default function ExpensePage() {
  const router = useRouter();
  const [jumlah, setJumlah] = useState<number | ''>('');
  const [kategori, setKategori] = useState('Operasional');
  const [keterangan, setKeterangan] = useState('');
  const [tanggal, setTanggal] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rows, setRows] = useState<{ expense_id: number; tanggal_pengeluaran: string; keterangan: string; jumlah: number }[]>([]);
  const [editing, setEditing] = useState<{ expense_id: number; keterangan: string; jumlah: number } | null>(null);
  const [query, setQuery] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const guard = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      setUserRole(profile?.role || null);
      // Hanya Owner yang boleh membuka halaman ini
      if (profile?.role !== 'Owner') { router.push('/os'); return; }
      // Load awal daftar pengeluaran
      const { data } = await supabase
        .from('expenses')
        .select('expense_id, tanggal_pengeluaran, keterangan, jumlah')
        .order('tanggal_pengeluaran', { ascending: false });
      if (data) setRows(data as any);
    };
    guard();
    // Default tanggal = hari ini
    setTanggal(new Date().toISOString().slice(0, 10));
  }, [router]);

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
        // refresh list
        const { data } = await supabase
          .from('expenses')
          .select('expense_id, tanggal_pengeluaran, keterangan, jumlah')
          .order('tanggal_pengeluaran', { ascending: false });
        if (data) setRows(data as any);
      }
    } finally {
      setIsLoading(false);
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
    <DashboardWrapper userRole={userRole}>
      <header className="flex items-center gap-4 mb-8">
        <Wallet className="w-8 h-8 text-(--color-brand-primary)" />
        <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">Catat Pengeluaran</h1>
      </header>

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

      {/* Daftar Pengeluaran */}
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
        {/* Tampilan Tabel untuk Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
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
                        className="p-2 border rounded w-32"
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
                        onClick={async () => {
                          const supabase = createClient();
                          const { error } = await supabase
                            .from('expenses')
                            .update({ keterangan: editing.keterangan, jumlah: editing.jumlah })
                            .eq('expense_id', r.expense_id);
                          if (!error) {
                            setEditing(null);
                            const { data } = await supabase
                              .from('expenses')
                              .select('expense_id, tanggal_pengeluaran, keterangan, jumlah')
                              .order('tanggal_pengeluaran', { ascending: false });
                            if (data) setRows(data as any);
                          }
                        }}
                      >Simpan</button>
                    ) : (
                      <button
                        type="button"
                        className="px-3 py-1 bg-white border rounded"
                        onClick={() => setEditing({ expense_id: r.expense_id, keterangan: r.keterangan, jumlah: Number(r.jumlah) })}
                      >Edit</button>
                    )}
                    <button
                      type="button"
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      onClick={async () => {
                        if(window.confirm("Anda yakin ingin menghapus pengeluaran ini?")){
                          const supabase = createClient();
                          await supabase.from('expenses').delete().eq('expense_id', r.expense_id);
                          setRows(rows.filter(x => x.expense_id !== r.expense_id));
                        }
                      }}
                    >Hapus</button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td className="p-3 text-center" colSpan={4}>{rows.length === 0 ? "Belum ada data pengeluaran." : "Tidak ada hasil yang cocok."}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Tampilan Card untuk Mobile */}
        <div className="md:hidden mt-4 space-y-4">
          {filteredRows.length > 0 ? (
            filteredRows.map((expense) => (
              <ExpenseCard
                key={expense.expense_id}
                expense={expense}
                onEdit={(exp) => setEditing({ expense_id: exp.expense_id, keterangan: exp.keterangan, jumlah: Number(exp.jumlah) })}
                onDelete={async (id) => {
                  if(window.confirm("Anda yakin ingin menghapus pengeluaran ini?")){
                    const supabase = createClient();
                    await supabase.from('expenses').delete().eq('expense_id', id);
                    setRows(rows.filter(x => x.expense_id !== id));
                  }
                }}
                isEditing={editing?.expense_id === expense.expense_id}
                editingExpense={editing}
                setEditingExpense={setEditing}
                onSaveEdit={async (exp) => {
                  const supabase = createClient();
                  const { error } = await supabase
                    .from('expenses')
                    .update({ keterangan: editing?.keterangan, jumlah: editing?.jumlah })
                    .eq('expense_id', exp.expense_id);
                  if (!error) {
                    setEditing(null);
                    const { data } = await supabase
                      .from('expenses')
                      .select('expense_id, tanggal_pengeluaran, keterangan, jumlah')
                      .order('tanggal_pengeluaran', { ascending: false });
                    if (data) setRows(data as any);
                  }
                }}
              />
            ))
          ) : (
            <div className="p-4 text-center text-(--color-dark-primary)">
              {rows.length === 0 ? "Belum ada data pengeluaran." : "Tidak ada hasil yang cocok."}
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
}