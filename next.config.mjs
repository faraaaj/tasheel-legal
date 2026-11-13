/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["motion"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Serve team photos from an external folder outside the project root
        // via src/app/api/serve-image/[...path]/route.ts
        source: "/team/:path*",
        destination: "/api/serve-image/:path*",
      },
    ];
  },
};

export default nextConfig;
