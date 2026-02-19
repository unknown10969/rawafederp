/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Optimized for Hostinger deployment
  // Disable image optimization if not using Next.js Image component
  images: {
    unoptimized: true, // Hostinger-friendly: no image optimization server needed
  },
  // Ensure proper static file serving
  trailingSlash: false,
  webpack: (config, { dev }) => {
    if (dev && process.platform === "win32") config.cache = false;
    return config;
  },
};

export default nextConfig;
