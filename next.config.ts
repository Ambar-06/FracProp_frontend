import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint checks during build
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/property_images/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'fracprop.pythonanywhere.com',
        pathname: "/media/uploads/**",
      },
      {
        protocol: 'https',
        hostname: 'fracprop.pythonanywhere.com',
        pathname: '/media/property_images/**',
      },
    ],
  },
};

export default nextConfig;
// const dotenv = require("dotenv");

// dotenv.config(); // Explicitly load .env.local

// console.log("NEXT_PUBLIC_BACKEND_BASE_URL:", process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

// module.exports = {
//   env: {
//     NEXT_PUBLIC_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
//   },
// };
