// src/app/os/transaksi/baru/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation'; // <-- 1. Impor useRouter
import { createOrder, type OrderData } from './actions';

// ... (Interface Service dan CartItem tetap sama) ...
interface Service {
  service_id: number;
  nama_layanan: string;
  harga: number;
  satuan: string;
}
interface CartItem {
  id: number;
  service_id: number;
  nama_layanan: string;
  harga: number;
  satuan: string;
  jumlah: number;
  sub_total: number;
}
// ---------------------------------------------

export default function NewTransactionPage() {
  const router = useRouter(); // <-- 2. Inisialisasi router
  const [services, setServices] = useState<Service[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // State untuk pembayaran (sesuai update terakhir)
  const [jumlahBayar, setJumlahBayar] = useState<number | ''>('');
  const [kembalian, setKembalian] = useState(0);
  
  const [totalBiaya, setTotalBiaya] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Ambil data layanan dan cek role user saat halaman dimuat
  useEffect(() => {
    const bootstrap = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // <-- 3. Gunakan router.push
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role === 'Owner') {
        router.push('/os'); // <-- 3. Gunakan router.push
        return;
      }
      // Load services
      const { data } = await supabase.from('services').select('*');
      if (data) setServices(data);
    };
    bootstrap();
  }, [router]); // <-- 4. Tambahkan router ke dependency array

  // 2. Hitung ulang total biaya DAN kembalian
  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.sub_total, 0);
    setTotalBiaya(total);
    
    const bayar = Number(jumlahBayar) || 0;
    const sisa = bayar - total;
    setKembalian(sisa > 0 ? sisa : 0);
    
  }, [cart, jumlahBayar]);

  // 3. Fungsi untuk menambah item baru ke keranjang
  const addItem = () => {
    const defaultService = services[0];
    if (!defaultService) return; 

    setCart([
      ...cart,
      {
        id: Date.now(),
        service_id: defaultService.service_id,
        nama_layanan: defaultService.nama_layanan,
        harga: defaultService.harga,
        satuan: defaultService.satuan,
        jumlah: 1.0,
        sub_total: defaultService.harga * 1,
      },
    ]);
  };

  // 4. Fungsi untuk menghapus item dari keranjang
  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // 5. Fungsi untuk mengubah item di keranjang
  const updateItem = (id: number, field: 'service' | 'jumlah', value: string | number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        if (field === 'service') {
          const selectedService = services.find(s => s.service_id === Number(value));
          if (selectedService) {
            const newJumlah = item.jumlah;
            const newSubTotal = selectedService.harga * newJumlah;
            return {
              ...item,
              service_id: selectedService.service_id,
              nama_layanan: selectedService.nama_layanan,
              harga: selectedService.harga,
              satuan: selectedService.satuan,
              sub_total: newSubTotal,
            };
          }
        } else if (field === 'jumlah') {
          const newJumlah = parseFloat(value as string) || 0; 
          const newSubTotal = item.harga * newJumlah;
          return { ...item, jumlah: newJumlah, sub_total: newSubTotal };
        }
      }
      return item;
    }));
  };
  
  // 6. Fungsi untuk menangani submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage("Keranjang tidak boleh kosong.");
      setIsLoading(false);
      return;
    }
    
    // 5. Hapus paymentStatus, kirim jumlahBayar
    const orderData: OrderData = {
      customerName,
      customerPhone,
      totalBiaya,
      jumlahBayar: Number(jumlahBayar) || 0,
      items: cart.map(item => ({
        service_id: item.service_id,
        jumlah: item.jumlah,
        sub_total: item.sub_total,
      })),
    };

    const result = await createOrder(orderData);

    if (result?.error) {
      setErrorMessage(result.error);
      setIsLoading(false);
    }
    // Jika berhasil, Server Action akan mengarahkan (redirect) otomatis
  };


  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <FileText className="w-8 h-8 text-(--color-brand-primary)" />
        <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">
          Buat Transaksi Baru
        </h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
          {/* Data Pelanggan */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-(--color-text-primary) mb-4">1. Data Pelanggan</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Nama Pelanggan" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="p-3 border border-(--color-light-primary-active) rounded-lg" 
              />
              <input 
                type="tel" 
                placeholder="Nomor HP" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="p-3 border border-(--color-light-primary-active) rounded-lg" 
              />
            </div>
          </div>

          {/* Item cucian */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-(--color-text-primary) mb-4">2. Item Cucian</h2>
            <div className="flex flex-col gap-4">
              {cart.map((item, index) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-2 items-center">
                  <select 
                    value={item.service_id}
                    onChange={(e) => updateItem(item.id, 'service', e.target.value)}
                    className="flex-grow p-3 border border-(--color-light-primary-active) rounded-lg"
                  >
                    {/* Tambahkan opsi placeholder */}
                    {services.length === 0 && <option>Memuat layanan...</option>}
                    {services.map(s => (
                      <option key={s.service_id} value={s.service_id}>
                        {s.nama_layanan} (Rp {s.harga}/{s.satuan})
                      </option>
                    ))}
                  </select>
                  
                  <input 
                    type="number" 
                    placeholder="Kg/Pcs" 
                    value={item.jumlah}
                    onChange={(e) => updateItem(item.id, 'jumlah', e.target.value)}
                    min="0.1"
                    step="0.1"
                    required
                    className="w-full md:w-32 p-3 border border-(--color-light-primary-active) rounded-lg" 
                  />
                  
                  <span className="w-full md:w-auto text-lg font-medium text-(--color-text-primary)">
                    = Rp {item.sub_total.toLocaleString('id-ID')}
                  </span>
                  
                  <button type="button" onClick={() => removeItem(item.id)} className="text-red-500 p-3">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={addItem}
                className="flex items-center justify-center gap-2 p-3 text-(--color-brand-primary) border-2 border-dashed border-(--color-brand-primary) rounded-lg hover:bg-(--color-light-primary-hover)"
              >
                <Plus size={16} /> Tambah Item
              </button>
            </div>
          </div>

          {/* 6. Perbarui bagian Pembayaran */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-(--color-text-primary) mb-4">3. Pembayaran</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-(--color-dark-primary) mb-1">Jumlah Bayar (Rp)</label>
                <input 
                  type="number"
                  placeholder="0"
                  value={jumlahBayar}
                  onChange={(e) => setJumlahBayar(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-3 border border-(--color-light-primary-active) rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-dark-primary) mb-1">Kembalian (Rp)</label>
                <div className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg text-(--color-dark-primary) font-medium">
                  Rp {kembalian.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>

          {/* Total & Simpan */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
            <div className="text-2xl font-bold text-(--color-text-primary)">
              Total Biaya: 
              <span className="text-(--color-brand-primary) ml-2">
                Rp {totalBiaya.toLocaleString('id-ID')},-
              </span>
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="shine-button w-full md:w-auto flex items-center justify-center bg-(--color-brand-primary) text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50"
            >
              <Save className="mr-2" size={20} />
              {isLoading ? "Menyimpan..." : "Simpan Transaksi"}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
};