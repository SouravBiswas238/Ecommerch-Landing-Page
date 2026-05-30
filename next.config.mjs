/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
