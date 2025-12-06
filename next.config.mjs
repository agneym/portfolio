import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // For Turbopack compatibility, plugins should be strings
    // But we need to use the actual imports for webpack
    remarkPlugins: [["remark-gfm"], ["remark-frontmatter"]],
    rehypePlugins: [["@mapbox/rehype-prism"]],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      {
        source: "/jem",
        destination: "https://buttondown.email/agney",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.svg": {
        as: "*.js",
        loaders: ["@svgr/webpack"],
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default withMDX(nextConfig);
