import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*', // Qualquer rota
        destination: '/sgi-ipil', // A URL a ser exibida no navegador
      },
    ];
  },
};

export default nextConfig;
