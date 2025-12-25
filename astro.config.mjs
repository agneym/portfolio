import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Google Sans Flex",
        cssVariable: "--font-heading",
        weights: ["100 900"],
        styles: ["normal"],
      },
    ],
  },
  integrations: [react(), mdx()],
  redirects: {
    "/jem": "https://buttondown.email/agney",
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "tokyo-night",
      },
    },
  },
  vite: {
    ssr: {
      noExternal: ["@agney/playground"],
    },
    resolve: {
      alias: {
        "prism-react-renderer/themes/nightOwl":
          "prism-react-renderer/themes/nightOwl/index.cjs.js",
        "prism-react-renderer/themes/duotoneLight":
          "prism-react-renderer/themes/duotoneLight/index.cjs.js",
      },
    },
  },
});
