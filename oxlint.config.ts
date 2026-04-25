import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["eslint", "react", "jsx-a11y", "import", "typescript"],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  ignorePatterns: [
    "node_modules/**",
    "out/**",
    "build",
    "src/routeTree.gen.ts",
  ],
});
