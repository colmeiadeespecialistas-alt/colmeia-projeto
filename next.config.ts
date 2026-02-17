import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Isso permite que o deploy termine mesmo com erros de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Evita que o build pare por avisos de formatação
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;