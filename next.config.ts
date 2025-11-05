/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["para-laundry.vercel.app"],
    },
  },
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
