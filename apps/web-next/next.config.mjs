/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "client-graphql",
    "client-stores",
    "server-common",
    "models",
  ],
  experimental: {
    serverComponentsExternalPackages: ["graphql"],
  },
};

export default nextConfig;
