import { defineConfig } from "cf/config";

export default defineConfig(({ isPreview }) => ({
  worker: {
    name: "portfolio",
    entrypoint: "@tanstack/react-start/server-entry",
    compatibilityDate: "2026-10-19",
    domains: ["agney.dev", "www.agney.dev"],
    workersDev: isPreview,
  },
}));
