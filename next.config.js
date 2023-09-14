/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'scontent-bos5-1.xx.fbcdn.net'],
  },
};

module.exports = nextConfig;
