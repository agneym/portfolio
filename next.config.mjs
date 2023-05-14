import withMDX from "@next/mdx";
import withPlugins from "next-compose-plugins";
import withSvgr from "next-plugin-svgr";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = withPlugins(
  [
    withSvgr,
    withMDX({
      options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
      },
    }),
  ],
  {
    pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  }
);

export default nextConfig;
