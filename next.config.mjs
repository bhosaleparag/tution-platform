/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Mark firebase-admin as external for server components
  serverComponentsExternalPackages: ['firebase-admin'],
  webpack: (config, { isServer }) => {
    // Exclude firebase-admin from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        'node:process': false,
        'node:buffer': false,
        'node:util': false,
      };
    }

    // Ignore firebase-admin in client-side builds
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'firebase-admin': 'commonjs firebase-admin',
      });
    }

    return config;
  },
};

export default nextConfig;
