"use client";

import { MDXProvider } from "@mdx-js/react";

const components = {
  Playground: () => null,
};

export function PostRenderer({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
