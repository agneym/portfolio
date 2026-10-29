import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "portfolio",
    entrypoint: "@tanstack/react-start/server-entry",
    compatibilityDate: "2026-10-19",
    domains: ["agney.dev", "www.agney.dev"],
    previewUrls: true,
  },
});
