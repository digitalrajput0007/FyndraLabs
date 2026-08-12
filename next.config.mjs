/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["firebase-admin", "jwks-rsa", "jose"],
};

export default nextConfig;
