const withSvgr = require("next-plugin-svgr");

/** @type {import('next').NextConfig} */
const nextConfig = withSvgr({
  experimental: {
    appDir: true,
  },
});

module.exports = nextConfig;
