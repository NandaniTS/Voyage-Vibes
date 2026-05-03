const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/uploads/:path*",
        destination: `${apiUrl}/api/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
