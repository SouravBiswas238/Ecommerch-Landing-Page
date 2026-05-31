/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "aisetechnologies-bucket.s3.amazonaws.com",
      },
    ],
  },
  // Use empty turbopack config to silence Turbopack/webpack conflict warning
  turbopack: {},
};

export default nextConfig;
