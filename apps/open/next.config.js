/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@smm/ui-core', '@smm/shared', '@smm/core', 'date-fns', 'react-day-picker'],
  serverExternalPackages: ['@supabase/realtime-js'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  }
};

module.exports = nextConfig;
