import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  js.configs.recommended,
  ...compat.config({
    extends: ["prettier"],
  }),
  {
    ignores: ["node_modules/**", "dist/**", ".astro/**"],
  },
];
export default eslintConfig;
