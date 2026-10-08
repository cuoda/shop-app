import type { NextConfig } from "next";

const backend = process.env.BACKEND_URL ?? "http://localhost:3001";

const config: NextConfig = {
  reactStrictMode: true,
  // Browser talks to same-origin /api/* and /images/*; Next forwards to the Nest backend.
  // This keeps the httpOnly auth cookie first-party and avoids CORS in dev and prod.
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backend}/:path*` },
      { source: "/images/:path*", destination: `${backend}/images/:path*` },
    ];
  },
};

export default config;
