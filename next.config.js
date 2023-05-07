const withPlugins = require("next-compose-plugins");
const withSvgr = require("next-plugin-svgr");
const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = withPlugins([withSvgr, withMDX], {});

module.exports = nextConfig;
