import withMDX from "@next/mdx";
import withPlugins from "next-compose-plugins";
import withSvgr from "next-plugin-svgr";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = withPlugins(
  [
    withSvgr,
    withMDX({
      options: {
        remarkPlugins: [remarkGfm, remarkFrontmatter],
        rehypePlugins: [],
        // providerImportSource: "@mdx-js/react",
      },
    }),
  ],
  {
    pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  }
);

export default nextConfig;
