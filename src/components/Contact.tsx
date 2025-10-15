// src/components/Contact.tsx
import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaWhatsapp, FaClock } from 'react-icons/fa';

const contactInfo = [
  { icon: <FaMapMarkerAlt />, title: "Alamat", content: "Jl. Sudirman No. 123, Palembang" },
  { icon: <FaPhone />, title: "Telepon", content: "0812-3456-7890", link: "tel:081234567890" },
  { icon: <FaWhatsapp />, title: "WhatsApp", content: "0812-3456-7890", link: "https://wa.me/6281234567890" },
  { icon: <FaClock />, title: "Jam Buka", content: "Senin - Sabtu (08:00 - 20:00)" }
];

const Contact = () => {
  return (
    <section id="kontak" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Hubungi & Kunjungi Kami</h2>
          <div className="w-24 h-1 bg-brand-primary mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {contactInfo.map((item, index) => (
            <div key={index} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
              <div className="text-brand-primary text-4xl mb-4 inline-block">{item.icon}</div>
              <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-dark-primary hover:text-brand-primary transition-colors">
                  {item.content}
                </a>
              ) : (
                <p className="text-dark-primary">{item.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;