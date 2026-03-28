import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["eslint", "react", "nextjs", "jsx-a11y", "import", "typescript"],
  options: {
    typeAware: true,
    typeCheck: true,
  },
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
