import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/uploads/**',
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
