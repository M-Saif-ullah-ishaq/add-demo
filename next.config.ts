/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com", // for placeholder images
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net", // example OpenAI image host
        port: "",
        pathname: "/**",
      },
      // Add any other external image hosts here
    ],
  },
};

module.exports = nextConfig;
