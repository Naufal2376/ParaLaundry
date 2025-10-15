// src/components/Services.tsx
import React from 'react';
import { FaTshirt, FaVestPatches, FaRocket } from 'react-icons/fa';

const services = [
  {
    icon: <FaTshirt size={48} className="text-brand-primary group-hover:text-primary transition-colors duration-300" />,
    title: 'Laundry Kiloan',
    description: 'Cocok untuk pakaian sehari-hari. Dicuci, dikeringkan, dan disetrika dengan rapi per kilogram.',
    delay: '100',
  },
  {
    icon: <FaVestPatches size={48} className="text-brand-primary group-hover:text-primary transition-colors duration-300" />,
    title: 'Laundry Satuan',
    description: 'Perawatan khusus untuk item spesial seperti jas, gaun, kebaya, atau bahan sensitif lainnya.',
    delay: '200',
  },
  {
    icon: <FaRocket size={48} className="text-brand-primary group-hover:text-primary transition-colors duration-300" />,
    title: 'Layanan Ekspres',
    description: 'Butuh cepat? Layanan kilat kami memastikan pakaian Anda siap hanya dalam hitungan jam.',
    delay: '300',
  }
];

const Services = () => {
  return (
    <section id="layanan" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Layanan Unggulan Kami</h2>
          <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              // EFEK BARU: 'group' untuk mengontrol elemen anak saat hover
              className="group bg-light-primary p-8 rounded-lg shadow-lg border border-light-primary-hover text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:bg-brand-primary"
              data-aos="fade-up"
              data-aos-delay={service.delay}
            >
              <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              {/* EFEK BARU: Teks berubah warna menjadi putih saat card di-hover */}
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
              <p className="text-dark-primary group-hover:text-light-primary-hover transition-colors duration-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;