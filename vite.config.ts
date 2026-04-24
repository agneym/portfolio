import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import contentCollections from "@content-collections/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
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
    nitro({
      prerender: {
        crawlLinks: true,
        failOnError: true,
      },
    }),
    svgr(),
  ],
});
