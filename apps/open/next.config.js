/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@smm/ui-core', '@smm/shared', '@smm/core'],
  serverExternalPackages: ['@supabase/realtime-js']
};

module.exports = nextConfig;
