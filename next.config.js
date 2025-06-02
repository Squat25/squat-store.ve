/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.datocms-assets.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "datocms-assets.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: [
      "www.datocms-assets.com",
      "assets-global.website-files.com",
      "images.unsplash.com",
      "static.squat-store.com",
    ],
  },
};

module.exports = nextConfig;
