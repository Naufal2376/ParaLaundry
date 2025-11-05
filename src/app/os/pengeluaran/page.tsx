// src/app/os/pengeluaran/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { Wallet, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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
  }, []);

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

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <Wallet className="w-8 h-8 text-(--color-brand-primary)" />
        <h1 className="text-3xl font-bold text-(--color-text-primary)">Catat Pengeluaran</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl">
        <div className="grid md:grid-cols-2 gap-4">
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
          <div>
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
            className="shine-button flex items-center bg-(--color-brand-primary) text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 disabled:opacity-50"
          >
            <Save className="mr-2" size={18} />
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
          {errorMessage && <span className="text-red-500">{errorMessage}</span>}
          {successMessage && <span className="text-green-600">{successMessage}</span>}
        </div>
      </form>

      {/* Tabel Daftar Pengeluaran */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
        <h2 className="text-xl font-semibold text-(--color-text-primary) mb-4">Daftar Pengeluaran</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-(--color-light-primary-active)">
                <th className="p-3">Tanggal</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.expense_id} className="border-b">
                  <td className="p-3">{new Date(r.tanggal_pengeluaran).toLocaleDateString('id-ID')}</td>
                  <td className="p-3">
                    {editing?.expense_id === r.expense_id ? (
                      <input
                        className="p-2 border rounded"
                        value={editing.keterangan}
                        onChange={(e) => setEditing({ ...editing, keterangan: e.target.value })}
                      />
                    ) : (
                      r.keterangan
                    )}
                  </td>
                  <td className="p-3">
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
                  <td className="p-3 space-x-2">
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
                        const supabase = createClient();
                        await supabase.from('expenses').delete().eq('expense_id', r.expense_id);
                        setRows(rows.filter(x => x.expense_id !== r.expense_id));
                      }}
                    >Hapus</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={4}>Belum ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


