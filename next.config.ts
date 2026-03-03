import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'; // أضف هذا السطر

const withNextIntl = createNextIntlPlugin(); // وأضف هذا السطر

// https://npbtomykxnzbwszoqruy.supabase.co/storage/v1/object/public/doctor-images/Richard.png

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "npbtomykxnzbwszoqruy.supabase.co",
        pathname: "/storage/v1/object/public/**"
      },
    ]
  }
};

// قم بتغليف الـ nextConfig بـ withNextIntl
export default withNextIntl(nextConfig);



