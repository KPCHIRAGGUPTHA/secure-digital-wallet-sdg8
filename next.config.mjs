/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  basePath: "/secure-digital-wallet-sdg8",
  assetPrefix: "/secure-digital-wallet-sdg8/",

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
