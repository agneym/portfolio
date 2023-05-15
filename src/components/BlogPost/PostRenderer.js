"use client";

import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";

export function PostRenderer({ code }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return <Component />;
}
