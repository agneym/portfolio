import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  js.configs.recommended,
  ...nextCoreWebVitals,
  ...compat.config({
    extends: ["prettier"],
  }),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];
export default eslintConfig;
