/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'graph.digiseller.ru' },
      { protocol: 'https', hostname: '*.digiseller.ru' },
      { protocol: 'https', hostname: 'mlhps3funlqn.i.optimole.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
