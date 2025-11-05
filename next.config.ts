/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["zfqw7vn3-3000.asse.devtunnels.ms"],
    },
  },
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
