const nextConfig = {
  swcMinify: false, // This disables the use of native SWC
  compiler: {
    swcPlugins: [],  // Empty or fallback-only plugins
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
