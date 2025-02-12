import withMdx from "@next/mdx";
import withPlugins from "next-compose-plugins";
import withSvgr from "next-plugin-svgr";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  async redirects() {
    return [
      {
        source: "/jem",
        destination: "https://buttondown.email/agney",
        permanent: true,
      },
    ];
  },
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

export default withPlugins(
  [
    withSvgr,
    withMdx({
      extension: /\.mdx?$/,
    }),
  ],
  nextConfig,
);
