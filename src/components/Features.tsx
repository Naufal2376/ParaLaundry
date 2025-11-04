// src/components/Features.tsx
"use client";
import React from 'react';
import { CheckCircle } from 'lucide-react';

const featuresList = [
  "Detergen berkualitas dan aman",
  "Pewangi tahan lama",
  "Gratis antar-jemput (min. 5kg)",
  "Sistem pembayaran fleksibel",
  "Garansi cucian bersih",
  "Harga terjangkau"
];

const Features = () => {
  return (
    <section id="keunggulan" className="py-20 px-4 bg-[--color-light-primary] relative z-10">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-[--color-text-primary] mb-4" data-aos="fade-down">
          Mengapa Pilih Kami?
        </h2>
        <p className="text-center text-[--color-dark-primary] mb-12 max-w-2xl mx-auto" data-aos="fade-down" data-aos-delay="100">
          Nikmati layanan laundry terbaik dengan berbagai keunggulan yang kami tawarkan.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4 transform hover:scale-105 transition-all duration-300 group"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
            >
              <CheckCircle className="w-7 h-7 text-[--color-brand-primary] group-hover:rotate-12 transition-transform duration-300" />
              <p className="text-[--color-text-primary] font-medium">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;