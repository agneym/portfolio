import withMdx from "@next/mdx";
import withPlugins from "next-compose-plugins";
import withSvgr from "next-plugin-svgr";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
};

export default withPlugins(
  [
    withSvgr,
    withMdx({
      extension: /\.mdx?$/,
    }),
  ],
  nextConfig
);
