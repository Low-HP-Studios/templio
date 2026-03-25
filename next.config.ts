import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/plan",
        destination: "/",
        permanent: true,
      },
      {
        source: "/releases",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
