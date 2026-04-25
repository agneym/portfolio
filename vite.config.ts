import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import contentCollections from "@content-collections/vite";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
      images: path.resolve(__dirname, "src/images"),
    },
  },
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    contentCollections(),
    tanstackStart({
      srcDirectory: "src",
      router: {
        routesDirectory: "app",
        routeFileIgnorePattern: "(client\\.tsx|server\\.ts|providers\\.tsx)$",
      },
    }),
    viteReact(),
    svgr(),
  ],
});
