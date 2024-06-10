/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["client-common", "server-common", "models"],
  experimental: {
    serverComponentsExternalPackages: ["graphql"],
  },
};

export default nextConfig;
