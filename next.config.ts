// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Izinkan permintaan dari URL Dev Tunnel Anda
      allowedOrigins: ["zfqw7vn3-3000.asse.devtunnels.ms"],
    },
  },
  // ... (sisa konfigurasi Anda mungkin ada di sini)
};

// Gunakan 'export default' (sintaks ES Module/TypeScript)
export default nextConfig;