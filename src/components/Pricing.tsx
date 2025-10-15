// src/components/Pricing.tsx
import React from 'react';

const Pricing = () => {
  return (
    <section id="harga" className="py-20 bg-light-primary-hover">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Daftar Harga Terjangkau</h2>
          <div className="w-24 h-1 bg-brand-primary mx-auto mt-4"></div>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden" data-aos="zoom-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-dark-primary text-primary">
                <tr>
                  <th className="p-4 font-semibold">Jenis Layanan</th>
                  <th className="p-4 font-semibold">Estimasi Waktu</th>
                  <th className="p-4 font-semibold text-right">Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-light-primary-hover hover:bg-light-primary-active transition-colors">
                  <td className="p-4">Cuci Kering Setrika (Kiloan)</td>
                  <td className="p-4">2 - 3 Hari</td>
                  <td className="p-4 font-semibold text-right">Rp 7.000 / kg</td>
                </tr>
                <tr className="border-b border-light-primary-hover bg-light-primary hover:bg-light-primary-active transition-colors">
                  <td className="p-4">Layanan Ekspres (6 Jam Selesai)</td>
                  <td className="p-4">6 Jam</td>
                  <td className="p-4 font-semibold text-right">Rp 15.000 / kg</td>
                </tr>
                <tr className="border-b border-light-primary-hover hover:bg-light-primary-active transition-colors">
                  <td className="p-4">Bed Cover / Selimut</td>
                  <td className="p-4">3 Hari</td>
                  <td className="p-4 font-semibold text-right">Rp 20.000 / pcs</td>
                </tr>
                 <tr className="border-b border-light-primary-hover bg-light-primary hover:bg-light-primary-active transition-colors">
                  <td className="p-4">Jas / Gaun (Satuan)</td>
                  <td className="p-4">3 Hari</td>
                  <td className="p-4 font-semibold text-right">Mulai Rp 35.000 / pcs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
         <p className="text-center mt-6 text-dark-primary italic">*Harga dapat berubah. Hubungi kami untuk informasi lebih lanjut.</p>
      </div>
    </section>
  );
};

export default Pricing;