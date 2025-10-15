// src/components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-text-primary text-primary py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} Para Laundry. Dibuat dengan ❤️ di Palembang.</p>
      </div>
    </footer>
  );
};

export default Footer;