import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/fordon", destination: "/dagsrapport", permanent: false },
      { source: "/fordon/ny", destination: "/dagsrapport/ny", permanent: false },
    ];
  },
};

export default nextConfig;
