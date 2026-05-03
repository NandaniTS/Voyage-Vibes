/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
