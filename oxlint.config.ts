import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["eslint", "react", "nextjs", "jsx-a11y", "import", "typescript"],
  ignorePatterns: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
  settings: {
    next: {
      rootDir: ".",
    },
  },
});
