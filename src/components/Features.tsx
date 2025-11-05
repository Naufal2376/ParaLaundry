// src/components/Features.tsx
"use client";
import React from 'react';
// Impor ikon-ikon baru yang relevan
import { Award, Truck, Percent, Smile, ShieldCheck, Clock } from 'lucide-react';

// Daftar keunggulan baru dengan ikon dan penjelasan
const features = [
  {
    icon: <Award className="w-12 h-12 text-(--color-brand-primary)" />,
    title: "Detergen Berkualitas",
    desc: "Kami menggunakan detergen premium yang aman, ramah lingkungan, dan terbukti ampuh membersihkan."
  },
  {
    icon: <Truck className="w-12 h-12 text-(--color-brand-primary)" />,
    title: "Gratis Antar-Jemput",
    desc: "Hemat waktu Anda. Kami menyediakan layanan antar-jemput gratis untuk min. order 5kg."
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-(--color-brand-primary)" />,
    title: "Garansi Cucian Bersih",
    desc: "Kepuasan Anda adalah jaminan kami. Tidak bersih? Kami cuci ulang, gratis!"
  },
  {
    icon: <Clock className="w-12 h-12 text-(--color-brand-primary)" />,
    title: "Pengerjaan Tepat Waktu",
    desc: "Kami menghargai waktu Anda. Pesanan Anda akan selesai sesuai dengan estimasi yang dijanjikan."
  },
  {
    icon: <Percent className="w-12 h-12 text-(--color-brand-primary)" />,
    title: "Harga Terjangkau",
    desc: "Dapatkan kualitas layanan laundry premium dengan harga yang kompetitif dan transparan."
  },
  {
    icon: <Smile className="w-12 h-12 text-(--color-brand-primary)" />,
    title: "Pewangi Tahan Lama",
    desc: "Pilih dari berbagai aroma premium kami yang akan membuat pakaian Anda wangi sepanjang hari."
  }
];

const Features = () => {
  return (
    <section id="keunggulan" className="py-20 px-4 bg-white relative z-10">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-(--color-text-primary) mb-4" data-aos="fade-down">
          Mengapa Pilih Kami?
        </h2>
        <p className="text-center text-(--color-dark-primary) mb-12 max-w-2xl mx-auto" data-aos="fade-down" data-aos-delay="100">
          Kepuasan pelanggan adalah prioritas utama kami
        </p>
        
        {/* BARU: Layout kartu dengan ikon + penjelasan */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="fade-up" // Animasi 'fade-up'
              data-aos-delay={`${index * 100}`}
              className="bg-gradient-to-br from-(--color-light-primary) to-white p-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Ikon */}
              <div className="mb-4">
                {feature.icon}
              </div>
              {/* Judul */}
              <h3 className="text-2xl font-bold text-(--color-text-primary) mb-3">
                {feature.title}
              </h3>
              {/* Penjelasan */}
              <p className="text-(--color-dark-primary)">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;