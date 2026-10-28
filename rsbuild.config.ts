import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { tanstackStart } from "@tanstack/react-start/plugin/rsbuild";
import { pluginContentCollections } from "@agney/rsbuild-content-collections";
import { RsdoctorRspackPlugin } from "@rsdoctor/core";
import { cloudflare } from "rsbuild-plugin-cloudflare";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      components: path.resolve(import.meta.dirname, "src/components"),
      images: path.resolve(import.meta.dirname, "src/images"),
      webmarks: path.resolve(import.meta.dirname, "src/webmarks"),
    },
  },
  server: {
    port: 3000,
  },
  tools: {
    rspack: {
      plugins: [
        // Only registered on demand (`RSDOCTOR=true bun run build`) since it slows the build.
        process.env.RSDOCTOR === "true" &&
          new RsdoctorRspackPlugin({
            disableClientServer: true,
            // The loader probe breaks TanStack Start's loaders (proxies loaderContext).
            features: ["bundle", "plugins", "resolver"],
            output: { mode: "brief", options: { type: ["json"] } },
          }),
      ],
      // Rsbuild's built-in `?raw` only covers known asset types, not Markdown.
      module: {
        rules: [{ test: /\.md$/, resourceQuery: /raw/, type: "asset/source" }],
      },
    },
  },
  plugins: [
    pluginContentCollections(),
    pluginReact(),
    // Must come before tanstackStart(); builds its `ssr` environment for workerd.
    cloudflare({ rsbuildEnvironment: { name: "ssr" } }),
    pluginSvgr(),
    tanstackStart({
      srcDirectory: "src",
      router: {
        routesDirectory: "app",
        routeFileIgnorePattern: "(client\\.tsx|server\\.ts|providers\\.tsx)$",
      },
    }),
  ],
});
