/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["zfqw7vn3-3000.asse.devtunnels.ms"],
    },
  },
  // ✅ Tambahkan ini
  output: "standalone", // memastikan build berjalan stabil di Vercel
  reactStrictMode: true,
};

export default nextConfig;
