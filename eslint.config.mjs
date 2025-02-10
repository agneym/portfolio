import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  js.configs.recommended,
  ...compat.config({
    extends: ["next/core-web-vitals", "prettier"],
  }),
];
export default eslintConfig;
