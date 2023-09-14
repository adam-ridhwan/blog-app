/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'scontent-iad3-2.xx.fbcdn.net'],
  },
};

module.exports = nextConfig;
